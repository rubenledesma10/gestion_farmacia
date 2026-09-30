import { useState } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import MedicamentosPage from './features/medicamentos/MedicamentosPage'
import CategoriasPage from './features/categorias/CategoriasPage'
import EmpleadosPage from './features/empleados/EmpleadosPage'

const theme = createTheme()

const pages = {
  medicamentos: MedicamentosPage,
  categorias: CategoriasPage,
  empleados: EmpleadosPage,
}

function App() {
  const [tab, setTab] = useState('medicamentos')
  const CurrentPage = pages[tab]

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 4 }}>
        <Tabs value={tab} onChange={(_event, value) => setTab(value)}>
          <Tab label="Medicamentos" value="medicamentos" />
          <Tab label="Categorías" value="categorias" />
          <Tab label="Empleados" value="empleados" />
        </Tabs>
      </Box>
      <CurrentPage />
    </ThemeProvider>
  )
}

export default App
