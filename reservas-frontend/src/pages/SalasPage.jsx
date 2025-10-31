import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  Switch,
  FormControlLabel
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

export const SalasPage = () => {
  const [salas, setSalas] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSala, setEditingSala] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { isAdmin } = useAuth();

  const [formData, setFormData] = useState({
    nombre: '',
    capacidad: '',
    disponible: true
  });

  useEffect(() => {
    loadSalas();
  }, []);

  const loadSalas = async () => {
    try {
      const response = await api.get('/salas');
      setSalas(response.data);
    } catch (error) {
      console.error('Error al cargar salas:', error);
      setError('Error al cargar las salas');
    }
  };

  const handleOpenDialog = (sala = null) => {
    if (sala) {
      setEditingSala(sala);
      setFormData({
        nombre: sala.nombre,
        capacidad: sala.capacidad,
        disponible: sala.disponible
      });
    } else {
      setEditingSala(null);
      setFormData({
        nombre: '',
        capacidad: '',
        disponible: true
      });
    }
    setOpenDialog(true);
    setError('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSala(null);
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const payload = {
        nombre: formData.nombre,
        capacidad: parseInt(formData.capacidad),
        disponible: formData.disponible
      };

      if (editingSala) {
        await api.put(`/salas/${editingSala.id}`, payload);
      } else {
        await api.post('/salas', payload);
      }

      await loadSalas();
      handleCloseDialog();
    } catch (error) {
      console.error('Error al guardar sala:', error);
      setError(error.response?.data || 'Error al guardar la sala');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta sala?')) {
      try {
        await api.delete(`/salas/${id}`);
        await loadSalas();
      } catch (error) {
        console.error('Error al eliminar sala:', error);
        setError('Error al eliminar la sala');
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Salas
        </Typography>
        {isAdmin() && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Nueva Sala
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>Capacidad</strong></TableCell>
              <TableCell><strong>Estado</strong></TableCell>
              {isAdmin() && <TableCell align="center"><strong>Acciones</strong></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {salas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No hay salas registradas
                </TableCell>
              </TableRow>
            ) : (
              salas.map((sala) => (
                <TableRow key={sala.id} hover>
                  <TableCell>{sala.id}</TableCell>
                  <TableCell>{sala.nombre}</TableCell>
                  <TableCell>{sala.capacidad} personas</TableCell>
                  <TableCell>
                    <Chip
                      label={sala.disponible ? 'Disponible' : 'No disponible'}
                      color={sala.disponible ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  {isAdmin() && (
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(sala)}
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(sala.id)}
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog para crear/editar */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingSala ? 'Editar Sala' : 'Nueva Sala'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              fullWidth
            />

            <TextField
              label="Capacidad"
              name="capacidad"
              type="number"
              value={formData.capacidad}
              onChange={handleChange}
              required
              fullWidth
              inputProps={{ min: 1 }}
            />

            <FormControlLabel
              control={
                <Switch
                  name="disponible"
                  checked={formData.disponible}
                  onChange={handleChange}
                />
              }
              label="Disponible"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || !formData.nombre || !formData.capacidad}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};