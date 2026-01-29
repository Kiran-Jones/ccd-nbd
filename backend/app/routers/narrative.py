import logging
from fastapi import APIRouter, HTTPException
from app.models.analysis import AnalysisResult
from app.services.narrative import NarrativeResponse, narrative_service
from app.config.settings import settings

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/narrative", response_model=NarrativeResponse)
async def generate_narrative(analysis: AnalysisResult):
    """Generate AI-powered narrative analysis using Dartmouth Chat AI."""

    if not settings.dartmouth_ai_api_key:
        logger.error("Dartmouth AI API key not configured")
        raise HTTPException(
            status_code=503,
            detail="Narrative analysis is not available. Configure DARTMOUTH_AI_API_KEY."
        )

    try:
        result = narrative_service.generate_narrative(analysis)
        return result
    except ValueError as e:
        logger.error(f"Configuration error: {e}")
        raise HTTPException(
            status_code=503,
            detail=str(e)
        )
    except Exception as e:
        error_str = str(e).lower()
        logger.error(f"Error generating narrative: {e}", exc_info=True)

        if "authentication" in error_str or "api_key" in error_str or "invalid" in error_str:
            raise HTTPException(
                status_code=401,
                detail="Dartmouth AI authentication failed. Please check your API key."
            )

        if "rate" in error_str or "quota" in error_str or "429" in error_str:
            raise HTTPException(
                status_code=429,
                detail="Rate limit exceeded. Please try again in a moment."
            )

        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate narrative: {str(e)}"
        )
