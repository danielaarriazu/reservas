import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { ReservasPage } from './pages/ReservasPage';
import { SalasPage } from './pages/SalasPage';
import { ArticulosPage } from './pages/ArticulosPage';
import { PrediccionesPage } from './pages/PrediccionesPage';
import { UsuariosPage } from './pages/UsuariosPage';
import { ThemeProvider, createTheme } from '@mui/material';
import { Box, CssBaseline } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

const DRAWER_WIDTH = 240;

const MainLayout = ({ children }) => (
  <Box sx={{ display: 'flex' }}>
    <CssBaseline />
    <Navbar />
    <Sidebar />
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml: { sm: `${DRAWER_WIDTH}px` },
        mt: '64px', // Altura del Navbar
        minHeight: 'calc(100vh - 64px)',
        backgroundColor: '#f5f5f5'
      }}
    >
      {children}
    </Box>
  </Box>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route 
              path="/reservas" 
              element={
                <PrivateRoute>
                  <MainLayout>
                    <ReservasPage />
                  </MainLayout>
                </PrivateRoute>
              } 
            />

            <Route 
              path="/salas" 
              element={
                <PrivateRoute>
                  <MainLayout>
                    <SalasPage />
                  </MainLayout>
                </PrivateRoute>
              } 
            />

            <Route 
              path="/articulos" 
              element={
                <PrivateRoute>
                  <MainLayout>
                    <ArticulosPage />
                  </MainLayout>
                </PrivateRoute>
              } 
            />

            <Route 
              path="/predicciones" 
              element={
                <PrivateRoute adminOnly={true}>
                  <MainLayout>
                    <PrediccionesPage />
                  </MainLayout>
                </PrivateRoute>
              } 
            />

            <Route 
              path="/usuarios" 
              element={
                <PrivateRoute adminOnly={true}>
                  <MainLayout>
                    <UsuariosPage />
                  </MainLayout>
                </PrivateRoute>
              } 
            />

            <Route 
              path="/" 
              element={
                <PrivateRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </PrivateRoute>
              } 
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;