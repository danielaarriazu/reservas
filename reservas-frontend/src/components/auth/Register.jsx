import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  MenuItem,
  Link
} from '@mui/material';
import { PersonAdd } from '@mui/icons-material';
import api from '../../services/api';

export const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    rol: 'USUARIO'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
        rol: formData.rol
      };

      await api.post('/auth/registro', payload);
      setSuccess(true);
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setError(error.response?.data || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Alert severity="success">
            ¡Registro exitoso! Redirigiendo al login...
          </Alert>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <PersonAdd sx={{ mr: 1, fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" align="center">
            Registro de Usuario
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
            label="Nombre completo"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            margin="normal"
            required
            autoFocus
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Contraseña"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            helperText="Mínimo 6 caracteres"
          />

          <TextField
            fullWidth
            label="Confirmar contraseña"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            select
            fullWidth
            label="Tipo de usuario"
            name="rol"
            value={formData.rol}
            onChange={handleChange}
            margin="normal"
            required
          >
            <MenuItem value="USUARIO">Usuario</MenuItem>
            <MenuItem value="ADMIN">Administrador</MenuItem>
          </TextField>

          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </Button>
        </Box>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            ¿Ya tienes cuenta?{' '}
            <Link component={RouterLink} to="/login" underline="hover">
              Inicia sesión aquí
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};