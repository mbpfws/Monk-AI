"""
AI Service for Monk-AI
"""

import os
import asyncio
from typing import Dict, Any
import logging
import json
import time

import backoff
from sqlalchemy.orm import Session
import openai
from openai import OpenAI
import google.generativeai as genai
from google.api_core import exceptions as google_exceptions

from app.core.config import settings
from app.crud import agent_log

logger = logging.getLogger(__name__)


class AIService:
    """A service for interacting with different AI providers."""

    def __init__(self, session: Session):
        """
        Initializes the AIService.
        
        Args:
            session (Session): The database session.
        """
        self.db = session
        self.openai_client = OpenAI(api_key=settings.OPENAI_API_KEY)
        self.gemini_client = genai.Client(api_key=settings.GOOGLE_API_KEY)
        self.providers = [
            self._get_gemini_response,
            self._get_openai_response,
        ]

    async def generate_text_with_failover(self, prompt: str, max_retries: int = 3) -> Dict[str, Any]:
        """
        Generates text using a sequence of AI providers with failover.

        Tries providers in a predefined order. If one fails, it tries the next.
        This process is repeated up to max_retries.

        Args:
            prompt (str): The prompt to send to the AI.
            max_retries (int): The maximum number of attempts across all providers.

        Returns:
            Dict[str, Any]: The successful response from an AI provider.

        Raises:
            Exception: If all providers fail for the given number of retries.
        """
        last_exception = None
        for attempt in range(max_retries):
            logger.info(f"AI generation attempt #{attempt + 1} of {max_retries}")
            for provider_func in self.providers:
                provider_name = provider_func.__name__.replace("_get_", "").replace("_response", "")
                try:
                    logger.info(f"Trying provider: {provider_name}")
                    response = await provider_func(prompt)
                    
                    if self._is_response_valid(response):
                        logger.info(f"Provider {provider_name} returned a valid response.")
                        return response
                    else:
                        logger.warning(f"Provider {provider_name} returned an invalid or empty response. Trying next provider.")
                        last_exception = ValueError(f"Invalid response from {provider_name}")
                        continue

                except Exception as e:
                    last_exception = e
                    logger.error(f"Provider {provider_name} failed: {e}", exc_info=True)
                    continue
        
        logger.critical(f"All AI providers failed after {max_retries} attempts.")
        raise Exception(f"All AI providers failed. Last error: {last_exception}") from last_exception

    def _is_response_valid(self, response: Dict[str, Any]) -> bool:
        """
        Validates the AI response.
        """
        return bool(response and response.get("content"))

    async def generate_text(self, prompt: str, agent_id: int, task_id: int) -> Dict[str, Any]:
        """
        Generates text for a given prompt and logs the interaction.
        """
        start_time = time.time()
        
        response_data = await self.generate_text_with_failover(prompt)
        
        end_time = time.time()
        duration = end_time - start_time

        log_entry = {
            "agent_id": agent_id,
            "task_id": task_id,
            "prompt": prompt,
            "response": response_data.get("content", ""),
            "raw_response": json.dumps(response_data.get("raw", "")),
            "provider": response_data.get("provider", "unknown"),
            "duration": duration,
        }
        # This assumes agent_log.create is not an async function
        agent_log.create(self.db, obj_in=log_entry)

        return response_data

    @backoff.on_exception(backoff.expo, (google_exceptions.ResourceExhausted, google_exceptions.ServiceUnavailable), max_tries=3)
    async def _get_gemini_response(self, prompt: str) -> Dict[str, Any]:
        """Gets a response from Gemini API."""
        logger.info("Attempting to get response from Gemini...")
        try:
            model = self.gemini_client.get_model("models/gemini-1.5-flash-latest")
            response = model.generate_content(prompt)
            
            logger.info("Successfully received response from Gemini.")
            response_text = response.text
            logger.info(f"Raw Gemini response: {response_text}")

            return {
                "provider": "gemini",
                "content": response_text,
                "raw": response_text
            }
        except Exception as e:
            logger.error(f"Error getting response from Gemini: {e}", exc_info=True)
            raise

    @backoff.on_exception(backoff.expo, openai.RateLimitError, max_tries=3)
    async def _get_openai_response(self, prompt: str) -> Dict[str, Any]:
        """Gets a response from OpenAI's API."""
        logger.info("Attempting to get response from OpenAI...")
        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
            )
            logger.info("Successfully received response from OpenAI.")
            choice = response.choices[0]
            response_text = choice.message.content

            logger.info(f"Raw OpenAI response: {response_text}")

            return {
                "provider": "openai",
                "content": response_text,
                "raw": choice.model_dump_json()
            }
        except Exception as e:
            logger.error(f"Error getting response from OpenAI: {e}", exc_info=True)
            raise

    async def generate_json_output(self, prompt: str, output_schema: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generates a JSON output from a prompt using a specified schema.
        This is a placeholder and needs to be implemented with proper failover.
        """
        # For now, this just uses OpenAI. It should be updated to use the failover logic.
        logger.info("Generating JSON output with OpenAI...")
        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful assistant that always responds in JSON format.",
                    },
                    {"role": "user", "content": prompt},
                ],
                response_format={"type": "json_object", "schema": output_schema},
            )
            json_response = json.loads(response.choices[0].message.content)
            logger.info("Successfully generated JSON from OpenAI.")
            return json_response
        except Exception as e:
            logger.error(f"Error generating JSON from OpenAI: {e}", exc_info=True)
            raise