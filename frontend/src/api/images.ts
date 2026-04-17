import apiClient from './client'

export async function uploadImage(file: File): Promise<{ image_path: string; filename: string }> {
  const formData = new FormData()
  formData.append('file', file)
  const response = await apiClient.post('/images/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}
