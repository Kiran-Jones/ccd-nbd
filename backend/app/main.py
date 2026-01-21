from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import resume, export

app = FastAPI(
    title="Career Design Resume Analyzer",
    version="1.0.0",
    description="API for resume analysis and career design",
)

# CORS configuration for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(resume.router, prefix="/api", tags=["resume"])
app.include_router(export.router, prefix="/api/export", tags=["export"])


@app.get("/")
async def root():
    return {"message": "Career Design Resume Analyzer API"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
