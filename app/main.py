from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
import sys

# Add the current directory to path so we can import modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Add the agents directory to path if it exists
agents_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "agents")
if os.path.exists(agents_path):
    sys.path.append(agents_path)

# Try to import agent classes, but use mock classes if imports fail
try:
    from agents.pr_reviewer import PRReviewer
    from agents.doc_generator import DocGenerator
    from agents.test_generator import TestGenerator
    from agents.code_optimizer import CodeOptimizer
    from agents.security_analyzer import SecurityAnalyzer
    from agents.ideation import Ideation
    agents_available = True
except ImportError:
    # Create mock classes if the real ones aren't available
    agents_available = False
    
    class MockAgent:
        async def mock_response(self, *args, **kwargs):
            return {"message": "This is a mock response. The actual agent module is not available."}
    
    class PRReviewer(MockAgent):
        async def review_pr(self, *args, **kwargs):
            return await self.mock_response()
    
    class DocGenerator(MockAgent):
        async def generate_docs(self, *args, **kwargs):
            return await self.mock_response()
    
    class TestGenerator(MockAgent):
        async def generate_tests(self, *args, **kwargs):
            return await self.mock_response()
    
    class CodeOptimizer(MockAgent):
        async def optimize_code(self, *args, **kwargs):
            return await self.mock_response()
    
    class SecurityAnalyzer(MockAgent):
        async def analyze_security(self, *args, **kwargs):
            return await self.mock_response()
    
    class Ideation(MockAgent):
        async def generate_project_scope(self, *args, **kwargs):
            return await self.mock_response()
        
        async def generate_technical_specs(self, *args, **kwargs):
            return await self.mock_response()
        
        async def generate_user_stories(self, *args, **kwargs):
            return await self.mock_response()
        
        async def generate_sprint_plan(self, *args, **kwargs):
            return await self.mock_response()

# Try to load environment variables
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    # If dotenv isn't available, we'll just continue without it
    pass

app = FastAPI(
    title="Monk AI API",
    description="AI-powered code review and documentation generation system",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development - restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class PRReviewRequest(BaseModel):
    pr_url: str
    repository: str
    branch: Optional[str] = "main"

class DocumentationRequest(BaseModel):
    code: str
    language: str
    context: Optional[str] = None

class TestGenerationRequest(BaseModel):
    code: str
    language: str
    test_framework: str

class CodeOptimizationRequest(BaseModel):
    code: str
    language: str
    focus_areas: Optional[List[str]] = None

class SecurityAnalysisRequest(BaseModel):
    code: str
    language: str
    focus_areas: Optional[List[str]] = None

# Routes
@app.get("/")
async def root():
    return {"message": "Welcome to Monk AI API", "agents_available": agents_available}

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.post("/api/review-pr")
async def review_pr(request: PRReviewRequest):
    try:
        reviewer = PRReviewer()
        result = await reviewer.review_pr(request.pr_url, request.repository)
        return {"review": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reviewing PR: {str(e)}")

@app.post("/api/generate-docs")
async def generate_docs(request: DocumentationRequest):
    try:
        doc_generator = DocGenerator()
        result = await doc_generator.generate_docs(request.code, request.language)
        return {
            "status": "success",
            "message": "Documentation generated",
            "documentation": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating documentation: {str(e)}")

@app.post("/api/generate-tests")
async def generate_tests(request: TestGenerationRequest):
    try:
        test_generator = TestGenerator()
        result = await test_generator.generate_tests(request.code, request.language)
        return {
            "status": "success",
            "message": "Tests generated",
            "tests": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating tests: {str(e)}")

@app.post("/api/optimize-code")
async def optimize_code(request: CodeOptimizationRequest):
    try:
        optimizer = CodeOptimizer()
        result = await optimizer.optimize_code(request.code, request.language, request.focus_areas)
        return {
            "status": "success",
            "message": "Code optimization analysis completed",
            "optimizations": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error optimizing code: {str(e)}")

@app.post("/api/analyze-security")
async def analyze_security(request: SecurityAnalysisRequest):
    try:
        analyzer = SecurityAnalyzer()
        result = await analyzer.analyze_security(request.code, request.language, request.focus_areas)
        return {
            "status": "success",
            "message": "Security analysis completed",
            "vulnerabilities": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing security: {str(e)}")

# Ideation API endpoints
class ProjectScopeRequest(BaseModel):
    description: str
    template_key: Optional[str] = None

@app.post("/api/generate-project-scope")
async def generate_project_scope(request: ProjectScopeRequest):
    try:
        ideation_agent = Ideation()
        result = await ideation_agent.generate_project_scope(
            description=request.description,
            template_key=request.template_key
        )
        return {
            "status": "success",
            "message": "Project scope generated",
            "project_scope": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating project scope: {str(e)}")

class TechnicalSpecsRequest(BaseModel):
    project_scope: Dict[str, Any]

@app.post("/api/generate-technical-specs")
async def generate_technical_specs(request: TechnicalSpecsRequest):
    try:
        ideation_agent = Ideation()
        result = await ideation_agent.generate_technical_specs(
            project_scope=request.project_scope
        )
        return {
            "status": "success",
            "message": "Technical specifications generated",
            "technical_specs": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating technical specifications: {str(e)}")

class UserStoriesRequest(BaseModel):
    project_scope: Dict[str, Any]

@app.post("/api/generate-user-stories")
async def generate_user_stories(request: UserStoriesRequest):
    try:
        ideation_agent = Ideation()
        result = await ideation_agent.generate_user_stories(
            project_scope=request.project_scope
        )
        return {
            "status": "success",
            "message": "User stories generated",
            "user_stories": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating user stories: {str(e)}")

class SprintPlanRequest(BaseModel):
    user_stories: List[Dict[str, Any]]
    sprint_count: int = 3

@app.post("/api/generate-sprint-plan")
async def generate_sprint_plan(request: SprintPlanRequest):
    try:
        ideation_agent = Ideation()
        result = await ideation_agent.generate_sprint_plan(
            user_stories=request.user_stories,
            sprint_count=request.sprint_count
        )
        return {
            "status": "success",
            "message": "Sprint plan generated",
            "sprint_plan": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating sprint plan: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)