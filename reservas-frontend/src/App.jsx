import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Login } from './components/auth/Login';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route 
              path="/" 
              element={
                <PrivateRoute>
                  <div style={{ padding: '20px' }}>
                    <h1>Dashboard - Bienvenido!</h1>
                    <p>Aquí irá el contenido principal</p>
                  </div>
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