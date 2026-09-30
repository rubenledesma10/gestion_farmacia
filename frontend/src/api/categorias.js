import { apiClient } from './client'

export async function getCategorias() {
  const { data } = await apiClient.get('/categorias')
  return data
}

export async function createCategoria(categoria) {
  const { data } = await apiClient.post('/categorias', categoria)
  return data
}

export async function updateCategoria(id, categoria) {
  const { data } = await apiClient.patch(`/categorias/${id}`, categoria)
  return data
}

export async function deleteCategoria(id) {
  await apiClient.delete(`/categorias/${id}`)
}
