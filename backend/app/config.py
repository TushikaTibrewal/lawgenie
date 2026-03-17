import os
from functools import lru_cache


class Settings:
    """Application settings loaded from environment variables."""

    PROJECT_NAME: str = "lawgen"
    API_V1_PREFIX: str = "/api"

    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        # Default to SQLite file for local prototype.
        # To use MySQL later, change this to a mysql+aiomysql URI.
        return "sqlite+aiosqlite:///./lawgen_v2.db"

    # Auth
    JWT_SECRET_KEY: str = os.getenv("LAWGEN_JWT_SECRET_KEY", "CHANGE_ME_SECRET")
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = int(
        os.getenv("LAWGEN_JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "60")
    )

    # CORS
    BACKEND_CORS_ORIGINS: list[str] = os.getenv(
        "LAWGEN_BACKEND_CORS_ORIGINS", "http://localhost:5173,http://localhost:3000,http://localhost:8080,http://localhost:8081,http://localhost:8082,http://127.0.0.1:8080,http://127.0.0.1:8081,http://127.0.0.1:8082"
    ).split(",")


@lru_cache
def get_settings() -> Settings:
    return Settings()

