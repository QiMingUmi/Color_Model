from datetime import datetime

from sqlalchemy import (
    JSON,
    BigInteger,
    DateTime,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Palette(Base):
    __tablename__ = "palette"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    tags: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    thumbnail: Mapped[str | None] = mapped_column(String(255), nullable=True)
    source_image: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )

    colors: Mapped[list["Color"]] = relationship(
        "Color", back_populates="palette", cascade="all, delete-orphan",
        order_by="Color.sort_order"
    )
    colorize_tasks: Mapped[list["ColorizeTask"]] = relationship(
        "ColorizeTask", back_populates="palette"
    )


from app.models.color import Color  # noqa: E402
from app.models.colorize import ColorizeTask  # noqa: E402
