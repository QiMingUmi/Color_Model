from sqlalchemy import (
    BigInteger,
    ForeignKey,
    Numeric,
    SmallInteger,
    String,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Color(Base):
    __tablename__ = "color"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    palette_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("palette.id", ondelete="CASCADE"), nullable=False, index=True
    )
    hex_value: Mapped[str] = mapped_column(String(7), nullable=False)
    rgb_r: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    rgb_g: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    rgb_b: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    hsl_h: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    hsl_s: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    hsl_l: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    percentage: Mapped[float] = mapped_column(Numeric(5, 2), default=0)
    sort_order: Mapped[int] = mapped_column(SmallInteger, default=0)

    palette: Mapped["Palette"] = relationship("Palette", back_populates="colors")


from app.models.palette import Palette  # noqa: E402
