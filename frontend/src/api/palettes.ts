import type { Palette, PaletteCreate, PaletteListItem } from '@/types'
import apiClient from './client'

export async function listPalettes(params?: {
  search?: string
  tag?: string
  skip?: number
  limit?: number
}): Promise<PaletteListItem[]> {
  const response = await apiClient.get('/palettes', { params })
  return response.data
}

export async function getPalette(id: number): Promise<Palette> {
  const response = await apiClient.get(`/palettes/${id}`)
  return response.data
}

export async function createPalette(data: PaletteCreate): Promise<Palette> {
  const response = await apiClient.post('/palettes', data)
  return response.data
}

export async function updatePalette(
  id: number,
  data: { name?: string; description?: string; tags?: string[] }
): Promise<Palette> {
  const response = await apiClient.put(`/palettes/${id}`, data)
  return response.data
}

export async function deletePalette(id: number): Promise<void> {
  await apiClient.delete(`/palettes/${id}`)
}

export async function exportPalette(id: number, format: string = 'json'): Promise<any> {
  const response = await apiClient.get(`/palettes/${id}/export`, { params: { format } })
  return response.data
}
