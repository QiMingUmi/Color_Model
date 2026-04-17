from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.color import ColorCreate, ColorResponse


class PaletteBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: str | None = None
    tags: list[str] | None = None


class PaletteCreate(PaletteBase):
    colors: list[ColorCreate] = Field(..., min_length=1)


class PaletteUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=100)
    description: str | None = None
    tags: list[str] | None = None


class PaletteResponse(PaletteBase):
    id: int
    thumbnail: str | None = None
    source_image: str | None = None
    created_at: datetime
    updated_at: datetime
    colors: list[ColorResponse] = []

    model_config = {"from_attributes": True}


class PaletteListResponse(BaseModel):
    id: int
    name: str
    description: str | None = None
    tags: list[str] | None = None
    thumbnail: str | None = None
    color_count: int = 0
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
