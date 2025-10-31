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

export const ArticulosPage = () => {
  const [articulos, setArticulos] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingArticulo, setEditingArticulo] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { isAdmin } = useAuth();

  const [formData, setFormData] = useState({
    nombre: '',
    disponible: true
  });

  useEffect(() => {
    loadArticulos();
  }, []);

  const loadArticulos = async () => {
    try {
      const response = await api.get('/articulos');
      setArticulos(response.data);
    } catch (error) {
      console.error('Error al cargar artículos:', error);
      setError('Error al cargar los artículos');
    }
  };

  const handleOpenDialog = (articulo = null) => {
    if (articulo) {
      setEditingArticulo(articulo);
      setFormData({
        nombre: articulo.nombre,
        disponible: articulo.disponible
      });
    } else {
      setEditingArticulo(null);
      setFormData({
        nombre: '',
        disponible: true
      });
    }
    setOpenDialog(true);
    setError('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingArticulo(null);
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
        disponible: formData.disponible
      };

      if (editingArticulo) {
        await api.put(`/articulos/${editingArticulo.id}`, payload);
      } else {
        await api.post('/articulos', payload);
      }

      await loadArticulos();
      handleCloseDialog();
    } catch (error) {
      console.error('Error al guardar artículo:', error);
      setError(error.response?.data || 'Error al guardar el artículo');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este artículo?')) {
      try {
        await api.delete(`/articulos/${id}`);
        await loadArticulos();
      } catch (error) {
        console.error('Error al eliminar artículo:', error);
        setError('Error al eliminar el artículo');
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Artículos
        </Typography>
        {isAdmin() && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Nuevo Artículo
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
              <TableCell><strong>Estado</strong></TableCell>
              {isAdmin() && <TableCell align="center"><strong>Acciones</strong></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {articulos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No hay artículos registrados
                </TableCell>
              </TableRow>
            ) : (
              articulos.map((articulo) => (
                <TableRow key={articulo.id} hover>
                  <TableCell>{articulo.id}</TableCell>
                  <TableCell>{articulo.nombre}</TableCell>
                  <TableCell>
                    <Chip
                      label={articulo.disponible ? 'Disponible' : 'No disponible'}
                      color={articulo.disponible ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  {isAdmin() && (
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(articulo)}
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(articulo.id)}
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
          {editingArticulo ? 'Editar Artículo' : 'Nuevo Artículo'}
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
            disabled={loading || !formData.nombre}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};