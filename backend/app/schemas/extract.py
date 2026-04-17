from pydantic import BaseModel, Field

from app.schemas.color import ColorBase


class ExtractRequest(BaseModel):
    image_path: str
    num_colors: int = Field(default=5, ge=3, le=15)


class ExtractedColor(ColorBase):
    pass


class ExtractResponse(BaseModel):
    colors: list[ExtractedColor]
    image_path: str
    num_colors: int
