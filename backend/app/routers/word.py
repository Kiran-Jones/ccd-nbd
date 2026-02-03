import logging

from fastapi import APIRouter, HTTPException

from app.models.word import WordSuggestionRequest, WordSuggestionResponse
from app.services.word import word_service

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/word", response_model=WordSuggestionResponse)
async def generate_word(request: WordSuggestionRequest):
    """Generate a single-word narrative summary."""
    try:
        word = word_service.generate_word(request.bullets)
        return WordSuggestionResponse(word=word)
    except Exception as e:
        logger.error(f"Error generating word suggestion: {e}", exc_info=True)
        raise HTTPException(
            status_code=500, detail=f"Failed to generate word: {str(e)}"
        )
