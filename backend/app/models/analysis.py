from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.models.bin import Bin
from app.models.onboarding import OnboardingData


class Distribution(BaseModel):
    bin_id: str
    count: int
    percentage: float


class Analytics(BaseModel):
    distribution: List[Distribution]
    top_category: str
    suggestions: List[str]


class AnalysisResult(BaseModel):
    bins: List[Bin]
    analytics: Analytics
    timestamp: datetime
    onboardingData: Optional[OnboardingData] = None
