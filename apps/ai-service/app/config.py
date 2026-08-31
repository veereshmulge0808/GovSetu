"""
AI Service Configuration using pydantic-settings.
"""

from functools import lru_cache
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # App
    app_name: str = "GovSetu AI Service"
    debug: bool = False

    # LLM Provider (abstracted — supports OpenAI, Azure, local models)
    llm_provider: str = "openai"  # openai | azure | local
    openai_api_key: str = ""
    openai_model: str = "gpt-4o-mini"
    embedding_model: str = "text-embedding-3-small"
    embedding_dimensions: int = 1536

    # Database (for reading startup/challenge data)
    database_url: str = "postgresql://govsetu:govsetu_pass@localhost:5432/govsetu_db"

    # CORS
    cors_origins: List[str] = ["http://localhost:3000", "http://localhost:3001"]

    # Security
    api_key: str = ""  # Set to require API key from NestJS backend

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
