import { apiClient } from './client'

export async function getEmpleados() {
  const { data } = await apiClient.get('/empleados')
  return data
}

export async function createEmpleado(empleado) {
  const { data } = await apiClient.post('/empleados', empleado)
  return data
}

export async function updateEmpleado(id, empleado) {
  const { data } = await apiClient.patch(`/empleados/${id}`, empleado)
  return data
}

export async function deleteEmpleado(id) {
  await apiClient.delete(`/empleados/${id}`)
}
