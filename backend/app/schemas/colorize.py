from datetime import datetime

from pydantic import BaseModel, Field


class ColorizeRequest(BaseModel):
    lineart_path: str
    style: str = Field(default="anime")


class ColorizeGuidedRequest(BaseModel):
    lineart_path: str
    palette_id: int
    style: str = Field(default="anime")


class ColorizeTaskResponse(BaseModel):
    id: int
    lineart_path: str
    mode: str
    palette_id: int | None = None
    style: str
    status: str
    result_path: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class ColorizeResultResponse(BaseModel):
    id: int
    task_id: int
    result_path: str
    params: dict | None = None
    created_at: datetime

    model_config = {"from_attributes": True}
