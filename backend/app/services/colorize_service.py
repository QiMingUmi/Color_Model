"""
Colorization service — MVP placeholder.

In the MVP phase, this module provides a simulated colorization using
OpenCV color mapping. Real deep-learning model integration (PyTorch)
will be added in a later iteration.
"""

from pathlib import Path

import cv2
import numpy as np

from app.core.config import settings


def auto_colorize(lineart_path: str, style: str = "anime") -> str:
    """
    Apply automatic colorization to a line art image.

    MVP implementation: applies a pseudo-color map to give the line art
    a colorful appearance. This will be replaced by a neural network
    model in a future iteration.
    """
    path = Path(lineart_path)
    if not path.exists():
        raise FileNotFoundError(f"Line art not found: {lineart_path}")

    img = cv2.imread(str(path), cv2.IMREAD_GRAYSCALE)
    if img is None:
        raise ValueError(f"Failed to read line art: {lineart_path}")

    img_inv = cv2.bitwise_not(img)
    img_blur = cv2.GaussianBlur(img_inv, (21, 21), sigmaX=0, sigmaY=0)

    if style == "anime":
        colored = cv2.applyColorMap(img_blur, cv2.COLORMAP_HSV)
    elif style == "realistic":
        colored = cv2.applyColorMap(img_blur, cv2.COLORMAP_AUTUMN)
    else:
        colored = cv2.applyColorMap(img_blur, cv2.COLORMAP_JET)

    alpha = (img_inv.astype(np.float32) / 255.0)[..., np.newaxis]
    original_bgr = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
    blended = (colored * alpha + original_bgr * (1 - alpha)).astype(np.uint8)

    result_dir = settings.upload_path / "results"
    result_dir.mkdir(parents=True, exist_ok=True)
    result_filename = f"colorized_{path.stem}_{style}.png"
    result_path = result_dir / result_filename
    cv2.imwrite(str(result_path), blended)

    return str(result_path)


def guided_colorize(
    lineart_path: str,
    palette_colors: list[tuple[int, int, int]],
    style: str = "anime",
) -> str:
    """
    Apply guided colorization using a color palette.

    MVP implementation: tints the line art with the dominant palette color.
    Real guided colorization with conditional GANs will be added later.
    """
    path = Path(lineart_path)
    if not path.exists():
        raise FileNotFoundError(f"Line art not found: {lineart_path}")

    img = cv2.imread(str(path), cv2.IMREAD_GRAYSCALE)
    if img is None:
        raise ValueError(f"Failed to read line art: {lineart_path}")

    if not palette_colors:
        raise ValueError("Palette must contain at least one color")

    dominant = palette_colors[0]
    tint_bgr = np.array([dominant[2], dominant[1], dominant[0]], dtype=np.float32)

    img_norm = img.astype(np.float32) / 255.0
    img_inv = 1.0 - img_norm

    tinted = np.zeros((*img.shape, 3), dtype=np.float32)
    for c in range(3):
        tinted[..., c] = img_inv * tint_bgr[c] / 255.0

    for i, color in enumerate(palette_colors[1:], start=1):
        weight = max(0.1, 1.0 / (i + 1))
        band_bgr = np.array([color[2], color[1], color[0]], dtype=np.float32) / 255.0
        band_start = int(img.shape[0] * (i - 1) / len(palette_colors))
        band_end = int(img.shape[0] * i / len(palette_colors))
        for c in range(3):
            tinted[band_start:band_end, :, c] = (
                tinted[band_start:band_end, :, c] * (1 - weight)
                + img_inv[band_start:band_end] * band_bgr[c] * weight
            )

    result = (tinted * 255).clip(0, 255).astype(np.uint8)

    gray_bgr = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
    line_mask = (img < 128).astype(np.float32)[..., np.newaxis]
    final = (gray_bgr * line_mask + result * (1 - line_mask)).astype(np.uint8)

    result_dir = settings.upload_path / "results"
    result_dir.mkdir(parents=True, exist_ok=True)
    result_filename = f"guided_{path.stem}_{style}.png"
    result_path = result_dir / result_filename
    cv2.imwrite(str(result_path), final)

    return str(result_path)
