from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="TraeDevMate API",
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

# Simple test endpoint
@app.get("/test")
async def test_endpoint():
    return {"message": "Test endpoint working!", "status": "success"}

# Try to import and include agents router
try:
    from .api.routes.agents import router as agents_router
    app.include_router(agents_router, prefix="/api/agents", tags=["agents"])
    print("✅ Agents router loaded successfully")
except Exception as e:
    print(f"❌ Failed to load agents router: {e}")

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to TraeDevMate API",
        "version": "1.0.0",
        "status": "active",
        "agents": [
            "code_optimizer",
            "doc_generator", 
            "security_analyzer",
            "test_generator",
            "pr_reviewer",
            "ideation",
            "orchestrator"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)