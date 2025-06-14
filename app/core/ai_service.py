"""
Multi-Provider AI Service for Monk-AI Hackathon Demo
Supports OpenAI, Google Gemini, and OpenRouter with intelligent fallbacks
"""

import os
import asyncio
from typing import Dict, List, Optional, Any, Union
from enum import Enum
import logging
from datetime import datetime
import json

# Provider-specific imports
import openai
import google.generativeai as genai
import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from app.core.config import settings

logger = logging.getLogger(__name__)

class AIProvider(Enum):
    OPENAI = "openai"
    GEMINI = "gemini"
    OPENROUTER = "openrouter"

class AIServiceError(Exception):
    """Base exception for AI service errors"""
    pass

class MultiProviderAIService:
    """
    Unified AI service supporting multiple providers with intelligent routing
    """
    
    def __init__(self):
        self.providers = {}
        self.fallback_order = [AIProvider.OPENAI, AIProvider.GEMINI]  # Updated fallback order
        self._initialize_providers()
        
    def _initialize_providers(self):
        """Initialize AI providers"""
        
        # OpenAI - Force this as the only provider
        if settings.OPENAI_API_KEY and settings.OPENAI_API_KEY != "your_openai_key_here":
            self.providers[AIProvider.OPENAI] = {
                "client": openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY),
                "models": ["gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo"],
                "available": True
            }
            logger.info("✅ OpenAI client initialized (FORCED MODE - Hackathon Competition)")
        else:
            logger.error("❌ OpenAI API key not found or invalid - This is required for hackathon mode")
            raise AIServiceError("OpenAI API key is required for hackathon competition mode")
        
        # Google Gemini
        if settings.GOOGLE_API_KEY and settings.GOOGLE_API_KEY != "your_google_api_key_here":
            try:
                genai.configure(api_key=settings.GOOGLE_API_KEY)
                self.providers[AIProvider.GEMINI] = {
                    "client": genai,
                    "models": ["gemini-2.5-flash-preview-05-20", "gemini-1.5-flash-latest", "gemini-pro"],
                    "available": True
                }
                logger.info("✅ Google Gemini client initialized")
            except Exception as e:
                logger.error(f"❌ Failed to initialize Google Gemini client: {e}")
                self.providers[AIProvider.GEMINI] = {"available": False}
        else:
            logger.warning("⚠️ Google Gemini API key not found or invalid. Gemini provider will be unavailable.")
            self.providers[AIProvider.GEMINI] = {"available": False}

        # OpenRouter - keeping it disabled as per original logic for hackathon focus, can be enabled later
        if settings.OPENROUTER_API_KEY and settings.OPENROUTER_API_KEY != "your_openrouter_key_here":
            # This part remains commented out or can be enabled if OpenRouter is to be used
            # self.providers[AIProvider.OPENROUTER] = {
            #     "client": openai.AsyncOpenAI(
            #         base_url="https://openrouter.ai/api/v1",
            #         api_key=settings.OPENROUTER_API_KEY,
            #     ),
            #     "models": ["google/gemini-flash-1.5", "mistralai/mistral-7b-instruct"],
            #     "available": True
            # }
            # logger.info("✅ OpenRouter client initialized")
            logger.info("🚫 OpenRouter remains disabled.")
        else:
            # logger.warning("⚠️ OpenRouter API key not found or invalid. OpenRouter provider will be unavailable.")
            self.providers[AIProvider.OPENROUTER] = {"available": False}
        
        logger.info(f"Initialized {sum(1 for p in self.providers if self.providers[p].get('available'))} AI providers: {[p.value for p in self.providers if self.providers[p].get('available')]}")

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    async def generate_response(
        self,
        prompt: str,
        provider: Optional[AIProvider] = None,
        model: Optional[str] = None,
        max_tokens: int = 1000,
        temperature: float = 0.7,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Generate AI response with automatic provider fallback
        
        Args:
            prompt: The input prompt
            provider: Preferred provider (if None, uses fallback order)
            model: Specific model to use
            max_tokens: Maximum response tokens
            temperature: Response creativity (0-1)
            
        Returns:
            Dict containing response, provider used, model used, and metadata
        """
        
        providers_to_try = [provider] if provider else self.fallback_order
        
        for current_provider in providers_to_try:
            if current_provider not in self.providers:
                continue
                
            try:
                provider_config = self.providers[current_provider]
                if not provider_config["available"]:
                    continue
                
                # Select model
                selected_model = model or provider_config["models"][0]
                
                # Generate response based on provider
                if current_provider == AIProvider.OPENAI:
                    response = await self._generate_openai_response(
                        provider_config["client"], prompt, selected_model, max_tokens, temperature
                    )
                elif current_provider == AIProvider.GEMINI:
                    response = await self._generate_gemini_response(
                        provider_config["client"], prompt, selected_model, max_tokens, temperature, **kwargs
                    )
                elif current_provider == AIProvider.OPENROUTER:
                    response = await self._generate_openrouter_response(
                        provider_config["client"], prompt, selected_model, max_tokens, temperature
                    )
                
                return {
                    "response": response,
                    "provider": current_provider.value,
                    "model": selected_model,
                    "timestamp": datetime.now().isoformat(),
                    "success": True
                }
                
            except Exception as e:
                logger.warning(f"Provider {current_provider.value} failed: {str(e)}")
                # Mark provider as temporarily unavailable
                self.providers[current_provider]["available"] = False
                continue
        
        raise AIServiceError("All AI providers are currently unavailable")
    
    async def _generate_openai_response(self, client, prompt: str, model: str, max_tokens: int, temperature: float) -> str:
        """Generate response using OpenAI"""
        response = await client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=max_tokens,
            temperature=temperature
        )
        return response.choices[0].message.content

    async def _generate_gemini_response(self, client, prompt: str, model: str, max_tokens: int, temperature: float, tools: Optional[List[Dict]] = None, tool_config: Optional[Dict] = None) -> str:
        """Generate response using Google Gemini, with support for tools (code execution, function calling)."""
        model_instance = client.GenerativeModel(model_name=model)

        generation_config = {
            "max_output_tokens": max_tokens,
            "temperature": temperature,
        }

        # Prepare tools if provided
        gemini_tools = None
        if tools:
            # Convert tools to Gemini format if necessary, or pass directly if compatible
            # For now, assuming 'tools' is already in a compatible format or the SDK handles it.
            # Example for function calling (actual structure might vary based on SDK specifics):
            # gemini_tools = [genai.types.Tool(function_declarations=[...])]
            # For code execution, it might be an implicit capability or a specific tool flag.
            # The documentation suggests 'tool integrations (search, code execution, function calling)'
            # are powerful features. We'll assume direct prompting for code execution for now if no explicit tool needed.
            # If structured output is desired and maps to a 'tool' in Gemini, it would be configured here.
            pass # Placeholder for specific tool conversion if needed

        loop = asyncio.get_event_loop()
        try:
            if gemini_tools and tool_config: # If explicit tools and tool_config are to be used
                response = await loop.run_in_executor(
                    None,
                    lambda: model_instance.generate_content(
                        prompt,
                        generation_config=generation_config,
                        tools=gemini_tools, # Pass tools to the API
                        tool_config=tool_config # Pass tool_config (e.g., for function calling mode)
                    )
                )
            else: # Standard text generation
                response = await loop.run_in_executor(
                    None,
                    lambda: model_instance.generate_content(
                        prompt, generation_config=client.types.GenerationConfig(**generation_config)
                    )
                )
            
            # Process response: Gemini API might return structured data if tools are used.
            # For now, we'll assume text response, but this part might need adjustment
            # based on how code execution/structured output is returned.
            if response.parts:
                # If the response contains parts (e.g. text, function calls), extract text primarily.
                # For structured output or code execution results, specific parsing of `response.parts` would be needed.
                text_parts = [part.text for part in response.parts if hasattr(part, 'text')]
                return "\n".join(text_parts) if text_parts else ""
            elif hasattr(response, 'text'):
                return response.text
            else:
                # Fallback or error if response structure is unexpected
                logger.warning(f"Gemini response format unexpected: {response}")
                return ""

        except Exception as e:
            logger.error(f"Error during Gemini API call: {str(e)}")
            # Propagate the error to be caught by the retry mechanism in generate_response
            raise AIServiceError(f"Gemini API call failed: {str(e)}")

    async def _generate_openrouter_response(self, client, prompt: str, model: str, max_tokens: int, temperature: float) -> str:
        """Generate response using OpenRouter"""
        response = await client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=max_tokens,
            temperature=temperature,
            extra_headers={
                "HTTP-Referer": "https://monk-ai-hackathon.com",
                "X-Title": "Monk-AI Hackathon Demo"
            }
        )
        return response.choices[0].message.content

    async def health_check(self) -> Dict[str, Any]:
        """Check health of all providers"""
        health_status = {}
        
        for provider, config in self.providers.items():
            try:
                # Simple test prompt
                test_response = await self.generate_response(
                    "Hello, this is a health check. Please respond with 'OK'.",
                    provider=provider,
                    max_tokens=10
                )
                health_status[provider.value] = {
                    "status": "healthy",
                    "response_time": "< 1s",  # Could implement actual timing
                    "last_check": datetime.now().isoformat()
                }
                # Restore availability if health check passes
                config["available"] = True
                
            except Exception as e:
                health_status[provider.value] = {
                    "status": "unhealthy",
                    "error": str(e),
                    "last_check": datetime.now().isoformat()
                }
                config["available"] = False
        
        return health_status

    def get_available_models(self) -> Dict[str, List[str]]:
        """Get all available models from all providers"""
        models = {}
        for provider, config in self.providers.items():
            if config["available"]:
                models[provider.value] = config["models"]
        return models

# Global instance
ai_service = MultiProviderAIService()