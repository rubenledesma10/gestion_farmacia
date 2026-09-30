import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'

export default function ConfirmDeleteDialog({ open, categoria, onCancel, onConfirm }) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function handleConfirm() {
    setSubmitting(true)
    setError(null)
    try {
      await onConfirm()
    } catch (err) {
      const backendMessage = err?.response?.data?.message
      setError(
        Array.isArray(backendMessage)
          ? backendMessage.join(', ')
          : backendMessage || 'No se pudo eliminar la categoría. Puede tener medicamentos asociados.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  function handleCancel() {
    setError(null)
    onCancel()
  }

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>Eliminar categoría</DialogTitle>
      <DialogContent>
        <DialogContentText>
          ¿Seguro que querés eliminar "{categoria?.nombre}"? Esta acción no se puede deshacer.
        </DialogContentText>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} disabled={submitting}>
          Cancelar
        </Button>
        <Button onClick={handleConfirm} color="error" variant="contained" disabled={submitting}>
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
