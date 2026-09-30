import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'

const emptyForm = {
  nombre: '',
  descripcion: '',
}

function buildFormFromCategoria(categoria) {
  if (!categoria) return emptyForm
  return {
    nombre: categoria.nombre ?? '',
    descripcion: categoria.descripcion ?? '',
  }
}

function validate(form) {
  const errors = {}

  if (!form.nombre.trim()) {
    errors.nombre = 'El nombre de la categoría es obligatorio'
  }

  return errors
}

export default function CategoriaFormDialog({ categoria, onClose, onSubmit }) {
  const [form, setForm] = useState(() => buildFormFromCategoria(categoria))
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const isEditing = Boolean(categoria)

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
    }

    setSubmitting(true)
    setSubmitError(null)
    try {
      await onSubmit(payload)
    } catch (error) {
      const backendMessage = error?.response?.data?.message
      setSubmitError(Array.isArray(backendMessage) ? backendMessage.join(', ') : backendMessage || 'No se pudo guardar la categoría')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isEditing ? 'Editar categoría' : 'Agregar categoría'}</DialogTitle>
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
