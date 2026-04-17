from fastapi import APIRouter

from app.api.v1.analyze import router as analyze_router
from app.api.v1.colors import router as colors_router
from app.api.v1.colorize import router as colorize_router
from app.api.v1.images import router as images_router
from app.api.v1.palettes import router as palettes_router
from app.api.v1.recommend import router as recommend_router

api_router = APIRouter()
api_router.include_router(images_router)
api_router.include_router(colors_router)
api_router.include_router(palettes_router)
api_router.include_router(colorize_router)
api_router.include_router(recommend_router)
api_router.include_router(analyze_router)
