from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.color import Color
from app.models.palette import Palette
from app.schemas.palette import (
    PaletteCreate,
    PaletteListResponse,
    PaletteResponse,
    PaletteUpdate,
)

router = APIRouter(prefix="/palettes", tags=["Palettes"])


@router.post("", response_model=PaletteResponse, status_code=201)
def create_palette(data: PaletteCreate, db: Session = Depends(get_db)):
    """Save a new color palette."""
    palette = Palette(
        name=data.name,
        description=data.description,
        tags=data.tags,
    )
    db.add(palette)
    db.flush()

    for c in data.colors:
        color = Color(
            palette_id=palette.id,
            hex_value=c.hex_value,
            rgb_r=c.rgb_r, rgb_g=c.rgb_g, rgb_b=c.rgb_b,
            hsl_h=c.hsl_h, hsl_s=c.hsl_s, hsl_l=c.hsl_l,
            percentage=c.percentage,
            sort_order=c.sort_order,
        )
        db.add(color)

    db.commit()
    db.refresh(palette)
    return palette


@router.get("", response_model=list[PaletteListResponse])
def list_palettes(
    search: str | None = Query(None, description="Search by name or description"),
    tag: str | None = Query(None, description="Filter by tag"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """List all saved palettes with optional search and tag filter."""
    query = db.query(Palette)

    if search:
        query = query.filter(
            Palette.name.contains(search) | Palette.description.contains(search)
        )

    if tag:
        query = query.filter(Palette.tags.op("->")(f'$[*]').contains(tag))

    palettes = query.order_by(Palette.created_at.desc()).offset(skip).limit(limit).all()

    result = []
    for p in palettes:
        result.append(PaletteListResponse(
            id=p.id,
            name=p.name,
            description=p.description,
            tags=p.tags,
            thumbnail=p.thumbnail,
            color_count=len(p.colors),
            created_at=p.created_at,
            updated_at=p.updated_at,
        ))
    return result


@router.get("/{palette_id}", response_model=PaletteResponse)
def get_palette(palette_id: int, db: Session = Depends(get_db)):
    """Get a specific palette by ID."""
    palette = db.query(Palette).filter(Palette.id == palette_id).first()
    if not palette:
        raise HTTPException(status_code=404, detail="Palette not found")
    return palette


@router.put("/{palette_id}", response_model=PaletteResponse)
def update_palette(
    palette_id: int,
    data: PaletteUpdate,
    db: Session = Depends(get_db),
):
    """Update palette metadata (name, description, tags)."""
    palette = db.query(Palette).filter(Palette.id == palette_id).first()
    if not palette:
        raise HTTPException(status_code=404, detail="Palette not found")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(palette, key, value)

    db.commit()
    db.refresh(palette)
    return palette


@router.delete("/{palette_id}", status_code=204)
def delete_palette(palette_id: int, db: Session = Depends(get_db)):
    """Delete a palette and all its associated colors."""
    palette = db.query(Palette).filter(Palette.id == palette_id).first()
    if not palette:
        raise HTTPException(status_code=404, detail="Palette not found")

    db.delete(palette)
    db.commit()


@router.get("/{palette_id}/export")
def export_palette(
    palette_id: int,
    format: str = Query("json", description="Export format: json, gpl"),
    db: Session = Depends(get_db),
):
    """Export a palette in the specified format."""
    palette = db.query(Palette).filter(Palette.id == palette_id).first()
    if not palette:
        raise HTTPException(status_code=404, detail="Palette not found")

    if format == "json":
        return {
            "name": palette.name,
            "description": palette.description,
            "tags": palette.tags,
            "colors": [
                {
                    "hex": c.hex_value,
                    "rgb": {"r": c.rgb_r, "g": c.rgb_g, "b": c.rgb_b},
                    "hsl": {"h": c.hsl_h, "s": c.hsl_s, "l": c.hsl_l},
                    "percentage": float(c.percentage) if c.percentage else 0,
                }
                for c in palette.colors
            ],
        }
    elif format == "gpl":
        lines = [
            "GIMP Palette",
            f"Name: {palette.name}",
            f"Columns: {len(palette.colors)}",
            "#",
        ]
        for c in palette.colors:
            lines.append(f"{c.rgb_r:3d} {c.rgb_g:3d} {c.rgb_b:3d}\t{c.hex_value}")

        from fastapi.responses import PlainTextResponse
        return PlainTextResponse(
            content="\n".join(lines),
            media_type="text/plain",
            headers={"Content-Disposition": f'attachment; filename="{palette.name}.gpl"'},
        )
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported format: {format}")
