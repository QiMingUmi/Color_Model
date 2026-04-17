import json
from pathlib import Path
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Color Model - 智能色彩方案生成与推荐系统"
    API_V1_PREFIX: str = "/api/v1"
    SECRET_KEY: str = "dev-secret-key"

    DATABASE_URL: str = "mysql+pymysql://root:@localhost:3306/color_model"

    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE: int = 20 * 1024 * 1024  # 20MB
    ALLOWED_IMAGE_TYPES: list[str] = [
        "image/jpeg", "image/png", "image/bmp", "image/webp", "image/tiff"
    ]
    THUMBNAIL_SIZE: tuple[int, int] = (256, 256)

    CORS_ORIGINS: str = '["http://localhost:5173"]'

    @property
    def cors_origins_list(self) -> list[str]:
        return json.loads(self.CORS_ORIGINS)

    @property
    def upload_path(self) -> Path:
        path = Path(self.UPLOAD_DIR)
        path.mkdir(parents=True, exist_ok=True)
        return path

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
