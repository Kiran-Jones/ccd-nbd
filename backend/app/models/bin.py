from pydantic import BaseModel
from typing import List
from app.models.bullet_point import BulletPoint


class Bin(BaseModel):
    id: str  # 'interests', 'skillset', 'values', 'strengths'
    label: str
    color: str
    bullets: List[BulletPoint] = []


class BinUpdate(BaseModel):
    bullets: List[BulletPoint]
