from datetime import datetime

from sqlalchemy import (
    JSON,
    BigInteger,
    DateTime,
    Enum,
    ForeignKey,
    String,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class ColorizeTask(Base):
    __tablename__ = "colorize_task"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    lineart_path: Mapped[str] = mapped_column(String(255), nullable=False)
    mode: Mapped[str] = mapped_column(
        Enum("auto", "guided", name="colorize_mode"), nullable=False
    )
    palette_id: Mapped[int | None] = mapped_column(
        BigInteger, ForeignKey("palette.id", ondelete="SET NULL"), nullable=True
    )
    style: Mapped[str] = mapped_column(String(50), default="anime")
    status: Mapped[str] = mapped_column(
        Enum("pending", "processing", "completed", "failed", name="task_status"),
        default="pending",
        index=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False
    )

    palette: Mapped["Palette | None"] = relationship("Palette", back_populates="colorize_tasks")
    result: Mapped["ColorizeResult | None"] = relationship(
        "ColorizeResult", back_populates="task", uselist=False, cascade="all, delete-orphan"
    )


class ColorizeResult(Base):
    __tablename__ = "colorize_result"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    task_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("colorize_task.id", ondelete="CASCADE"),
        nullable=False, unique=True,
    )
    result_path: Mapped[str] = mapped_column(String(255), nullable=False)
    params: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False
    )

    task: Mapped["ColorizeTask"] = relationship("ColorizeTask", back_populates="result")


from app.models.palette import Palette  # noqa: E402
