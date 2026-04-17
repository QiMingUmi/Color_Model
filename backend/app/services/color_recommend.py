import colorsys

from app.schemas.recommend import (
    RecommendedColor,
    ScenePreset,
    SceneRecommendResponse,
    TheoryRecommendResponse,
)


def hex_to_rgb(hex_color: str) -> tuple[int, int, int]:
    hex_color = hex_color.lstrip("#")
    return int(hex_color[0:2], 16), int(hex_color[2:4], 16), int(hex_color[4:6], 16)


def rgb_to_hex(r: int, g: int, b: int) -> str:
    return f"#{r:02X}{g:02X}{b:02X}"


def rgb_to_hsl(r: int, g: int, b: int) -> tuple[int, int, int]:
    h, l, s = colorsys.rgb_to_hls(r / 255.0, g / 255.0, b / 255.0)
    return int(h * 360), int(s * 100), int(l * 100)


def hsl_to_rgb(h: int, s: int, l: int) -> tuple[int, int, int]:
    r, g, b = colorsys.hls_to_rgb(h / 360.0, l / 100.0, s / 100.0)
    return int(r * 255), int(g * 255), int(b * 255)


def _make_color(h: int, s: int, l: int, name: str | None = None) -> RecommendedColor:
    h = h % 360
    r, g, b = hsl_to_rgb(h, s, l)
    return RecommendedColor(
        hex_value=rgb_to_hex(r, g, b),
        rgb_r=r, rgb_g=g, rgb_b=b,
        hsl_h=h, hsl_s=s, hsl_l=l,
        name=name,
    )


RULE_INFO = {
    "complementary": {
        "description": "互补色 — 色轮上相隔180°的两种颜色，形成强烈对比",
        "usage_hint": "适合需要强烈视觉冲击力的设计，如CTA按钮、海报标题",
    },
    "analogous": {
        "description": "类似色 — 色轮上相邻的颜色（±30°），过渡自然和谐",
        "usage_hint": "适合自然、柔和的设计风格，如风景插画、品牌色系",
    },
    "triadic": {
        "description": "三色搭配 — 色轮上均匀分布的三种颜色（间隔120°）",
        "usage_hint": "适合活泼、丰富的设计，如儿童品牌、节日主题",
    },
    "split_complementary": {
        "description": "分裂互补色 — 互补色的左右两侧各偏移30°，保留对比但更柔和",
        "usage_hint": "适合既需要对比又不希望过于激烈的设计场景",
    },
    "tetradic": {
        "description": "四色搭配（矩形） — 两对互补色组合，色彩丰富",
        "usage_hint": "适合信息丰富的界面设计，需注意一个主色其余为辅助色",
    },
    "square": {
        "description": "正方搭配 — 色轮上均匀分布的四种颜色（间隔90°）",
        "usage_hint": "适合需要均衡丰富色彩的设计，如数据可视化配色",
    },
}


def recommend_by_theory(base_hex: str, rule: str) -> TheoryRecommendResponse:
    r, g, b = hex_to_rgb(base_hex)
    h, s, l = rgb_to_hsl(r, g, b)

    if rule not in RULE_INFO:
        raise ValueError(f"Unknown rule: {rule}. Choose from: {list(RULE_INFO.keys())}")

    colors = [_make_color(h, s, l, "基准色")]

    if rule == "complementary":
        colors.append(_make_color(h + 180, s, l, "互补色"))
    elif rule == "analogous":
        colors.append(_make_color(h - 30, s, l, "类似色 -30°"))
        colors.append(_make_color(h + 30, s, l, "类似色 +30°"))
    elif rule == "triadic":
        colors.append(_make_color(h + 120, s, l, "三色 +120°"))
        colors.append(_make_color(h + 240, s, l, "三色 +240°"))
    elif rule == "split_complementary":
        colors.append(_make_color(h + 150, s, l, "分裂互补 +150°"))
        colors.append(_make_color(h + 210, s, l, "分裂互补 +210°"))
    elif rule == "tetradic":
        colors.append(_make_color(h + 60, s, l, "矩形 +60°"))
        colors.append(_make_color(h + 180, s, l, "矩形 +180°"))
        colors.append(_make_color(h + 240, s, l, "矩形 +240°"))
    elif rule == "square":
        colors.append(_make_color(h + 90, s, l, "正方 +90°"))
        colors.append(_make_color(h + 180, s, l, "正方 +180°"))
        colors.append(_make_color(h + 270, s, l, "正方 +270°"))

    info = RULE_INFO[rule]
    return TheoryRecommendResponse(
        base_color=base_hex,
        rule=rule,
        rule_description=info["description"],
        colors=colors,
        usage_hint=info["usage_hint"],
    )


SCENE_PRESETS: list[ScenePreset] = [
    ScenePreset(
        id="warm_sunset",
        name="温暖日落",
        category="emotion",
        description="温暖柔和的日落色调，给人温馨舒适的感受",
        colors=[
            _make_color(15, 85, 55, "落日橙"),
            _make_color(35, 90, 60, "暖金"),
            _make_color(0, 75, 45, "晚霞红"),
            _make_color(45, 70, 70, "浅暖黄"),
            _make_color(350, 50, 35, "暮色玫红"),
        ],
        tags=["温暖", "日落", "自然"],
    ),
    ScenePreset(
        id="ocean_calm",
        name="宁静海洋",
        category="emotion",
        description="冷静深沉的海洋色调，传达宁静与信任感",
        colors=[
            _make_color(200, 70, 45, "深海蓝"),
            _make_color(190, 60, 60, "浅海蓝"),
            _make_color(180, 40, 70, "海雾"),
            _make_color(210, 80, 35, "午夜蓝"),
            _make_color(170, 50, 75, "水沫绿"),
        ],
        tags=["冷静", "海洋", "信任"],
    ),
    ScenePreset(
        id="tech_modern",
        name="科技现代",
        category="industry",
        description="科技感十足的配色方案，适合科技公司和产品界面",
        colors=[
            _make_color(220, 90, 50, "科技蓝"),
            _make_color(260, 70, 55, "电光紫"),
            _make_color(180, 80, 45, "薄荷绿"),
            _make_color(0, 0, 15, "深灰黑"),
            _make_color(0, 0, 95, "纯白"),
        ],
        tags=["科技", "现代", "简约"],
    ),
    ScenePreset(
        id="spring_fresh",
        name="春日清新",
        category="season",
        description="充满生机的春季色调，清新自然",
        colors=[
            _make_color(120, 60, 55, "嫩草绿"),
            _make_color(330, 50, 70, "樱花粉"),
            _make_color(55, 70, 65, "迎春黄"),
            _make_color(90, 45, 60, "青柳"),
            _make_color(280, 35, 75, "紫丁香"),
        ],
        tags=["春天", "清新", "自然"],
    ),
    ScenePreset(
        id="cyberpunk",
        name="赛博朋克",
        category="style",
        description="大胆前卫的赛博朋克配色，充满未来感和科幻氛围",
        colors=[
            _make_color(300, 100, 50, "霓虹粉"),
            _make_color(180, 100, 50, "电光青"),
            _make_color(60, 100, 50, "荧光黄"),
            _make_color(260, 80, 20, "暗紫"),
            _make_color(0, 0, 8, "极夜黑"),
        ],
        tags=["赛博朋克", "霓虹", "未来"],
    ),
    ScenePreset(
        id="nordic_minimal",
        name="北欧极简",
        category="style",
        description="干净素雅的北欧风格，强调自然与简约",
        colors=[
            _make_color(0, 0, 95, "象牙白"),
            _make_color(30, 15, 70, "浅木"),
            _make_color(200, 15, 55, "雾霾蓝"),
            _make_color(120, 10, 60, "灰绿"),
            _make_color(0, 0, 30, "碳灰"),
        ],
        tags=["北欧", "极简", "自然"],
    ),
]


def recommend_by_scene(category: str | None = None) -> SceneRecommendResponse:
    if category:
        filtered = [p for p in SCENE_PRESETS if p.category == category]
    else:
        filtered = SCENE_PRESETS

    return SceneRecommendResponse(category=category, presets=filtered)
