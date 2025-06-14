import asyncio
import json
import requests
from app.core.ai_service import MultiProviderAIService
from app.agents.ideation import Ideation

async def test_ai_service_directly():
    """Test the AI service directly"""
    print("Testing AI service directly...")
    try:
        ai_service = MultiProviderAIService()
        print(f"Available providers: {list(ai_service.providers.keys())}")
        
        # Test a simple prompt
        response = await ai_service.generate_response(
            prompt="Hello, please respond with a simple JSON object containing a greeting.",
            model="gpt-4o-mini",
            temperature=0.7,
            max_tokens=100
        )
        print(f"AI Service Response: {response}")
        print(f"Response type: {type(response)}")
        
        if isinstance(response, dict) and 'response' in response:
            print(f"Actual content: {response['response']}")
        
    except Exception as e:
        print(f"AI Service Error: {e}")
        import traceback
        traceback.print_exc()

async def test_ideation_agent():
    """Test the ideation agent directly"""
    print("\nTesting ideation agent directly...")
    try:
        ideation = Ideation()
        result = await ideation.generate_project_scope("A simple todo app")
        print(f"Ideation Result: {json.dumps(result, indent=2)}")
    except Exception as e:
        print(f"Ideation Error: {e}")
        import traceback
        traceback.print_exc()

def test_endpoint():
    """Test the HTTP endpoint"""
    print("\nTesting HTTP endpoint...")
    try:
        response = requests.post(
            "http://localhost:8000/api/agents/ideate",
            json={"description": "A simple todo app"},
            timeout=30
        )
        print(f"HTTP Status: {response.status_code}")
        print(f"HTTP Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"HTTP Error: {e}")

async def main():
    await test_ai_service_directly()
    await test_ideation_agent()
    test_endpoint()

if __name__ == "__main__":
    asyncio.run(main())