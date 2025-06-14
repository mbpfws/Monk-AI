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
        self.fallback_order = [AIProvider.OPENAI, AIProvider.GEMINI, AIProvider.OPENROUTER]
        self._initialize_providers()
        
    def _initialize_providers(self):
        """Initialize all available AI providers"""
        
        # OpenAI
        if settings.OPENAI_API_KEY and settings.OPENAI_API_KEY != "your_openai_key_here":
            self.providers[AIProvider.OPENAI] = {
                "client": openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY),
                "models": ["gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo"],
                "available": True
            }
            logger.info("✅ OpenAI client initialized")
        
        # Google Gemini
        if hasattr(settings, 'GOOGLE_API_KEY') and settings.GOOGLE_API_KEY != "your_google_gemini_key_here":
            genai.configure(api_key=settings.GOOGLE_API_KEY)
            self.providers[AIProvider.GEMINI] = {
                "client": genai,
                "models": ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-2.0-flash-exp"],
                "available": True
            }
            logger.info("✅ Google Gemini client initialized")
        
        # OpenRouter (uses OpenAI-compatible API)
        if hasattr(settings, 'OPENROUTER_API_KEY') and settings.OPENROUTER_API_KEY != "your_openrouter_key_here":
            self.providers[AIProvider.OPENROUTER] = {
                "client": openai.AsyncOpenAI(
                    base_url="https://openrouter.ai/api/v1",
                    api_key=settings.OPENROUTER_API_KEY
                ),
                "models": ["openai/gpt-4o", "anthropic/claude-3-sonnet", "google/gemini-pro"],
                "available": True
            }
            logger.info("✅ OpenRouter client initialized")
        
        logger.info(f"Initialized {len(self.providers)} AI providers: {list(self.providers.keys())}")

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
                        provider_config["client"], prompt, selected_model, max_tokens, temperature
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

    async def _generate_gemini_response(self, client, prompt: str, model: str, max_tokens: int, temperature: float) -> str:
        """Generate response using Google Gemini"""
        # Note: Gemini API calls are not async in the current SDK
        # Running in thread pool to avoid blocking
        model_instance = client.GenerativeModel(model)
        
        generation_config = client.types.GenerationConfig(
            max_output_tokens=max_tokens,
            temperature=temperature
        )
        
        # Run in thread pool since Gemini SDK is not async
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None, 
            lambda: model_instance.generate_content(prompt, generation_config=generation_config)
        )
        
        return response.text

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