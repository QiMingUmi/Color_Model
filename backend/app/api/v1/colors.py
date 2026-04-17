from fastapi import APIRouter, HTTPException

from app.schemas.extract import ExtractRequest, ExtractResponse
from app.services.color_extraction import extract_colors

router = APIRouter(prefix="/colors", tags=["Colors"])


@router.post("/extract", response_model=ExtractResponse)
async def extract_colors_from_image(request: ExtractRequest):
    """Extract dominant colors from an uploaded image using K-Means clustering."""
    try:
        colors = extract_colors(request.image_path, request.num_colors)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return ExtractResponse(
        colors=colors,
        image_path=request.image_path,
        num_colors=request.num_colors,
    )
