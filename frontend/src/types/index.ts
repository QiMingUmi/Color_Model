export interface Color {
  id?: number
  hex_value: string
  rgb_r: number
  rgb_g: number
  rgb_b: number
  hsl_h: number
  hsl_s: number
  hsl_l: number
  percentage: number
  sort_order: number
}

export interface Palette {
  id: number
  name: string
  description?: string | null
  tags?: string[] | null
  thumbnail?: string | null
  source_image?: string | null
  created_at: string
  updated_at: string
  colors: Color[]
}

export interface PaletteListItem {
  id: number
  name: string
  description?: string | null
  tags?: string[] | null
  thumbnail?: string | null
  color_count: number
  created_at: string
  updated_at: string
}

export interface PaletteCreate {
  name: string
  description?: string
  tags?: string[]
  colors: Omit<Color, 'id'>[]
}

export interface ExtractRequest {
  image_path: string
  num_colors: number
}

export interface ExtractResponse {
  colors: Color[]
  image_path: string
  num_colors: number
}

export interface ColorizeRequest {
  lineart_path: string
  style: string
}

export interface ColorizeGuidedRequest {
  lineart_path: string
  palette_id: number
  style: string
}

export interface ColorizeTask {
  id: number
  lineart_path: string
  mode: 'auto' | 'guided'
  palette_id?: number | null
  style: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  result_path?: string | null
  created_at: string
}

export interface TheoryRecommendRequest {
  base_color: string
  rule: string
}

export interface RecommendedColor {
  hex_value: string
  rgb_r: number
  rgb_g: number
  rgb_b: number
  hsl_h: number
  hsl_s: number
  hsl_l: number
  name?: string | null
}

export interface TheoryRecommendResponse {
  base_color: string
  rule: string
  rule_description: string
  colors: RecommendedColor[]
  usage_hint: string
}

export interface ScenePreset {
  id: string
  name: string
  category: string
  description: string
  colors: RecommendedColor[]
  tags: string[]
}

export interface SceneRecommendResponse {
  category?: string | null
  presets: ScenePreset[]
}

export interface AnalyzeColor {
  hex_value: string
}

export interface ContrastPair {
  color1: string
  color2: string
  ratio: number
  wcag_aa: boolean
  wcag_aaa: boolean
}

export interface AnalyzeResponse {
  tone: string
  tone_description: string
  saturation_avg: number
  lightness_avg: number
  harmony_score: number
  harmony_description: string
  contrast_pairs: ContrastPair[]
  suggestions: string[]
}

export type ColorRule =
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'split_complementary'
  | 'tetradic'
  | 'square'
