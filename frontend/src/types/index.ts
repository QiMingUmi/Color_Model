export interface ColorInfo {
  hex: string
  rgb: { r: number; g: number; b: number }
  hsl: { h: number; s: number; l: number }
  percentage: number
  name?: string
}

export interface Palette {
  id: string
  name: string
  description: string
  tags: string[]
  colors: ColorInfo[]
  thumbnail?: string
  createdAt: string
  updatedAt: string
}

export interface ColorizeTask {
  id: string
  lineartPath: string
  mode: 'auto' | 'guided'
  paletteId?: string
  style: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  resultPath?: string
  createdAt: string
}

export interface SceneCategory {
  id: string
  name: string
  icon: string
  subcategories: { id: string; name: string; palettes: Palette[] }[]
}
