from fastapi import APIRouter, HTTPException, UploadFile

from app.services.file_service import save_upload

router = APIRouter(prefix="/images", tags=["Images"])


@router.post("/upload")
async def upload_image(file: UploadFile):
    """Upload an image file for color extraction or other processing."""
    try:
        file_path = await save_upload(file, subdirectory="images")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return {
        "message": "Image uploaded successfully",
        "image_path": file_path,
        "filename": file.filename,
    }
