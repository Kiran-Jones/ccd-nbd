from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    environment: str = "development"
    debug: bool = True
    cors_origins: List[str] = ["http://localhost:5173"]
    max_upload_size: int = 10485760  # 10MB

    class Config:
        env_file = ".env"


settings = Settings()
