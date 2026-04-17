from pydantic import BaseModel, Field


class ColorBase(BaseModel):
    hex_value: str = Field(..., pattern=r"^#[0-9a-fA-F]{6}$", examples=["#FF5733"])
    rgb_r: int = Field(..., ge=0, le=255)
    rgb_g: int = Field(..., ge=0, le=255)
    rgb_b: int = Field(..., ge=0, le=255)
    hsl_h: int = Field(..., ge=0, le=360)
    hsl_s: int = Field(..., ge=0, le=100)
    hsl_l: int = Field(..., ge=0, le=100)
    percentage: float = Field(default=0, ge=0, le=100)
    sort_order: int = Field(default=0, ge=0)


class ColorCreate(ColorBase):
    pass


class ColorResponse(ColorBase):
    id: int

    model_config = {"from_attributes": True}
