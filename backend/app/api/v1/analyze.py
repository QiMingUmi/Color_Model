import colorsys
import math

from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter(prefix="/analyze", tags=["Analyze"])


class AnalyzeColor(BaseModel):
    hex_value: str = Field(..., pattern=r"^#[0-9a-fA-F]{6}$")


class AnalyzeRequest(BaseModel):
    colors: list[AnalyzeColor] = Field(..., min_length=2)


class ContrastPair(BaseModel):
    color1: str
    color2: str
    ratio: float
    wcag_aa: bool
    wcag_aaa: bool


class AnalyzeResponse(BaseModel):
    tone: str
    tone_description: str
    saturation_avg: float
    lightness_avg: float
    harmony_score: float
    harmony_description: str
    contrast_pairs: list[ContrastPair]
    suggestions: list[str]


def hex_to_rgb(hex_color: str) -> tuple[int, int, int]:
    h = hex_color.lstrip("#")
    return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)


def relative_luminance(r: int, g: int, b: int) -> float:
    def linearize(c: int) -> float:
        s = c / 255.0
        return s / 12.92 if s <= 0.03928 else ((s + 0.055) / 1.055) ** 2.4
    return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b)


def contrast_ratio(rgb1: tuple[int, int, int], rgb2: tuple[int, int, int]) -> float:
    l1 = relative_luminance(*rgb1)
    l2 = relative_luminance(*rgb2)
    lighter = max(l1, l2)
    darker = min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)


@router.post("", response_model=AnalyzeResponse)
def analyze_palette(request: AnalyzeRequest):
    """Analyze a set of colors for harmony, contrast, and tone."""
    rgb_colors = [hex_to_rgb(c.hex_value) for c in request.colors]
    hsl_colors = [colorsys.rgb_to_hls(r / 255, g / 255, b / 255) for r, g, b in rgb_colors]

    hues = [h * 360 for h, _, _ in hsl_colors]
    saturations = [s * 100 for _, _, s in hsl_colors]
    lightnesses = [l * 100 for _, l, _ in hsl_colors]

    avg_hue = sum(hues) / len(hues)
    avg_sat = round(sum(saturations) / len(saturations), 1)
    avg_light = round(sum(lightnesses) / len(lightnesses), 1)

    warm_count = sum(1 for h in hues if (0 <= h <= 60) or (300 <= h <= 360))
    cool_count = sum(1 for h in hues if 120 <= h <= 270)

    if warm_count > cool_count:
        tone = "warm"
        tone_desc = "暖色调 — 色彩方案整体偏暖，给人温馨、活力的感受"
    elif cool_count > warm_count:
        tone = "cool"
        tone_desc = "冷色调 — 色彩方案整体偏冷，给人宁静、专业的感受"
    else:
        tone = "neutral"
        tone_desc = "中性色调 — 色彩方案冷暖均衡，适用范围广泛"

    contrast_pairs: list[ContrastPair] = []
    for i in range(len(rgb_colors)):
        for j in range(i + 1, len(rgb_colors)):
            ratio = round(contrast_ratio(rgb_colors[i], rgb_colors[j]), 2)
            contrast_pairs.append(ContrastPair(
                color1=request.colors[i].hex_value,
                color2=request.colors[j].hex_value,
                ratio=ratio,
                wcag_aa=ratio >= 4.5,
                wcag_aaa=ratio >= 7.0,
            ))

    hue_diffs = []
    for i in range(len(hues)):
        for j in range(i + 1, len(hues)):
            diff = abs(hues[i] - hues[j])
            if diff > 180:
                diff = 360 - diff
            hue_diffs.append(diff)

    harmony_targets = [0, 30, 60, 90, 120, 150, 180]
    harmony_score = 0.0
    if hue_diffs:
        min_deviations = []
        for diff in hue_diffs:
            min_dev = min(abs(diff - t) for t in harmony_targets)
            min_deviations.append(min_dev)
        avg_deviation = sum(min_deviations) / len(min_deviations)
        harmony_score = round(max(1, min(10, 10 - avg_deviation / 5)), 1)

    if harmony_score >= 8:
        harmony_desc = "优秀 — 色彩搭配非常和谐，符合经典色彩理论"
    elif harmony_score >= 6:
        harmony_desc = "良好 — 色彩搭配较为协调，整体效果不错"
    elif harmony_score >= 4:
        harmony_desc = "一般 — 色彩搭配存在一些不协调，可以优化"
    else:
        harmony_desc = "需改进 — 色彩搭配不太和谐，建议参考色彩理论调整"

    suggestions: list[str] = []
    if avg_sat < 20:
        suggestions.append("整体饱和度较低，可以适当提高以增加视觉吸引力")
    elif avg_sat > 80:
        suggestions.append("整体饱和度较高，可能导致视觉疲劳，建议加入一些低饱和度的中性色")

    low_contrast = [p for p in contrast_pairs if p.ratio < 4.5]
    if low_contrast:
        suggestions.append(f"有 {len(low_contrast)} 组颜色对比度不足 (WCAG AA标准)，可能影响文字可读性")

    if all(d < 30 for d in hue_diffs):
        suggestions.append("色相范围较窄，可以考虑加入互补色或对比色增加层次感")

    if not suggestions:
        suggestions.append("色彩方案整体表现良好，搭配和谐")

    return AnalyzeResponse(
        tone=tone,
        tone_description=tone_desc,
        saturation_avg=avg_sat,
        lightness_avg=avg_light,
        harmony_score=harmony_score,
        harmony_description=harmony_desc,
        contrast_pairs=contrast_pairs,
        suggestions=suggestions,
    )
