import { useState } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import MedicamentosPage from './features/medicamentos/MedicamentosPage'
import CategoriasPage from './features/categorias/CategoriasPage'

const theme = createTheme()

function App() {
  const [tab, setTab] = useState('medicamentos')

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 4 }}>
        <Tabs value={tab} onChange={(_event, value) => setTab(value)}>
          <Tab label="Medicamentos" value="medicamentos" />
          <Tab label="Categorías" value="categorias" />
        </Tabs>
      </Box>
      {tab === 'medicamentos' ? <MedicamentosPage /> : <CategoriasPage />}
    </ThemeProvider>
  )
}

export default App
