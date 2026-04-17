from pydantic import BaseModel, Field


class TheoryRecommendRequest(BaseModel):
    base_color: str = Field(..., pattern=r"^#[0-9a-fA-F]{6}$", examples=["#FF5733"])
    rule: str = Field(
        ...,
        examples=["complementary"],
        description="One of: complementary, analogous, triadic, split_complementary, tetradic, square"
    )


class RecommendedColor(BaseModel):
    hex_value: str
    rgb_r: int
    rgb_g: int
    rgb_b: int
    hsl_h: int
    hsl_s: int
    hsl_l: int
    name: str | None = None


class TheoryRecommendResponse(BaseModel):
    base_color: str
    rule: str
    rule_description: str
    colors: list[RecommendedColor]
    usage_hint: str


class ScenePreset(BaseModel):
    id: str
    name: str
    category: str
    description: str
    colors: list[RecommendedColor]
    tags: list[str]


class SceneRecommendResponse(BaseModel):
    category: str | None = None
    presets: list[ScenePreset]
