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

import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from '../../api/categorias'
import CategoriaFormDialog from './CategoriaFormDialog'
import ConfirmDeleteDialog from './ConfirmDeleteDialog'

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const [formOpen, setFormOpen] = useState(false)
  const [categoriaEnEdicion, setCategoriaEnEdicion] = useState(null)
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null)

  useEffect(() => {
    let active = true

    async function cargarDatos() {
      try {
        const categoriasData = await getCategorias()
        if (!active) return
        setCategorias(categoriasData)
        setError(null)
      } catch {
        if (active) {
          setError('No se pudieron cargar las categorías. Verificá que el backend esté corriendo en http://localhost:3000.')
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
    setCategoriaEnEdicion(null)
    setFormOpen(true)
  }

  function abrirFormularioEdicion(categoria) {
    setCategoriaEnEdicion(categoria)
    setFormOpen(true)
  }

  async function handleSubmitForm(payload) {
    if (categoriaEnEdicion) {
      await updateCategoria(categoriaEnEdicion.id, payload)
    } else {
      await createCategoria(payload)
    }
    setFormOpen(false)
    setRefreshKey((key) => key + 1)
  }

  async function handleConfirmDelete() {
    await deleteCategoria(categoriaAEliminar.id)
    setCategoriaAEliminar(null)
    setRefreshKey((key) => key + 1)
  }

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Categorías
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={abrirFormularioNuevo}>
          Agregar categoría
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
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categorias.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No hay categorías cargadas todavía.
                  </TableCell>
                </TableRow>
              )}
              {categorias.map((categoria) => (
                <TableRow key={categoria.id}>
                  <TableCell>{categoria.nombre}</TableCell>
                  <TableCell>{categoria.descripcion || '—'}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => abrirFormularioEdicion(categoria)} aria-label="editar">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => setCategoriaAEliminar(categoria)} aria-label="eliminar">
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
        <CategoriaFormDialog
          key={categoriaEnEdicion?.id ?? 'new'}
          categoria={categoriaEnEdicion}
          onClose={() => setFormOpen(false)}
          onSubmit={handleSubmitForm}
        />
      )}

      <ConfirmDeleteDialog
        open={Boolean(categoriaAEliminar)}
        categoria={categoriaAEliminar}
        onCancel={() => setCategoriaAEliminar(null)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  )
}
