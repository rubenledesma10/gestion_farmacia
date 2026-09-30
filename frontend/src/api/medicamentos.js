import { apiClient } from './client'

export async function getMedicamentos() {
  const { data } = await apiClient.get('/medicamentos')
  return data
}

export async function createMedicamento(medicamento) {
  const { data } = await apiClient.post('/medicamentos', medicamento)
  return data
}

export async function updateMedicamento(id, medicamento) {
  const { data } = await apiClient.patch(`/medicamentos/${id}`, medicamento)
  return data
}

export async function deleteMedicamento(id) {
  await apiClient.delete(`/medicamentos/${id}`)
}
