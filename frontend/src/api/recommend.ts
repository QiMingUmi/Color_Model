import type {
  AnalyzeResponse,
  SceneRecommendResponse,
  TheoryRecommendRequest,
  TheoryRecommendResponse,
} from '@/types'
import apiClient from './client'

export async function theoryRecommend(data: TheoryRecommendRequest): Promise<TheoryRecommendResponse> {
  const response = await apiClient.post('/recommend/theory', data)
  return response.data
}

export async function sceneRecommend(category?: string): Promise<SceneRecommendResponse> {
  const response = await apiClient.get('/recommend/scene', {
    params: category ? { category } : {},
  })
  return response.data
}

export async function analyzeColors(colors: { hex_value: string }[]): Promise<AnalyzeResponse> {
  const response = await apiClient.post('/analyze', { colors })
  return response.data
}
