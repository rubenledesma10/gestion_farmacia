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
import SearchIcon from '@mui/icons-material/Search'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import InputAdornment from '@mui/material/InputAdornment'

import { getMedicamentos, createMedicamento, updateMedicamento, deleteMedicamento } from '../../api/medicamentos'
import { getCategorias } from '../../api/categorias'
import MedicamentoFormDialog from './MedicamentoFormDialog'
import ConfirmDeleteDialog from './ConfirmDeleteDialog'

const currencyFormatter = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })

// Un medicamento con stock igual o menor a este valor se considera con stock bajo
const STOCK_BAJO = 10

function normalizar(texto) {
  return String(texto ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

export default function MedicamentosPage() {
  const [medicamentos, setMedicamentos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const [formOpen, setFormOpen] = useState(false)
  const [medicamentoEnEdicion, setMedicamentoEnEdicion] = useState(null)
  const [medicamentoAEliminar, setMedicamentoAEliminar] = useState(null)

  const [busqueda, setBusqueda] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState('')
  const [soloStockBajo, setSoloStockBajo] = useState(false)

  const cantidadStockBajo = medicamentos.filter((medicamento) => medicamento.stock <= STOCK_BAJO).length
  const textoBusqueda = normalizar(busqueda.trim())
  const medicamentosFiltrados = medicamentos.filter((medicamento) => {
    if (soloStockBajo && medicamento.stock > STOCK_BAJO) return false
    if (categoriaFiltro && String(medicamento.categoria?.id) !== categoriaFiltro) return false
    if (!textoBusqueda) return true
    return [medicamento.nombre, medicamento.descripcion, medicamento.categoria?.nombre].some((campo) =>
      normalizar(campo).includes(textoBusqueda),
    )
  })

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

      {!loading && cantidadStockBajo > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {cantidadStockBajo === 1
            ? '1 medicamento con stock bajo'
            : `${cantidadStockBajo} medicamentos con stock bajo`}{' '}
          (menos de {STOCK_BAJO + 1} unidades).
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
        <TextField
          size="small"
          label="Buscar medicamento"
          value={busqueda}
          onChange={(event) => setBusqueda(event.target.value)}
          sx={{ minWidth: 280 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          select
          size="small"
          label="Categoría"
          value={categoriaFiltro}
          onChange={(event) => setCategoriaFiltro(event.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">Todas las categorías</MenuItem>
          {categorias.map((categoria) => (
            <MenuItem key={categoria.id} value={String(categoria.id)}>
              {categoria.nombre}
            </MenuItem>
          ))}
        </TextField>
        <FormControlLabel
          control={<Switch checked={soloStockBajo} onChange={(event) => setSoloStockBajo(event.target.checked)} />}
          label="Solo stock bajo"
        />
      </Box>

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
              {medicamentos.length > 0 && medicamentosFiltrados.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No se encontraron medicamentos con esos filtros.
                  </TableCell>
                </TableRow>
              )}
              {medicamentosFiltrados.map((medicamento) => (
                <TableRow key={medicamento.id}>
                  <TableCell>{medicamento.nombre}</TableCell>
                  <TableCell>{medicamento.descripcion || '—'}</TableCell>
                  <TableCell>{medicamento.categoria?.nombre ?? '—'}</TableCell>
                  <TableCell align="right">{currencyFormatter.format(Number(medicamento.precio))}</TableCell>
                  <TableCell align="right">
                    {medicamento.stock <= STOCK_BAJO && (
                      <Chip
                        size="small"
                        color={medicamento.stock === 0 ? 'error' : 'warning'}
                        label={medicamento.stock === 0 ? 'Sin stock' : 'Stock bajo'}
                        sx={{ mr: 1 }}
                      />
                    )}
                    {medicamento.stock}
                  </TableCell>
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
