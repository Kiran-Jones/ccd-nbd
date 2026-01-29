from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import resume, export, narrative
from app.config.settings import settings
from app.middleware.rate_limit import RateLimiter, SimpleRateLimitMiddleware

app = FastAPI(
    title="Career Design Resume Analyzer",
    version="1.0.0",
    description="API for resume analysis and career design",
)

# CORS configuration for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

rate_limiter = RateLimiter()
app.add_middleware(
    SimpleRateLimitMiddleware,
    limiter=rate_limiter,
    default_max_requests=settings.rate_limit_default_max_requests,
    default_window_seconds=settings.rate_limit_default_window_seconds,
    ai_max_requests=settings.rate_limit_ai_max_requests,
    ai_window_seconds=settings.rate_limit_ai_window_seconds,
)

# Include routers
app.include_router(resume.router, prefix="/api", tags=["resume"])
app.include_router(export.router, prefix="/api/export", tags=["export"])
app.include_router(narrative.router, prefix="/api", tags=["narrative"])


@app.get("/")
async def root():
    return {"message": "Career Design Resume Analyzer API"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
