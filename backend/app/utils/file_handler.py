import os
from pathlib import Path
from typing import Optional


def ensure_upload_dir(path: str) -> Path:
    """Ensure upload directory exists."""
    upload_dir = Path(path)
    upload_dir.mkdir(parents=True, exist_ok=True)
    return upload_dir


def cleanup_file(file_path: Path) -> None:
    """Remove a file if it exists."""
    if file_path.exists():
        os.remove(file_path)


def get_file_extension(filename: str) -> Optional[str]:
    """Get file extension from filename."""
    if "." in filename:
        return filename.rsplit(".", 1)[1].lower()
    return None
