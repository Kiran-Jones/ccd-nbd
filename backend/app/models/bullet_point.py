from pydantic import BaseModel
from typing import List


class FormattingInfo(BaseModel):
    bold: List[bool]  # Character-level bold markers
    italic: List[bool]  # Character-level italic markers


class BulletPoint(BaseModel):
    id: str
    text: str
    formatting: FormattingInfo
    original_index: int


class BulletPointCreate(BaseModel):
    text: str
    formatting: FormattingInfo
