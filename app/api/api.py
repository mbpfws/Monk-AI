from fastapi import APIRouter

from app.api.routes import users, projects, snippets, reviews, auth

api_router = APIRouter()

# Include all routers with their prefixes
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(snippets.router, prefix="/snippets", tags=["snippets"])
api_router.include_router(reviews.router, prefix="/reviews", tags=["reviews"]) 