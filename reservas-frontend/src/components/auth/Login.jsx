import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box,
  Alert,
  Link
} from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <LoginIcon sx={{ mr: 1, fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" align="center">
            Iniciar Sesión
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            autoFocus
          />

          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            sx={{ mt: 3 }}
          >
            Entrar
          </Button>
        </Box>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            ¿No tienes cuenta?{' '}
            <Link component={RouterLink} to="/register" underline="hover">
              Regístrate aquí
            </Link>
          </Typography>
        </Box>

        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="body2" align="center">
            <strong>Usuarios de prueba:</strong>
          </Typography>
          <Typography variant="body2" align="center">
            Admin: admin@shipnet.com / admin123
          </Typography>
          <Typography variant="body2" align="center">
            Usuario: dani@example.com / user123
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};