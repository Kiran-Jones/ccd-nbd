from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    environment: str = "development"
    debug: bool = True
    cors_origins: List[str] = ["http://localhost:5173"]
    max_upload_size: int = 10485760  # 10MB

    # Dartmouth Chat AI (OpenAI-compatible endpoint)
    dartmouth_ai_api_key: str = ""
    dartmouth_ai_base_url: str = "https://chat.dartmouth.edu/api"
    dartmouth_ai_model: str = "anthropic.claude-3-5-haiku-20241022"

    # Rate limiting (per IP)
    rate_limit_default_max_requests: int = 60
    rate_limit_default_window_seconds: int = 60
    rate_limit_ai_max_requests: int = 2
    rate_limit_ai_window_seconds: int = 60

    class Config:
        env_file = ".env"


settings = Settings()
