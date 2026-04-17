from fastapi import APIRouter, Depends, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.colorize import ColorizeResult, ColorizeTask
from app.models.palette import Palette
from app.schemas.colorize import ColorizeGuidedRequest, ColorizeRequest, ColorizeTaskResponse
from app.services.colorize_service import auto_colorize, guided_colorize
from app.services.file_service import save_upload

router = APIRouter(prefix="/colorize", tags=["Colorize"])


@router.post("/upload")
async def upload_lineart(file: UploadFile):
    """Upload a line art image for colorization."""
    try:
        file_path = await save_upload(file, subdirectory="lineart")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return {
        "message": "Line art uploaded successfully",
        "lineart_path": file_path,
        "filename": file.filename,
    }


@router.post("/auto", response_model=ColorizeTaskResponse)
def colorize_auto(request: ColorizeRequest, db: Session = Depends(get_db)):
    """Automatically colorize a line art image."""
    task = ColorizeTask(
        lineart_path=request.lineart_path,
        mode="auto",
        style=request.style,
        status="processing",
    )
    db.add(task)
    db.flush()

    try:
        result_path = auto_colorize(request.lineart_path, request.style)
        task.status = "completed"

        result = ColorizeResult(
            task_id=task.id,
            result_path=result_path,
            params={"style": request.style},
        )
        db.add(result)
    except Exception as e:
        task.status = "failed"
        db.commit()
        raise HTTPException(status_code=500, detail=f"Colorization failed: {str(e)}")

    db.commit()
    db.refresh(task)

    return ColorizeTaskResponse(
        id=task.id,
        lineart_path=task.lineart_path,
        mode=task.mode,
        palette_id=task.palette_id,
        style=task.style,
        status=task.status,
        result_path=result.result_path if task.status == "completed" else None,
        created_at=task.created_at,
    )


@router.post("/guided", response_model=ColorizeTaskResponse)
def colorize_guided(request: ColorizeGuidedRequest, db: Session = Depends(get_db)):
    """Colorize a line art image guided by a saved color palette."""
    palette = db.query(Palette).filter(Palette.id == request.palette_id).first()
    if not palette:
        raise HTTPException(status_code=404, detail="Palette not found")

    task = ColorizeTask(
        lineart_path=request.lineart_path,
        mode="guided",
        palette_id=request.palette_id,
        style=request.style,
        status="processing",
    )
    db.add(task)
    db.flush()

    try:
        palette_colors = [(c.rgb_r, c.rgb_g, c.rgb_b) for c in palette.colors]
        result_path = guided_colorize(request.lineart_path, palette_colors, request.style)
        task.status = "completed"

        result = ColorizeResult(
            task_id=task.id,
            result_path=result_path,
            params={"style": request.style, "palette_id": request.palette_id},
        )
        db.add(result)
    except Exception as e:
        task.status = "failed"
        db.commit()
        raise HTTPException(status_code=500, detail=f"Colorization failed: {str(e)}")

    db.commit()
    db.refresh(task)

    return ColorizeTaskResponse(
        id=task.id,
        lineart_path=task.lineart_path,
        mode=task.mode,
        palette_id=task.palette_id,
        style=task.style,
        status=task.status,
        result_path=result.result_path if task.status == "completed" else None,
        created_at=task.created_at,
    )


@router.get("/tasks/{task_id}", response_model=ColorizeTaskResponse)
def get_task(task_id: int, db: Session = Depends(get_db)):
    """Get the status and result of a colorization task."""
    task = db.query(ColorizeTask).filter(ColorizeTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return ColorizeTaskResponse(
        id=task.id,
        lineart_path=task.lineart_path,
        mode=task.mode,
        palette_id=task.palette_id,
        style=task.style,
        status=task.status,
        result_path=task.result.result_path if task.result else None,
        created_at=task.created_at,
    )
