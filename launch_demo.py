#!/usr/bin/env python3
"""
HACKATHON DEMO LAUNCHER
Quick script to get everything running for judges
"""

import subprocess
import sys
import time
import os
from datetime import datetime

def print_banner():
    print("="*60)
    print("MONK-AI HACKATHON DEMO LAUNCHER")
    print("="*60)
    print(f"Started at: {datetime.now().strftime('%H:%M:%S')}")
    print()

def check_environment():
    """Check if we have what we need"""
    print("Checking environment...")
    
    # Check if we have OpenAI key
    openai_key = os.getenv('OPENAI_API_KEY')
    if not openai_key:
        print("❌ No OPENAI_API_KEY found in environment")
        return False
    else:
        print(f"✅ OpenAI API key found: ...{openai_key[-10:]}")
    
    # Check if we're in the right directory
    if not os.path.exists('app/main.py'):
        print("❌ Not in the correct directory (can't find app/main.py)")
        return False
    else:
        print("✅ Found app/main.py - in correct directory")
    
    return True

def print_demo_guide():
    """Print a quick demo guide for judges"""
    print("="*60)
    print("DEMO GUIDE FOR JUDGES")
    print("="*60)
    print()
    print("WHAT TO SHOW:")
    print("1. Multi-Agent AI System in action")
    print("2. Real-time project generation with OpenAI")
    print("3. Complete development workflow automation")
    print()
    print("DEMO FLOW:")
    print("1. Open frontend at http://localhost:3000")
    print("2. Click on a demo scenario (Task Management App)")
    print("3. Watch AI agents generate:")
    print("   - Project scope and requirements")
    print("   - Technical specifications")
    print("   - User stories and acceptance criteria")
    print("   - Code structure and API endpoints")
    print()
    print("KEY TALKING POINTS:")
    print("✅ Real OpenAI integration (not mock data)")
    print("✅ Multiple specialized AI agents working together")
    print("✅ Full-stack development workflow automation")
    print("✅ Production-ready FastAPI backend")
    print("✅ Modern React frontend with real-time updates")
    print()

def main():
    """Main demo launcher"""
    print_banner()
    
    # Check environment
    if not check_environment():
        print("\n❌ Environment check failed. Please fix the issues above.")
        return
    
    print_demo_guide()
    
    print("="*60)
    print("READY TO DEMO!")
    print("="*60)
    print()
    print("STEP 1: Start Backend")
    print("Run: python -m uvicorn app.main:app --reload --port 8000")
    print()
    print("STEP 2: Start Frontend") 
    print("In new terminal: cd frontend; npm start")
    print()
    print("STEP 3: Open http://localhost:3000")
    print()

if __name__ == "__main__":
    main()