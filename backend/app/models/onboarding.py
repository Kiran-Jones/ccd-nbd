from pydantic import BaseModel


class OnboardingData(BaseModel):
    paragraph: str
    sentence: str
    word: str
    careerValue: str
