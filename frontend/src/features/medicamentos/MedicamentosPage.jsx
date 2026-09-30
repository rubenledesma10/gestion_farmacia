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

import { getMedicamentos, createMedicamento, updateMedicamento, deleteMedicamento } from '../../api/medicamentos'
import { getCategorias } from '../../api/categorias'
import MedicamentoFormDialog from './MedicamentoFormDialog'
import ConfirmDeleteDialog from './ConfirmDeleteDialog'

const currencyFormatter = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })

export default function MedicamentosPage() {
  const [medicamentos, setMedicamentos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const [formOpen, setFormOpen] = useState(false)
  const [medicamentoEnEdicion, setMedicamentoEnEdicion] = useState(null)
  const [medicamentoAEliminar, setMedicamentoAEliminar] = useState(null)

  useEffect(() => {
    let active = true

    async function cargarDatos() {
      try {
        const [medicamentosData, categoriasData] = await Promise.all([getMedicamentos(), getCategorias()])
        if (!active) return
        setMedicamentos(medicamentosData)
        setCategorias(categoriasData)
        setError(null)
      } catch {
        if (active) {
          setError('No se pudieron cargar los medicamentos. Verificá que el backend esté corriendo en http://localhost:3000.')
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
    setMedicamentoEnEdicion(null)
    setFormOpen(true)
  }

  function abrirFormularioEdicion(medicamento) {
    setMedicamentoEnEdicion(medicamento)
    setFormOpen(true)
  }

  async function handleSubmitForm(payload) {
    if (medicamentoEnEdicion) {
      await updateMedicamento(medicamentoEnEdicion.id, payload)
    } else {
      await createMedicamento(payload)
    }
    setFormOpen(false)
    setRefreshKey((key) => key + 1)
  }

  async function handleConfirmDelete() {
    await deleteMedicamento(medicamentoAEliminar.id)
    setMedicamentoAEliminar(null)
    setRefreshKey((key) => key + 1)
  }

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Medicamentos
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={abrirFormularioNuevo}>
          Agregar medicamento
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
                <TableCell>Descripción</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell align="right">Precio</TableCell>
                <TableCell align="right">Stock</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {medicamentos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No hay medicamentos cargados todavía.
                  </TableCell>
                </TableRow>
              )}
              {medicamentos.map((medicamento) => (
                <TableRow key={medicamento.id}>
                  <TableCell>{medicamento.nombre}</TableCell>
                  <TableCell>{medicamento.descripcion || '—'}</TableCell>
                  <TableCell>{medicamento.categoria?.nombre ?? '—'}</TableCell>
                  <TableCell align="right">{currencyFormatter.format(Number(medicamento.precio))}</TableCell>
                  <TableCell align="right">{medicamento.stock}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => abrirFormularioEdicion(medicamento)} aria-label="editar">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => setMedicamentoAEliminar(medicamento)} aria-label="eliminar">
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
        <MedicamentoFormDialog
          key={medicamentoEnEdicion?.id ?? 'new'}
          medicamento={medicamentoEnEdicion}
          categorias={categorias}
          onClose={() => setFormOpen(false)}
          onSubmit={handleSubmitForm}
        />
      )}

      <ConfirmDeleteDialog
        open={Boolean(medicamentoAEliminar)}
        medicamento={medicamentoAEliminar}
        onCancel={() => setMedicamentoAEliminar(null)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  )
}
