import { apiClient } from './client'

export async function getCategorias() {
  const { data } = await apiClient.get('/categorias')
  return data
}
