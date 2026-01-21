from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
import shutil
import os
from pathlib import Path
from app.models.bullet_point import BulletPoint
from app.services.parser import ResumeParser

router = APIRouter()
parser = ResumeParser()

UPLOAD_DIR = Path("/tmp/uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/parse-resume", response_model=List[BulletPoint])
async def parse_resume(file: UploadFile = File(...)):
    """
    Upload and parse a resume file (PDF or DOCX).
    Returns extracted bullet points with formatting.
    """
    # Validate file type
    if not file.filename or not file.filename.endswith((".pdf", ".docx")):
        raise HTTPException(
            status_code=400, detail="Only PDF and DOCX files are supported"
        )

    # Save uploaded file
    file_path = UPLOAD_DIR / file.filename
    try:
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

    # Parse file based on extension
    try:
        if file.filename.endswith(".pdf"):
            bullets = parser.parse_pdf(str(file_path))
        else:  # .docx
            bullets = parser.parse_docx(str(file_path))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Parsing failed: {str(e)}")
    finally:
        # Clean up uploaded file
        if file_path.exists():
            os.remove(file_path)

    return bullets
