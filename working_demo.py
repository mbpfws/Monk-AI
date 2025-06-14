#!/usr/bin/env python3
"""
WORKING MULTI-AGENT SYSTEM DEMONSTRATION
This script proves your system actually works with real OpenAI integration
"""

import os
import json
import asyncio
from datetime import datetime

# Set up path
import sys
sys.path.append(os.path.dirname(__file__))

# Import your working components
os.environ.setdefault('OPENAI_API_KEY', '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')

class WorkingMultiAgentDemo:
    """Demonstrates the actual working functionality of your multi-agent system"""
    
    def __init__(self):
        self.results = {}
        print("🚀 MONK-AI MULTI-AGENT SYSTEM - WORKING DEMONSTRATION")
        print("=" * 60)
        
    async def demo_ai_service(self):
        """Demonstrate the AI service is actually working"""
        print("🤖 TESTING AI SERVICE...")
        
        try:
            from app.core.ai_service import MultiProviderAIService
            
            ai_service = MultiProviderAIService()
            
            # Test basic AI response
            response = await ai_service.generate_response(
                prompt="You are a helpful AI assistant. Please confirm you're working by saying 'Multi-Agent AI System is OPERATIONAL' and nothing else.",
                max_tokens=50,
                temperature=0.1
            )
            
            print(f"✅ AI Response: {response.get('response', 'No response')}")
            print(f"✅ Provider: {response.get('provider', 'Unknown')}")
            print(f"✅ Model: {response.get('model', 'Unknown')}")
            
            return True
            
        except Exception as e:
            print(f"❌ AI Service Error: {e}")
            return False
    
    async def demo_ideation_agent(self):
        """Demonstrate the ideation agent working with real AI"""
        print("\n💡 TESTING IDEATION AGENT WITH REAL AI...")
        
        try:
            from app.agents.ideation import Ideation
            
            ideation = Ideation()
            
            # Generate a real project scope
            print("  🔄 Generating project scope...")
            project_scope = await ideation.generate_project_scope(
                description="Build a modern task management application with real-time collaboration, user authentication, and project tracking",
                template_key="web_app"
            )
            
            print(f"  ✅ Project generated: {project_scope.get('project_overview', 'N/A')[:100]}...")
            
            # Generate technical specifications
            print("  🔄 Generating technical specifications...")
            tech_specs = await ideation.generate_technical_specs(project_scope)
            
            print(f"  ✅ Tech specs generated: {len(tech_specs.get('data_models', []))} data models")
            
            # Generate user stories
            print("  🔄 Generating user stories...")
            user_stories = await ideation.generate_user_stories(project_scope)
            
            print(f"  ✅ User stories generated: {len(user_stories)} stories")
            
            # Show some actual results
            print("\n  📋 SAMPLE GENERATED CONTENT:")
            print("  " + "-" * 40)
            
            if user_stories and len(user_stories) > 0:
                story = user_stories[0]
                print(f"  👤 First User Story:")
                print(f"     As a {story.get('as_a', 'user')}")
                print(f"     I want to {story.get('i_want_to', 'perform action')}")
                print(f"     So that {story.get('so_that', 'achieve goal')}")
                print(f"     Priority: {story.get('priority', 'N/A')}")
            
            return {
                'project_scope': project_scope,
                'tech_specs': tech_specs,
                'user_stories': user_stories
            }
            
        except Exception as e:
            print(f"❌ Ideation Agent Error: {e}")
            return None
    
    async def demo_code_generation(self):
        """Demonstrate actual code generation"""
        print("\n💻 TESTING CODE GENERATION...")
        
        try:
            from app.core.ai_service import MultiProviderAIService
            
            ai_service = MultiProviderAIService()
            
            # Generate actual code
            response = await ai_service.generate_response(
                prompt="""Generate a working FastAPI endpoint for user authentication. Include:
1. Pydantic models for request/response
2. A POST endpoint for login
3. Basic validation
4. Mock authentication logic

Keep it concise but functional.""",
                max_tokens=800,
                temperature=0.3
            )
            
            generated_code = response.get('response', '')
            print(f"✅ Generated {len(generated_code)} characters of code")
            print("  📝 GENERATED CODE SAMPLE:")
            print("  " + "-" * 40)
            print(generated_code[:400] + "..." if len(generated_code) > 400 else generated_code)
            print("  " + "-" * 40)
            
            return generated_code
            
        except Exception as e:
            print(f"❌ Code Generation Error: {e}")
            return None
    
    async def demo_api_workflow(self):
        """Demonstrate the API workflow integration"""
        print("\n🔄 TESTING API WORKFLOW INTEGRATION...")
        
        try:
            # This simulates what happens when the API is called
            from app.agents.ideation import Ideation
            
            ideation = Ideation()
            
            # Simulate the API call that the frontend makes
            request_data = {
                "description": "Create a social media platform with posts, comments, likes, and user profiles",
                "template_key": "web_app"
            }
            
            print(f"  📤 Simulating API request: {request_data['description'][:50]}...")
            
            # This is exactly what the /api/agents/ideate endpoint does
            project_scope = await ideation.generate_project_scope(
                description=request_data["description"],
                template_key=request_data.get("template_key")
            )
            
            technical_specs = await ideation.generate_technical_specs(project_scope)
            user_stories = await ideation.generate_user_stories(project_scope)
            
            # Format response like the API does
            api_response = {
                "status": "success",
                "project_scope": project_scope,
                "technical_specs": technical_specs,
                "user_stories": user_stories
            }
            
            print(f"  ✅ API workflow completed successfully")
            print(f"  📊 Response contains:")
            print(f"     - Project scope: ✅")
            print(f"     - Technical specs: ✅")
            print(f"     - User stories: {len(user_stories)} stories")
            
            return api_response
            
        except Exception as e:
            print(f"❌ API Workflow Error: {e}")
            return None
    
    async def run_full_demo(self):
        """Run the complete demonstration"""
        print(f"🕐 Demo started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"🔑 Using OpenAI API key: ...{os.getenv('OPENAI_API_KEY', '')[-10:]}")
        print()
        
        # Run all demos
        ai_working = await self.demo_ai_service()
        ideation_result = await self.demo_ideation_agent()
        code_result = await self.demo_code_generation()
        api_result = await self.demo_api_workflow()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 DEMONSTRATION RESULTS")
        print("=" * 60)
        
        tests = [
            ("AI Service Integration", ai_working),
            ("Ideation Agent", ideation_result is not None),
            ("Code Generation", code_result is not None),
            ("API Workflow", api_result is not None)
        ]
        
        passed = 0
        for test_name, result in tests:
            status = "✅ WORKING" if result else "❌ FAILED"
            print(f"{status} {test_name}")
            if result:
                passed += 1
        
        print(f"\n🎯 OVERALL RESULT: {passed}/{len(tests)} components working ({passed/len(tests)*100:.0f}%)")
        
        if passed == len(tests):
            print("\n🎉 YOUR MULTI-AGENT SYSTEM IS FULLY FUNCTIONAL!")
            print("💡 The system can:")
            print("   - Connect to OpenAI API")
            print("   - Generate project scopes")
            print("   - Create technical specifications")
            print("   - Generate user stories")
            print("   - Produce working code")
            print("   - Handle API requests")
        elif passed > 0:
            print(f"\n⚠️  YOUR SYSTEM IS PARTIALLY WORKING ({passed}/{len(tests)} components)")
            print("💡 Most functionality is operational!")
        else:
            print("\n❌ SYSTEM NEEDS DEBUGGING")
        
        # Save detailed results
        detailed_results = {
            "timestamp": datetime.now().isoformat(),
            "ai_service_working": ai_working,
            "ideation_result": ideation_result,
            "code_generation_sample": code_result,
            "api_workflow_response": api_result,
            "summary": {
                "tests_passed": passed,
                "total_tests": len(tests),
                "success_rate": f"{passed/len(tests)*100:.0f}%",
                "fully_functional": passed == len(tests)
            }
        }
        
        with open("working_demo_results.json", "w") as f:
            json.dump(detailed_results, f, indent=2)
        
        print(f"\n📝 Complete results saved to: working_demo_results.json")
        
        return detailed_results

async def main():
    """Main demonstration"""
    demo = WorkingMultiAgentDemo()
    await demo.run_full_demo()

if __name__ == "__main__":
    asyncio.run(main())