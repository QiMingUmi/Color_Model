import type { ColorizeGuidedRequest, ColorizeRequest, ColorizeTask } from '@/types'
import apiClient from './client'

export async function uploadLineart(file: File): Promise<{ lineart_path: string; filename: string }> {
  const formData = new FormData()
  formData.append('file', file)
  const response = await apiClient.post('/colorize/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export async function autoColorize(data: ColorizeRequest): Promise<ColorizeTask> {
  const response = await apiClient.post('/colorize/auto', data)
  return response.data
}

export async function guidedColorize(data: ColorizeGuidedRequest): Promise<ColorizeTask> {
  const response = await apiClient.post('/colorize/guided', data)
  return response.data
}

export async function getTask(taskId: number): Promise<ColorizeTask> {
  const response = await apiClient.get(`/colorize/tasks/${taskId}`)
  return response.data
}
