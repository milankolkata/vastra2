from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    supabase_url: str = ""
    supabase_key: str = ""
    cors_origins: str = "http://localhost:3000"
    max_file_size_mb: int = 10

    # ── New modules ──
    google_places_api_key: str = ""
    supabase_designs_bucket: str = "designs"
    supabase_customer_images_bucket: str = "customer-images"

    # ── Trends / Image service ──
    unsplash_access_key: str = ""

    # ── AI auto-tagging (Claude Vision) ──
    anthropic_api_key: str = ""

    @property
    def unsplash_configured(self) -> bool:
        return bool(self.unsplash_access_key)

    @property
    def auto_tagging_enabled(self) -> bool:
        return bool(self.anthropic_api_key)

    @property
    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.cors_origins.split(",")]

    @property
    def supabase_configured(self) -> bool:
        return bool(self.supabase_url and self.supabase_key)

    @property
    def google_places_configured(self) -> bool:
        return bool(self.google_places_api_key)

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
