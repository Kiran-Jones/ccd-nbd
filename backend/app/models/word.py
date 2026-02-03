from pydantic import BaseModel
from typing import List


class WordSuggestionRequest(BaseModel):
    bullets: List[str]


class WordSuggestionResponse(BaseModel):
    word: str
