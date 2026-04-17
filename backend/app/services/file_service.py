import uuid
from pathlib import Path

from fastapi import UploadFile
from PIL import Image

from app.core.config import settings


async def save_upload(file: UploadFile, subdirectory: str = "images") -> str:
    """Save an uploaded file and return its path."""
    if file.content_type not in settings.ALLOWED_IMAGE_TYPES:
        raise ValueError(
            f"Unsupported file type: {file.content_type}. "
            f"Allowed: {settings.ALLOWED_IMAGE_TYPES}"
        )

    content = await file.read()
    if len(content) > settings.MAX_UPLOAD_SIZE:
        raise ValueError(
            f"File too large: {len(content)} bytes. "
            f"Maximum: {settings.MAX_UPLOAD_SIZE} bytes"
        )

    ext = Path(file.filename or "image.png").suffix or ".png"
    filename = f"{uuid.uuid4().hex}{ext}"

    upload_dir = settings.upload_path / subdirectory
    upload_dir.mkdir(parents=True, exist_ok=True)

    file_path = upload_dir / filename
    file_path.write_bytes(content)

    return str(file_path)


def create_thumbnail(image_path: str) -> str:
    """Create a thumbnail for the given image and return its path."""
    path = Path(image_path)
    if not path.exists():
        raise FileNotFoundError(f"Image not found: {image_path}")

    thumb_dir = settings.upload_path / "thumbnails"
    thumb_dir.mkdir(parents=True, exist_ok=True)

    thumb_filename = f"thumb_{path.stem}.png"
    thumb_path = thumb_dir / thumb_filename

    with Image.open(path) as img:
        img.thumbnail(settings.THUMBNAIL_SIZE)
        img.save(str(thumb_path), format="PNG")

    return str(thumb_path)
