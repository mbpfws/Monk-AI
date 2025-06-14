#!/usr/bin/env python3
"""
🚀 MONK-AI HACKATHON COMPLETE WORKFLOW DEMO
Real-case scenario testing with all 7 agents working together!
"""

import asyncio
import aiohttp
import json
import time
from datetime import datetime
from typing import Dict, Any

class MonkAIWorkflowDemo:
    """Complete workflow demonstration for Monk-AI hackathon"""
    
    def __init__(self):
        self.base_url = "http://localhost:8000"
        self.frontend_url = "http://localhost:3000"
        self.demo_results = {
            "timestamp": datetime.now().isoformat(),
            "demo_name": "🚀 Monk-AI Complete Workflow Demo",
            "agents_tested": [],
            "total_time": 0,
            "success_count": 0,
            "error_count": 0
        }
    
    async def run_complete_demo(self):
        """Run the complete workflow demo"""
        print("🎯 STARTING MONK-AI HACKATHON DEMO")
        print("=" * 60)
        
        start_time = time.time()
        
        # Test sample code for all agents
        sample_code = '''
def calculate_fibonacci(n):
    if n <= 1:
        return n
    else:
        return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)

def process_user_data(user_input):
    # Potential security issue - no input validation
    query = f"SELECT * FROM users WHERE name = '{user_input}'"
    return query

class UserManager:
    def __init__(self):
        self.users = []
    
    def add_user(self, name, email):
        user = {"name": name, "email": email}
        self.users.append(user)
        return user
'''
        
        # 1. Test Code Optimizer Agent
        await self.test_code_optimizer(sample_code)
        
        # 2. Test Documentation Generator Agent  
        await self.test_doc_generator(sample_code)
        
        # 3. Test Security Analyzer Agent
        await self.test_security_analyzer(sample_code)
        
        # 4. Test Test Generator Agent
        await self.test_test_generator(sample_code)
        
        # 5. Test Ideation Agent
        await self.test_ideation_agent()
        
        # 6. Test PR Reviewer Agent
        await self.test_pr_reviewer()
        
        # 7. Test Orchestrator Agent (Full Workflow)
        await self.test_orchestrator()
        
        # Calculate total time
        total_time = time.time() - start_time
        self.demo_results["total_time"] = round(total_time, 2)
        
        # Print final results
        self.print_demo_results()
    
    async def test_code_optimizer(self, code: str):
        """Test the Code Optimizer Agent"""
        print("\n🔧 TESTING CODE OPTIMIZER AGENT")
        print("-" * 40)
        
        try:
            async with aiohttp.ClientSession() as session:
                payload = {
                    "code": code,
                    "language": "python",
                    "focus_areas": ["performance", "memory_usage"]
                }
                
                async with session.post(f"{self.base_url}/api/agents/optimize", json=payload) as response:
                    if response.status == 200:
                        result = await response.json()
                        print("✅ Code Optimizer: SUCCESS")
                        print(f"   📊 Optimization Score: {result.get('optimization_score', {}).get('overall_score', 'N/A')}")
                        print(f"   ⚡ Performance Improvement: {result.get('performance_projections', {}).get('estimated_speedup', 'N/A')}x")
                        print(f"   💾 Memory Reduction: {result.get('performance_projections', {}).get('memory_reduction', 'N/A')}%")
                        
                        self.demo_results["agents_tested"].append("code_optimizer")
                        self.demo_results["success_count"] += 1
                    else:
                        print(f"❌ Code Optimizer: FAILED (Status: {response.status})")
                        self.demo_results["error_count"] += 1
                        
        except Exception as e:
            print(f"❌ Code Optimizer: ERROR - {e}")
            self.demo_results["error_count"] += 1
    
    async def test_doc_generator(self, code: str):
        """Test the Documentation Generator Agent"""
        print("\n📝 TESTING DOCUMENTATION GENERATOR AGENT")
        print("-" * 40)
        
        try:
            async with aiohttp.ClientSession() as session:
                payload = {
                    "code": code,
                    "language": "python",
                    "context": "API documentation for user management system"
                }
                
                async with session.post(f"{self.base_url}/api/agents/document", json=payload) as response:
                    if response.status == 200:
                        result = await response.json()
                        print("✅ Doc Generator: SUCCESS")
                        print(f"   📄 Documentation Type: {result.get('documentation_type', 'Comprehensive')}")
                        print(f"   📊 Quality Score: {result.get('quality_metrics', {}).get('overall_score', 'N/A')}")
                        print(f"   🔍 Coverage: {result.get('quality_metrics', {}).get('coverage_percentage', 'N/A')}%")
                        
                        self.demo_results["agents_tested"].append("doc_generator")
                        self.demo_results["success_count"] += 1
                    else:
                        print(f"❌ Doc Generator: FAILED (Status: {response.status})")
                        self.demo_results["error_count"] += 1
                        
        except Exception as e:
            print(f"❌ Doc Generator: ERROR - {e}")
            self.demo_results["error_count"] += 1
    
    async def test_security_analyzer(self, code: str):
        """Test the Security Analyzer Agent"""
        print("\n🔒 TESTING SECURITY ANALYZER AGENT")
        print("-" * 40)
        
        try:
            async with aiohttp.ClientSession() as session:
                payload = {
                    "code": code,
                    "language": "python",
                    "focus_areas": ["sql_injection", "input_validation"]
                }
                
                async with session.post(f"{self.base_url}/api/agents/security-analyze", json=payload) as response:
                    if response.status == 200:
                        result = await response.json()
                        print("✅ Security Analyzer: SUCCESS")
                        print(f"   🛡️ Security Score: {result.get('security_score', {}).get('overall_score', 'N/A')}")
                        print(f"   ⚠️ Vulnerabilities Found: {result.get('vulnerability_summary', {}).get('total_issues', 'N/A')}")
                        print(f"   🔥 Critical Issues: {result.get('vulnerability_summary', {}).get('critical_count', 'N/A')}")
                        
                        self.demo_results["agents_tested"].append("security_analyzer")
                        self.demo_results["success_count"] += 1
                    else:
                        print(f"❌ Security Analyzer: FAILED (Status: {response.status})")
                        self.demo_results["error_count"] += 1
                        
        except Exception as e:
            print(f"❌ Security Analyzer: ERROR - {e}")
            self.demo_results["error_count"] += 1
    
    async def test_test_generator(self, code: str):
        """Test the Test Generator Agent"""
        print("\n🧪 TESTING TEST GENERATOR AGENT")
        print("-" * 40)
        
        try:
            async with aiohttp.ClientSession() as session:
                payload = {
                    "code": code,
                    "language": "python",
                    "test_framework": "pytest"
                }
                
                async with session.post(f"{self.base_url}/api/agents/generate-tests", json=payload) as response:
                    if response.status == 200:
                        result = await response.json()
                        print("✅ Test Generator: SUCCESS")
                        print(f"   🎯 Test Coverage: {result.get('coverage_analysis', {}).get('estimated_coverage', 'N/A')}%")
                        print(f"   📊 Tests Generated: {result.get('test_summary', {}).get('total_tests', 'N/A')}")
                        print(f"   ⚡ Test Types: {', '.join(result.get('test_summary', {}).get('test_types', []))}")
                        
                        self.demo_results["agents_tested"].append("test_generator")
                        self.demo_results["success_count"] += 1
                    else:
                        print(f"❌ Test Generator: FAILED (Status: {response.status})")
                        self.demo_results["error_count"] += 1
                        
        except Exception as e:
            print(f"❌ Test Generator: ERROR - {e}")
            self.demo_results["error_count"] += 1
    
    async def test_ideation_agent(self):
        """Test the Ideation Agent"""
        print("\n💡 TESTING IDEATION AGENT")
        print("-" * 40)
        
        try:
            async with aiohttp.ClientSession() as session:
                payload = {
                    "description": "Build a modern task management app for development teams with real-time collaboration",
                    "template_key": "web_app"
                }
                
                async with session.post(f"{self.base_url}/api/agents/ideate", json=payload) as response:
                    if response.status == 200:
                        result = await response.json()
                        print("✅ Ideation Agent: SUCCESS")
                        print(f"   🎯 Project Scope: {result.get('project_scope', {}).get('title', 'Generated')}")
                        print(f"   📋 User Stories: {len(result.get('user_stories', []))} stories created")
                        print(f"   🏗️ Tech Stack: {', '.join(result.get('technical_specs', {}).get('tech_stack', [])[:3])}")
                        
                        self.demo_results["agents_tested"].append("ideation")
                        self.demo_results["success_count"] += 1
                    else:
                        print(f"❌ Ideation Agent: FAILED (Status: {response.status})")
                        self.demo_results["error_count"] += 1
                        
        except Exception as e:
            print(f"❌ Ideation Agent: ERROR - {e}")
            self.demo_results["error_count"] += 1
    
    async def test_pr_reviewer(self):
        """Test the PR Reviewer Agent"""
        print("\n👁️ TESTING PR REVIEWER AGENT")
        print("-" * 40)
        
        try:
            async with aiohttp.ClientSession() as session:
                payload = {
                    "pr_url": "https://github.com/mbpfws/Monk-AI/pull/1",
                    "repository": "mbpfws/Monk-AI",
                    "branch": "fix-nested-structure"
                }
                
                async with session.post(f"{self.base_url}/api/agents/review-pr", json=payload) as response:
                    if response.status == 200:
                        result = await response.json()
                        print("✅ PR Reviewer: SUCCESS")
                        print(f"   📊 Review Score: {result.get('review_summary', {}).get('overall_score', 'N/A')}")
                        print(f"   🔍 Issues Found: {result.get('review_summary', {}).get('total_issues', 'N/A')}")
                        print(f"   ✅ Approval Status: {result.get('review_summary', {}).get('recommendation', 'N/A')}")
                        
                        self.demo_results["agents_tested"].append("pr_reviewer")
                        self.demo_results["success_count"] += 1
                    else:
                        print(f"❌ PR Reviewer: FAILED (Status: {response.status})")
                        self.demo_results["error_count"] += 1
                        
        except Exception as e:
            print(f"❌ PR Reviewer: ERROR - {e}")
            self.demo_results["error_count"] += 1
    
    async def test_orchestrator(self):
        """Test the Orchestrator Agent (Full Workflow)"""
        print("\n🎼 TESTING ORCHESTRATOR AGENT (FULL WORKFLOW)")
        print("-" * 40)
        
        try:
            async with aiohttp.ClientSession() as session:
                payload = {
                    "workflow_type": "full_development",
                    "description": "Create a secure user authentication system with JWT tokens",
                    "language": "python"
                }
                
                async with session.post(f"{self.base_url}/api/agents/full-workflow", json=payload) as response:
                    if response.status == 200:
                        result = await response.json()
                        print("✅ Orchestrator: SUCCESS")
                        print(f"   🎯 Workflow Status: {result.get('status', 'N/A')}")
                        print(f"   ⏱️ Processing Time: {result.get('processing_time', 'N/A')}s")
                        print(f"   🔧 Agents Used: {result.get('agents_involved', 'N/A')}")
                        
                        self.demo_results["agents_tested"].append("orchestrator")
                        self.demo_results["success_count"] += 1
                    else:
                        print(f"❌ Orchestrator: FAILED (Status: {response.status})")
                        self.demo_results["error_count"] += 1
                        
        except Exception as e:
            print(f"❌ Orchestrator: ERROR - {e}")
            self.demo_results["error_count"] += 1
    
    def print_demo_results(self):
        """Print the final demo results"""
        print("\n" + "=" * 60)
        print("🏆 MONK-AI HACKATHON DEMO RESULTS")
        print("=" * 60)
        
        print(f"📅 Demo Time: {self.demo_results['timestamp']}")
        print(f"⏱️ Total Duration: {self.demo_results['total_time']}s")
        print(f"✅ Successful Tests: {self.demo_results['success_count']}")
        print(f"❌ Failed Tests: {self.demo_results['error_count']}")
        print(f"📊 Success Rate: {round((self.demo_results['success_count'] / (self.demo_results['success_count'] + self.demo_results['error_count'])) * 100, 1)}%")
        
        print(f"\n🤖 Agents Tested Successfully:")
        for agent in self.demo_results['agents_tested']:
            print(f"   ✅ {agent.replace('_', ' ').title()}")
        
        print(f"\n🎯 DEMO STATUS: {'🎉 SUCCESS!' if self.demo_results['error_count'] == 0 else '⚠️ PARTIAL SUCCESS'}")
        
        if self.demo_results['error_count'] == 0:
            print("\n🚀 ALL AGENTS WORKING PERFECTLY!")
            print("💯 READY FOR HACKATHON SUBMISSION!")
        
        print("=" * 60)

async def main():
    """Run the complete Monk-AI workflow demo"""
    demo = MonkAIWorkflowDemo()
    await demo.run_complete_demo()

if __name__ == "__main__":
    asyncio.run(main()) 