from fastapi import APIRouter, HTTPException, Query

from app.schemas.recommend import (
    SceneRecommendResponse,
    TheoryRecommendRequest,
    TheoryRecommendResponse,
)
from app.services.color_recommend import recommend_by_scene, recommend_by_theory

router = APIRouter(prefix="/recommend", tags=["Recommend"])


@router.post("/theory", response_model=TheoryRecommendResponse)
def theory_recommend(request: TheoryRecommendRequest):
    """Generate color recommendations based on color theory rules."""
    try:
        return recommend_by_theory(request.base_color, request.rule)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/scene", response_model=SceneRecommendResponse)
def scene_recommend(
    category: str | None = Query(
        None,
        description="Filter by category: emotion, industry, season, style"
    ),
):
    """Get pre-built color scheme recommendations by scene/category."""
    return recommend_by_scene(category)
