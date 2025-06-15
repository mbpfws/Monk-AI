from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
import uvicorn
from dotenv import load_dotenv
from datetime import datetime
from pydantic import BaseModel
from typing import Dict, Any, Optional, List
import asyncio
import json

from .core.database import engine, Base

def init_db():
    """Initialize the database and create tables."""
    try:
        print("🚀 Initializing database...")
        Base.metadata.create_all(bind=engine)
        print("✅ Database initialized successfully.")
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")

# Initialize database on startup
init_db()

# Load environment variables
load_dotenv()

app = FastAPI(
    title="🧙‍♂️ Monk-AI TraeDevMate API",
    description="AI-Powered Multi-Agent Developer Productivity System",
    version="1.0.0"
)

# Configure CORS for frontend communication - Fixed for proper preflight handling
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001"],  # React dev server
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # Explicitly include OPTIONS
    allow_headers=["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
    expose_headers=["*"],
)

# Include API routers
try:
    from .api.api import api_router
    app.include_router(api_router, prefix="/api")
    print("✅ Main API router loaded successfully")
except Exception as e:
    print(f"❌ Failed to load main API router: {e}")

# Try to import and include agents router
try:
    from .api.routes.agents import router as agents_router
    app.include_router(agents_router, prefix="/api/agents", tags=["agents"])
    print("✅ Agents router loaded successfully")
except Exception as e:
    print(f"❌ Failed to load agents router: {e}")

# Try to import and include workflow router
try:
    from .api.routes.workflow import router as workflow_router
    app.include_router(workflow_router, prefix="/api/workflow", tags=["workflow"])
    print("✅ Workflow router loaded successfully")
except Exception as e:
    print(f"❌ Failed to load workflow router: {e}")

# Request/Response Models
class ProjectScopeRequest(BaseModel):
    description: str
    template_key: Optional[str] = "web_app"

class TechnicalSpecsRequest(BaseModel):
    project_scope: Dict[str, Any]

class UserStoriesRequest(BaseModel):
    project_scope: Dict[str, Any]

class SprintPlanRequest(BaseModel):
    user_stories: List[Dict[str, Any]]
    sprint_count: Optional[int] = 3

class CodeOptimizeRequest(BaseModel):
    code: str
    language: str
    focus_areas: Optional[List[str]] = ["performance", "readability"]

class DocsGenerateRequest(BaseModel):
    code: str
    language: str
    doc_type: Optional[str] = "comprehensive"

class TestGenerateRequest(BaseModel):
    code: str
    language: str
    test_type: Optional[str] = "unit"

class SecurityAnalyzeRequest(BaseModel):
    code: str
    language: str

class PRReviewRequest(BaseModel):
    pr_url: Optional[str] = None
    repository: Optional[str] = None
    branch: Optional[str] = "main"
    code: Optional[str] = None

# Frontend-Compatible API Endpoints

@app.get("/")
async def root():
    return {
        "message": "🧙‍♂️ Monk-AI TraeDevMate API",
        "status": "🚀 Active and Ready for Hackathon Demo!",
        "version": "1.0.0",
        "agents": ["ideation", "code_optimizer", "doc_generator", "security_analyzer", "test_generator", "pr_reviewer"],
        "frontend_url": "http://localhost:3000",
        "backend_url": "http://localhost:8000",
        "docs_url": "/docs"
    }

# PROJECT IDEATION ENDPOINTS (for Ideation.tsx)
@app.post("/api/generate-project-scope")
async def generate_project_scope(request: ProjectScopeRequest):
    """Generate project scope - compatible with frontend"""
    try:
        from .agents.ideation import Ideation
        ideation = Ideation()
        
        project_scope = ideation.generate_project_scope(
            description=request.description,
            template_key=request.template_key
        )
        
        return {
            "status": "success",
            "project_scope": project_scope,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "project_scope": {
                "project_name": f"Generated: {request.description[:50]}...",
                "description": request.description,
                "key_features": ["Feature 1", "Feature 2", "Feature 3"],
                "tech_stack": ["Python", "FastAPI", "React"]
            }
        }

@app.post("/api/generate-technical-specs")
async def generate_technical_specs(request: TechnicalSpecsRequest):
    """Generate technical specifications"""
    return {
        "status": "success",
        "technical_specs": {
            "architecture": {
                "type": "Microservices",
                "pattern": "MVC",
                "database": "PostgreSQL",
                "cache": "Redis"
            },
            "data_models": [
                {
                    "name": "User",
                    "fields": [
                        {"name": "id", "type": "UUID", "description": "Unique identifier"},
                        {"name": "email", "type": "String", "description": "User email"},
                        {"name": "password", "type": "String", "description": "Hashed password"}
                    ]
                }
            ],
            "api_endpoints": [
                {
                    "path": "/api/auth",
                    "methods": ["POST", "GET"],
                    "description": "Authentication endpoints"
                }
            ],
            "third_party_integrations": [
                {
                    "name": "OpenAI",
                    "purpose": "AI assistance",
                    "implementation": "API integration"
                }
            ]
        }
    }

@app.post("/api/generate-user-stories")
async def generate_user_stories(request: UserStoriesRequest):
    """Generate user stories"""
    return {
        "status": "success",
        "user_stories": [
            {
                "id": "US001",
                "title": "User Registration",
                "description": "As a new user, I want to register for an account so that I can access the platform",
                "acceptance_criteria": ["Valid email required", "Password strength validation", "Email verification"],
                "priority": "High",
                "story_points": 3
            },
            {
                "id": "US002", 
                "title": "User Login",
                "description": "As a registered user, I want to login to my account so that I can access my data",
                "acceptance_criteria": ["Email/password authentication", "Remember me option", "Forgot password link"],
                "priority": "High",
                "story_points": 2
            }
        ]
    }

@app.post("/api/generate-sprint-plan")
async def generate_sprint_plan(request: SprintPlanRequest):
    """Generate sprint plan"""
    return {
        "status": "success",
        "sprint_plan": {
            "total_sprints": request.sprint_count,
            "sprint_duration": "2 weeks",
            "sprints": [
                {
                    "sprint_number": 1,
                    "name": "Foundation Sprint",
                    "goals": ["Set up project structure", "Implement authentication"],
                    "user_stories": ["US001", "US002"],
                    "duration": "2 weeks"
                }
            ]
        }
    }

# CODE OPTIMIZATION ENDPOINT (for CodeOptimizer.tsx)
@app.post("/api/optimize-code")
async def optimize_code(request: CodeOptimizeRequest):
    """Optimize code - compatible with frontend"""
    try:
        from .agents.code_optimizer import CodeOptimizer
        optimizer = CodeOptimizer()
        
        result = await optimizer.optimize_code(
            code=request.code,
            language=request.language,
            focus_areas=request.focus_areas
        )
        
        return {
            "status": "success",
            "optimizations": result.get("optimizations", {}),
            "summary": result.get("recommendations_summary", {})
        }
    except Exception as e:
        return {
            "status": "error",
            "optimizations": {},
            "summary": {"error": str(e)}
        }

# DOCS GENERATION ENDPOINT (for DocGenerator.tsx)
@app.post("/api/generate-docs")
async def generate_docs(request: DocsGenerateRequest):
    """Generate documentation for code - compatible with frontend"""
    try:
        from .agents.doc_generator import DocGenerator
        doc_generator = DocGenerator()
        
        # Log the request
        print(f"Generating docs for {request.language} code.")
        
        result = await doc_generator.generate_docs(
            code=request.code,
            language=request.language,
            context=request.doc_type  # Using doc_type as context
        )
        
        return result
    except Exception as e:
        print(f"Error in generate_docs endpoint: {e}")
        return {
            "status": "error",
            "documentation": {"overview": f"Error generating docs: {e}"}
        }

# TEST GENERATION ENDPOINT (for TestGenerator.tsx)
@app.post("/api/generate-tests")
async def generate_tests(request: TestGenerateRequest):
    """Generate tests for code - compatible with frontend"""
    try:
        from .agents.test_generator import TestGenerator
        test_generator = TestGenerator()
        
        result = await test_generator.generate_tests(
            code=request.code,
            language=request.language,
            test_framework=request.test_framework
        )
        
        return result
    except Exception as e:
        return {
            "status": "error",
            "message": f"Error generating tests: {e}"
        }

# SECURITY ANALYSIS ENDPOINT (for SecurityAnalyzer.tsx)
@app.post("/api/analyze-security")
async def analyze_security(request: SecurityAnalyzeRequest):
    """Analyze code for security vulnerabilities"""
    try:
        from .agents.security_analyzer import SecurityAnalyzer
        security_analyzer = SecurityAnalyzer()
        
        result = await security_analyzer.analyze_security(
            code=request.code,
            language=request.language,
            focus_areas=request.focus_areas
        )
        
        return result
    except Exception as e:
        return {
            "status": "error",
            "message": f"Error during security analysis: {e}"
        }

# PR REVIEW ENDPOINT (for PRReviewer.tsx)
@app.post("/api/review-pr")
async def review_pr(request: PRReviewRequest):
    """Review PR - compatible with frontend"""
    # This is a mock implementation for the hackathon
    return {
        "review_summary": {
            "overall_rating": 8.5,
            "strengths": ["Well-structured code", "Good use of design patterns"],
            "weaknesses": ["Needs more comments", "Some edge cases are not handled"],
            "recommendations": ["Add unit tests for new logic", "Update documentation"]
        },
        "detailed_analysis": {
            "code_quality": {
                "score": 85,
                "issues": [
                    {
                        "type": "Readability",
                        "severity": "Low",
                        "description": "Variable 'x' is not descriptive.",
                        "line_number": 23,
                        "file_path": "src/utils.py"
                    }
                ]
            },
            "security_concerns": [],
            "performance_issues": []
            },
            "suggestions": [
            {
                "type": "Enhancement",
                "priority": "Medium",
                "description": "Consider using a more efficient algorithm for data processing.",
                "implementation": "Refactor the 'process_data' function to use a hash map for lookups."
            }
        ]
    }

# Health check for frontend
@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0",
        "agents_status": "all_active"
    }

if __name__ == "__main__":
    print("🚀 Starting Monk-AI TraeDevMate API Server...")
    print("📱 Frontend: http://localhost:3000")
    print("🔧 Backend: http://localhost:8000") 
    print("📚 API Docs: http://localhost:8000/docs")
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )