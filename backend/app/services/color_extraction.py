import colorsys
from pathlib import Path

import cv2
import numpy as np
from sklearn.cluster import KMeans

from app.schemas.extract import ExtractedColor


def rgb_to_hex(r: int, g: int, b: int) -> str:
    return f"#{r:02X}{g:02X}{b:02X}"


def rgb_to_hsl(r: int, g: int, b: int) -> tuple[int, int, int]:
    h, l, s = colorsys.rgb_to_hls(r / 255.0, g / 255.0, b / 255.0)
    return int(h * 360), int(s * 100), int(l * 100)


def extract_colors(image_path: str, num_colors: int = 5) -> list[ExtractedColor]:
    """Extract dominant colors from an image using K-Means clustering."""
    path = Path(image_path)
    if not path.exists():
        raise FileNotFoundError(f"Image not found: {image_path}")

    img = cv2.imread(str(path))
    if img is None:
        raise ValueError(f"Failed to read image: {image_path}")

    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    max_pixels = 100_000
    h, w = img.shape[:2]
    total_pixels = h * w
    if total_pixels > max_pixels:
        scale = (max_pixels / total_pixels) ** 0.5
        new_w, new_h = int(w * scale), int(h * scale)
        img = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_AREA)

    pixels = img.reshape(-1, 3).astype(np.float32)

    kmeans = KMeans(n_clusters=num_colors, n_init=10, max_iter=300, random_state=42)
    kmeans.fit(pixels)

    centers = kmeans.cluster_centers_.astype(int)
    labels = kmeans.labels_
    counts = np.bincount(labels)
    percentages = (counts / counts.sum() * 100).round(2)

    sorted_indices = np.argsort(-percentages)

    colors: list[ExtractedColor] = []
    for order, idx in enumerate(sorted_indices):
        r, g, b = int(centers[idx][0]), int(centers[idx][1]), int(centers[idx][2])
        h, s, l = rgb_to_hsl(r, g, b)
        colors.append(ExtractedColor(
            hex_value=rgb_to_hex(r, g, b),
            rgb_r=r, rgb_g=g, rgb_b=b,
            hsl_h=h, hsl_s=s, hsl_l=l,
            percentage=float(percentages[idx]),
            sort_order=order,
        ))

    return colors
