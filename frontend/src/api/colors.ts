import type { ExtractRequest, ExtractResponse } from '@/types'
import apiClient from './client'

export async function extractColors(data: ExtractRequest): Promise<ExtractResponse> {
  const response = await apiClient.post('/colors/extract', data)
  return response.data
}
