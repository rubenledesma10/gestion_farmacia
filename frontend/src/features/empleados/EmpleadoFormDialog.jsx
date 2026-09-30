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
  apellido: '',
  dni: '',
  email: '',
  telefono: '',
  cargo: '',
  fechaIngreso: '',
}

function buildFormFromEmpleado(empleado) {
  if (!empleado) return emptyForm
  return {
    nombre: empleado.nombre ?? '',
    apellido: empleado.apellido ?? '',
    dni: empleado.dni ?? '',
    email: empleado.email ?? '',
    telefono: empleado.telefono ?? '',
    cargo: empleado.cargo ?? '',
    fechaIngreso: empleado.fechaIngreso ? String(empleado.fechaIngreso).slice(0, 10) : '',
  }
}

function validate(form) {
  const errors = {}

  if (!form.nombre.trim()) errors.nombre = 'El nombre del empleado es obligatorio'
  if (!form.apellido.trim()) errors.apellido = 'El apellido del empleado es obligatorio'
  if (!form.dni.trim()) errors.dni = 'El DNI del empleado es obligatorio'

  if (!form.email.trim()) {
    errors.email = 'El email del empleado es obligatorio'
  } else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
    errors.email = 'El email no es válido'
  }

  if (!form.cargo.trim()) errors.cargo = 'El cargo es obligatorio'
  if (!form.fechaIngreso) errors.fechaIngreso = 'La fecha de ingreso es obligatoria'

  return errors
}

export default function EmpleadoFormDialog({ empleado, onClose, onSubmit }) {
  const [form, setForm] = useState(() => buildFormFromEmpleado(empleado))
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const isEditing = Boolean(empleado)

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
      apellido: form.apellido.trim(),
      dni: form.dni.trim(),
      email: form.email.trim(),
      telefono: form.telefono.trim() ? form.telefono.trim() : undefined,
      cargo: form.cargo.trim(),
      fechaIngreso: form.fechaIngreso,
    }

    setSubmitting(true)
    setSubmitError(null)
    try {
      await onSubmit(payload)
    } catch (error) {
      const backendMessage = error?.response?.data?.message
      setSubmitError(Array.isArray(backendMessage) ? backendMessage.join(', ') : backendMessage || 'No se pudo guardar el empleado')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isEditing ? 'Editar empleado' : 'Agregar empleado'}</DialogTitle>
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
              label="Apellido"
              value={form.apellido}
              onChange={handleChange('apellido')}
              error={Boolean(errors.apellido)}
              helperText={errors.apellido}
              fullWidth
            />
            <TextField
              label="DNI"
              value={form.dni}
              onChange={handleChange('dni')}
              error={Boolean(errors.dni)}
              helperText={errors.dni}
              inputMode="numeric"
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              error={Boolean(errors.email)}
              helperText={errors.email}
              fullWidth
            />
            <TextField label="Teléfono (opcional)" value={form.telefono} onChange={handleChange('telefono')} inputMode="tel" fullWidth />
            <TextField
              label="Cargo"
              value={form.cargo}
              onChange={handleChange('cargo')}
              error={Boolean(errors.cargo)}
              helperText={errors.cargo}
              fullWidth
            />
            <TextField
              label="Fecha de ingreso"
              type="date"
              value={form.fechaIngreso}
              onChange={handleChange('fechaIngreso')}
              error={Boolean(errors.fechaIngreso)}
              helperText={errors.fechaIngreso}
              slotProps={{ inputLabel: { shrink: true } }}
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
