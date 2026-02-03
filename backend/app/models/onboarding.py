from pydantic import BaseModel
from typing import List, Optional


class OnboardingData(BaseModel):
    paragraph: str
    sentence: str
    word: str
    careerValues: List[str] = []
    careerValue: Optional[str] = None
