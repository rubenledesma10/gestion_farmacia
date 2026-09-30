import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import MedicamentosPage from './features/medicamentos/MedicamentosPage'

const theme = createTheme()

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MedicamentosPage />
    </ThemeProvider>
  )
}

export default App
