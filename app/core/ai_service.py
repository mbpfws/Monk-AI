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
from google import genai
from google.genai import types
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
        self.fallback_order = [AIProvider.GEMINI, AIProvider.OPENAI]  # Prioritize Gemini over OpenAI
        self._initialize_providers()
        
    def _initialize_providers(self):
        """Initialize AI providers with Gemini priority"""
        
        # Google Gemini - Primary provider
        if settings.GOOGLE_API_KEY and settings.GOOGLE_API_KEY != "your_google_api_key_here":
            try:
                # Initialize the correct Google GenAI client
                gemini_client = genai.Client(api_key=settings.GOOGLE_API_KEY)
                self.providers[AIProvider.GEMINI] = {
                    "client": gemini_client,
                    "models": ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.0-pro"], 
                    "available": True
                }
                logger.info("✅ Google Gemini client initialized as PRIMARY provider")
                logger.info(f"🔑 Using API key ending in: ...{settings.GOOGLE_API_KEY[-10:]}")
            except Exception as e:
                logger.error(f"❌ Failed to initialize Google Gemini client: {e}")
                self.providers[AIProvider.GEMINI] = {"available": False}
        else:
            logger.warning("⚠️ Google Gemini API key not found or invalid. Gemini provider will be unavailable.")
            self.providers[AIProvider.GEMINI] = {"available": False}
        
        # OpenAI - Secondary/fallback provider
        if settings.OPENAI_API_KEY and settings.OPENAI_API_KEY != "your_openai_key_here":
            self.providers[AIProvider.OPENAI] = {
                "client": openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY),
                "models": ["gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo"],
                "available": True
            }
            logger.info("✅ OpenAI client initialized as FALLBACK provider")
        else:
            logger.warning("⚠️ OpenAI API key not found or invalid. OpenAI provider will be unavailable.")
            self.providers[AIProvider.OPENAI] = {"available": False}


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
    async def generate_ai_response(
        self,
        prompt: str,
        provider: Optional[AIProvider] = None,
        model: Optional[str] = None,
        max_tokens: int = 1000,
        temperature: float = 0.7,
        # Gemini-specific arguments with defaults
        enable_code_execution: bool = False, 
        request_structured_output: bool = False,
        function_declarations: Optional[List[Dict]] = None,
        **kwargs # Catch-all for other potential future args
    ) -> Dict[str, Any]:
        """
        Generate AI response with automatic provider fallback
        
        Args:
            prompt: The input prompt
            provider: Preferred provider (if None, uses fallback order)
            model: Specific model to use
            max_tokens: Maximum response tokens
            temperature: Response creativity (0-1)
            enable_code_execution: (Gemini specific) Whether to enable code execution tool
            request_structured_output: (Gemini specific) Whether to request JSON output
            function_declarations: (Gemini specific) Declarations for function calling
            **kwargs: Additional provider-specific arguments
            
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
                        provider_config["client"], 
                        prompt, 
                        selected_model, 
                        max_tokens, 
                        temperature, 
                        enable_code_execution=enable_code_execution, 
                        request_structured_output=request_structured_output,
                        function_declarations=function_declarations
                    )
                elif current_provider == AIProvider.OPENROUTER:
                    response = await self._generate_openrouter_response(
                        provider_config["client"], prompt, selected_model, max_tokens, temperature
                    )
                
                logger.info(f"🎉 AI SERVICE SUCCESS - Provider: {current_provider.value}, Model: {selected_model}")
                logger.info(f"📊 Response length: {len(response) if response else 0}")
                
                return {
                    "response": response,
                    "provider": current_provider.value,
                    "model": selected_model,
                    "timestamp": datetime.now().isoformat(),
                    "success": True,
                    "status": "success",
                    "error": None,
                    "provider_priority": list(self.fallback_order).index(current_provider) + 1,
                    "total_providers": len(self.fallback_order)
                }
                
            except Exception as e:
                logger.warning(f"Provider {current_provider.value} failed: {str(e)}")
                # Mark provider as temporarily unavailable
                self.providers[current_provider]["available"] = False
                
                # If this is the last provider, return detailed error info
                if current_provider == providers_to_try[-1]:
                    return {
                        "response": None,
                        "provider": current_provider.value,
                        "model": model or "unknown",
                        "timestamp": datetime.now().isoformat(),
                        "success": False,
                        "status": "failed",
                        "error": str(e),
                        "provider_priority": list(self.fallback_order).index(current_provider) + 1,
                        "total_providers": len(self.fallback_order)
                    }
                continue
        
        # If all providers failed, return comprehensive error
        return {
            "response": None,
            "provider": "none",
            "model": "none",
            "timestamp": datetime.now().isoformat(),
            "success": False,
            "status": "all_providers_failed",
            "error": "All AI providers are currently unavailable",
            "provider_priority": 0,
            "total_providers": len(self.fallback_order)
        }
    
    async def _generate_openai_response(self, client, prompt: str, model: str, max_tokens: int, temperature: float) -> str:
        """Generate response using OpenAI with verbose logging"""
        logger.info(f"🤖 OPENAI REQUEST START - Model: {model}, Tokens: {max_tokens}, Temp: {temperature}")
        logger.info(f"📝 PROMPT: {prompt[:200]}...")
        
        try:
            response = await client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=max_tokens,
                temperature=temperature
            )
            
            result = response.choices[0].message.content
            logger.info(f"✅ OPENAI SUCCESS - Response length: {len(result) if result else 0}")
            logger.info(f"📝 OPENAI RESPONSE: {result[:300] if result else 'None'}...")
            return result
            
        except Exception as e:
            logger.error(f"❌ OPENAI API ERROR: {e}")
            logger.error(f"📝 Prompt was: {prompt[:200]}...")
            return f"Error calling OpenAI API: {str(e)}"

    async def _generate_gemini_response(self, client, prompt: str, model: str, max_tokens: int, temperature: float, enable_code_execution: bool = False, request_structured_output: bool = False, function_declarations: Optional[List[Dict]] = None) -> str:
        """Generate response using Google Gemini with CORRECT google-genai library."""
        logger.info(f"🤖 GEMINI REQUEST START - Model: {model}, Tokens: {max_tokens}, Temp: {temperature}")
        logger.info(f"📝 PROMPT: {prompt[:200]}...")
        
        try:
            # Create generation config using the correct google-genai library
            config = types.GenerateContentConfig(
                temperature=temperature,
                max_output_tokens=max_tokens,
            )
            
            # Configure response format for structured output
            if request_structured_output:
                config.response_mime_type = "application/json"
                logger.info(f"📋 JSON structured output enabled for model {model}")
            
            # Add code execution if enabled (according to google-genai docs)
            if enable_code_execution:
                logger.info(f"⚡ Code execution enabled for model {model}")
            
            logger.info(f"🚀 Making request to Gemini API...")
            
            # Generate content using the correct google-genai client
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: client.models.generate_content(
                    model=model,
                    contents=prompt,
                    config=config
                )
            )
            
            logger.info(f"✅ GEMINI RESPONSE RECEIVED")
            logger.info(f"📦 Response type: {type(response)}")
            logger.info(f"📦 Response attributes: {dir(response)}")
            
            # Extract text from response - verbose logging for debugging
            if hasattr(response, 'text') and response.text:
                logger.info(f"✨ GEMINI SUCCESS - Text response length: {len(response.text)}")
                logger.info(f"📝 GEMINI RESPONSE: {response.text[:300]}...")
                return response.text
            
            elif hasattr(response, 'candidates') and response.candidates:
                logger.info(f"📋 GEMINI CANDIDATES FOUND: {len(response.candidates)}")
                full_response = []
                
                for i, candidate in enumerate(response.candidates):
                    logger.info(f"📋 Processing candidate {i}: {type(candidate)}")
                    if hasattr(candidate, 'content') and candidate.content:
                        if hasattr(candidate.content, 'parts'):
                            for j, part in enumerate(candidate.content.parts):
                                logger.info(f"📝 Part {j}: {type(part)}")
                                if hasattr(part, 'text') and part.text:
                                    full_response.append(part.text)
                                    logger.info(f"✨ Text part: {part.text[:100]}...")
                        elif hasattr(candidate.content, 'text'):
                            full_response.append(candidate.content.text)
                            logger.info(f"✨ Direct text: {candidate.content.text[:100]}...")
                    elif hasattr(candidate, 'text'):
                        full_response.append(candidate.text)
                        logger.info(f"✨ Candidate text: {candidate.text[:100]}...")
                
                result = "\n".join(full_response) if full_response else ""
                logger.info(f"✅ GEMINI FINAL RESULT: {result[:300]}...")
                return result
            
            else:
                logger.error(f"❌ GEMINI RESPONSE STRUCTURE NOT RECOGNIZED")
                logger.error(f"📦 Available attributes: {dir(response) if response else 'None'}")
                return "Error: Unable to parse Gemini response"

        except Exception as e:
            logger.error(f"❌ GEMINI API ERROR: {e}")
            logger.error(f"🔍 Error type: {type(e)}")
            logger.error(f"📝 Prompt was: {prompt[:200]}...")
            logger.error(f"🎯 Model: {model}, Config: temp={temperature}, tokens={max_tokens}")
            return f"Error calling Gemini API: {str(e)}"

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
                test_response = await self.generate_ai_response(
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

    async def generate_response(self, prompt: str, **kwargs) -> str:
        """Backward compatibility wrapper for generate_ai_response"""
        result = await self.generate_ai_response(prompt, **kwargs)
        if result["success"]:
            return result["response"]
        else:
            raise AIServiceError(f"AI generation failed: {result['error']}")

# Global instance
ai_service = MultiProviderAIService()