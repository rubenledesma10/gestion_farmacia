import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'

const emptyForm = {
  nombre: '',
  descripcion: '',
  precio: '',
  stock: '',
  categoriaId: '',
}

function buildFormFromMedicamento(medicamento) {
  if (!medicamento) return emptyForm
  return {
    nombre: medicamento.nombre ?? '',
    descripcion: medicamento.descripcion ?? '',
    precio: medicamento.precio != null ? String(medicamento.precio) : '',
    stock: medicamento.stock != null ? String(medicamento.stock) : '',
    categoriaId: medicamento.categoria?.id != null ? String(medicamento.categoria.id) : '',
  }
}

function validate(form) {
  const errors = {}

  if (!form.nombre.trim()) {
    errors.nombre = 'El nombre del medicamento es obligatorio'
  }

  const precio = Number(form.precio)
  if (form.precio === '' || Number.isNaN(precio)) {
    errors.precio = 'El precio es obligatorio'
  } else if (precio < 0) {
    errors.precio = 'El precio no puede ser negativo'
  } else if (!/^\d+(\.\d{1,2})?$/.test(form.precio)) {
    errors.precio = 'El precio admite hasta 2 decimales'
  }

  const stock = Number(form.stock)
  if (form.stock === '' || Number.isNaN(stock)) {
    errors.stock = 'El stock es obligatorio'
  } else if (stock < 0) {
    errors.stock = 'El stock debe ser un número positivo'
  }

  if (!form.categoriaId) {
    errors.categoriaId = 'La categoría es obligatoria'
  }

  return errors
}

export default function MedicamentoFormDialog({ medicamento, categorias, onClose, onSubmit }) {
  const [form, setForm] = useState(() => buildFormFromMedicamento(medicamento))
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const isEditing = Boolean(medicamento)

  function handleChange(field) {
    return (event) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }))
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const validationErrors = validate(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      return
    }

    const payload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim() ? form.descripcion.trim() : undefined,
      precio: Number(form.precio),
      stock: Number(form.stock),
      categoriaId: Number(form.categoriaId),
    }

    setSubmitting(true)
    setSubmitError(null)
    try {
      await onSubmit(payload)
    } catch (error) {
      const backendMessage = error?.response?.data?.message
      setSubmitError(Array.isArray(backendMessage) ? backendMessage.join(', ') : backendMessage || 'No se pudo guardar el medicamento')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isEditing ? 'Editar medicamento' : 'Agregar medicamento'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nombre"
              value={form.nombre}
              onChange={handleChange('nombre')}
              error={Boolean(errors.nombre)}
              helperText={errors.nombre}
              autoFocus
              fullWidth
            />
            <TextField
              label="Descripción"
              value={form.descripcion}
              onChange={handleChange('descripcion')}
              multiline
              minRows={2}
              fullWidth
            />
            <TextField
              label="Precio"
              value={form.precio}
              onChange={handleChange('precio')}
              error={Boolean(errors.precio)}
              helperText={errors.precio}
              inputMode="decimal"
              fullWidth
            />
            <TextField
              label="Stock"
              value={form.stock}
              onChange={handleChange('stock')}
              error={Boolean(errors.stock)}
              helperText={errors.stock}
              inputMode="numeric"
              fullWidth
            />
            <TextField
              select
              label="Categoría"
              value={form.categoriaId}
              onChange={handleChange('categoriaId')}
              error={Boolean(errors.categoriaId)}
              helperText={errors.categoriaId || (categorias.length === 0 ? 'Primero creá una categoría en la pestaña Categorías' : undefined)}
              disabled={categorias.length === 0}
              fullWidth
            >
              {categorias.map((categoria) => (
                <MenuItem key={categoria.id} value={String(categoria.id)}>
                  {categoria.nombre}
                </MenuItem>
              ))}
            </TextField>
            {submitError && <div style={{ color: '#d32f2f', fontSize: 14 }}>{submitError}</div>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {isEditing ? 'Guardar cambios' : 'Agregar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
