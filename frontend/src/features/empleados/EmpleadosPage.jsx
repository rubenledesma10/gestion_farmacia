import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'

import { getEmpleados, createEmpleado, updateEmpleado, deleteEmpleado } from '../../api/empleados'
import EmpleadoFormDialog from './EmpleadoFormDialog'
import ConfirmDeleteDialog from './ConfirmDeleteDialog'

function formatFecha(fecha) {
  if (!fecha) return '—'
  const [anio, mes, dia] = String(fecha).slice(0, 10).split('-')
  return `${dia}/${mes}/${anio}`
}

export default function EmpleadosPage() {
  const [empleados, setEmpleados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const [formOpen, setFormOpen] = useState(false)
  const [empleadoEnEdicion, setEmpleadoEnEdicion] = useState(null)
  const [empleadoAEliminar, setEmpleadoAEliminar] = useState(null)

  useEffect(() => {
    let active = true

    async function cargarDatos() {
      try {
        const empleadosData = await getEmpleados()
        if (!active) return
        setEmpleados(empleadosData)
        setError(null)
      } catch {
        if (active) {
          setError('No se pudieron cargar los empleados. Verificá que el backend esté corriendo en http://localhost:3000.')
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    cargarDatos()
    return () => {
      active = false
    }
  }, [refreshKey])

  function abrirFormularioNuevo() {
    setEmpleadoEnEdicion(null)
    setFormOpen(true)
  }

  function abrirFormularioEdicion(empleado) {
    setEmpleadoEnEdicion(empleado)
    setFormOpen(true)
  }

  async function handleSubmitForm(payload) {
    if (empleadoEnEdicion) {
      await updateEmpleado(empleadoEnEdicion.id, payload)
    } else {
      await createEmpleado(payload)
    }
    setFormOpen(false)
    setRefreshKey((key) => key + 1)
  }

  async function handleConfirmDelete() {
    await deleteEmpleado(empleadoAEliminar.id)
    setEmpleadoAEliminar(null)
    setRefreshKey((key) => key + 1)
  }

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Empleados
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={abrirFormularioNuevo}>
          Agregar empleado
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>DNI</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Cargo</TableCell>
                <TableCell>Fecha de ingreso</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {empleados.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No hay empleados cargados todavía.
                  </TableCell>
                </TableRow>
              )}
              {empleados.map((empleado) => (
                <TableRow key={empleado.id}>
                  <TableCell>
                    {empleado.nombre} {empleado.apellido}
                  </TableCell>
                  <TableCell>{empleado.dni}</TableCell>
                  <TableCell>{empleado.email}</TableCell>
                  <TableCell>{empleado.telefono || '—'}</TableCell>
                  <TableCell>{empleado.cargo}</TableCell>
                  <TableCell>{formatFecha(empleado.fechaIngreso)}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => abrirFormularioEdicion(empleado)} aria-label="editar">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => setEmpleadoAEliminar(empleado)} aria-label="eliminar">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {formOpen && (
        <EmpleadoFormDialog
          key={empleadoEnEdicion?.id ?? 'new'}
          empleado={empleadoEnEdicion}
          onClose={() => setFormOpen(false)}
          onSubmit={handleSubmitForm}
        />
      )}

      <ConfirmDeleteDialog
        open={Boolean(empleadoAEliminar)}
        empleado={empleadoAEliminar}
        onCancel={() => setEmpleadoAEliminar(null)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  )
}
