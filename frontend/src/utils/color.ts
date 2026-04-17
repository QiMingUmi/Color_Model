import type { ColorInfo } from '../types'

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 0, g: 0, b: 0 }
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max - min)
  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

export function getContrastColor(hex: string): string {
  const { r, g, b } = hexToRgb(hex)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#1a1a2e' : '#ffffff'
}

export function getComplementary(hex: string): string {
  const { r, g, b } = hexToRgb(hex)
  const hsl = rgbToHsl(r, g, b)
  return hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l)
}

export function getAnalogous(hex: string): string[] {
  const { r, g, b } = hexToRgb(hex)
  const hsl = rgbToHsl(r, g, b)
  return [
    hslToHex((hsl.h + 330) % 360, hsl.s, hsl.l),
    hex,
    hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l),
  ]
}

export function getTriadic(hex: string): string[] {
  const { r, g, b } = hexToRgb(hex)
  const hsl = rgbToHsl(r, g, b)
  return [
    hex,
    hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l),
  ]
}

export function getSplitComplementary(hex: string): string[] {
  const { r, g, b } = hexToRgb(hex)
  const hsl = rgbToHsl(r, g, b)
  return [
    hex,
    hslToHex((hsl.h + 150) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h + 210) % 360, hsl.s, hsl.l),
  ]
}

export function getTetradic(hex: string): string[] {
  const { r, g, b } = hexToRgb(hex)
  const hsl = rgbToHsl(r, g, b)
  return [
    hex,
    hslToHex((hsl.h + 90) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h + 270) % 360, hsl.s, hsl.l),
  ]
}

export function generateScheme(hex: string, type: string): string[] {
  switch (type) {
    case 'complementary': return [hex, getComplementary(hex)]
    case 'analogous': return getAnalogous(hex)
    case 'triadic': return getTriadic(hex)
    case 'split-complementary': return getSplitComplementary(hex)
    case 'tetradic': return getTetradic(hex)
    case 'square': return getTetradic(hex)
    default: return [hex]
  }
}

export function createColorInfo(hex: string, percentage: number = 0): ColorInfo {
  const rgb = hexToRgb(hex)
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  return { hex, rgb, hsl, percentage }
}

export const DEMO_PALETTES: ColorInfo[][] = [
  [
    createColorInfo('#264653', 30),
    createColorInfo('#2a9d8f', 25),
    createColorInfo('#e9c46a', 20),
    createColorInfo('#f4a261', 15),
    createColorInfo('#e76f51', 10),
  ],
  [
    createColorInfo('#606c38', 25),
    createColorInfo('#283618', 20),
    createColorInfo('#fefae0', 25),
    createColorInfo('#dda15e', 15),
    createColorInfo('#bc6c25', 15),
  ],
  [
    createColorInfo('#003049', 20),
    createColorInfo('#d62828', 20),
    createColorInfo('#f77f00', 20),
    createColorInfo('#fcbf49', 20),
    createColorInfo('#eae2b7', 20),
  ],
]

export const SCENE_PALETTES: Record<string, string[]> = {
  warm: ['#FF6B6B', '#FFA07A', '#FFD700', '#FF8C42', '#FF4E50'],
  cool: ['#4FC3F7', '#29B6F6', '#0288D1', '#01579B', '#B3E5FC'],
  nature: ['#2D6A4F', '#40916C', '#52B788', '#95D5B2', '#D8F3DC'],
  elegant: ['#2C2C54', '#474787', '#AAABB8', '#D1D1E0', '#ECECEC'],
  vibrant: ['#FF006E', '#FB5607', '#FFBE0B', '#3A86FF', '#8338EC'],
  retro: ['#E07A5F', '#3D405B', '#81B29A', '#F2CC8F', '#F4F1DE'],
  cyberpunk: ['#0D0221', '#0F084B', '#26408B', '#A6CFD5', '#C2E7D9'],
  japanese: ['#F7CAC9', '#92A8D1', '#955251', '#B565A7', '#009B77'],
  nordic: ['#ECEBE4', '#D3CEC4', '#9F978E', '#6B6560', '#3D3835'],
  tech: ['#0F1624', '#1A2332', '#2E4057', '#048A81', '#54C6EB'],
}
