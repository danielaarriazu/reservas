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
  MenuItem,
  Alert,
  Chip
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { reservaService } from '../services/reservaService';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

export const ReservasPage = () => {
  const [reservas, setReservas] = useState([]);
  const [salas, setSalas] = useState([]);
  const [articulos, setArticulos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingReserva, setEditingReserva] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { isAdmin } = useAuth();

  const [formData, setFormData] = useState({
    persona: { id: '' },
    sala: { id: '' },
    articulo: { id: '' },
    fechaHoraInicio: '',
    fechaHoraFin: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [reservasRes, salasRes, articulosRes] = await Promise.all([
        reservaService.getAll(),
        api.get('/salas'),
        api.get('/articulos')
      ]);
      setReservas(reservasRes.data);
      
      // ✅ FILTRAR: Solo mostrar salas y artículos disponibles en el formulario
      setSalas(salasRes.data.filter(s => s.disponible));
      setArticulos(articulosRes.data.filter(a => a.disponible));

      // 🔹 Si es admin, cargar usuarios
      if (isAdmin()) {
        const usuariosRes = await api.get('/personas');
        setUsuarios(usuariosRes.data);
      }
    } catch (error) {
      setError('Error al cargar los datos');
      console.error(error);
    }
  };

  const handleOpenDialog = (reserva = null) => {
    if (reserva) {
      setEditingReserva(reserva);
      setFormData({
        persona: { id: reserva.persona?.id || '' },
        sala: { id: reserva.sala?.id || '' },
        articulo: { id: reserva.articulo?.id || '' },
        fechaHoraInicio: reserva.fechaHoraInicio?.slice(0, 16) || '',
        fechaHoraFin: reserva.fechaHoraFin?.slice(0, 16) || ''
      });
    } else {
      setEditingReserva(null);
      setFormData({
        persona: { id: '' },
        sala: { id: '' },
        articulo: { id: '' },
        fechaHoraInicio: '',
        fechaHoraFin: ''
      });
    }
    setOpenDialog(true);
    setError('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingReserva(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'sala' || name === 'articulo' || name === 'persona') {
      setFormData(prev => ({
        ...prev,
        [name]: { id: value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const payload = {
        sala: { id: parseInt(formData.sala.id) },
        articulo: { id: parseInt(formData.articulo.id) },
        fechaHoraInicio: formData.fechaHoraInicio,
        fechaHoraFin: formData.fechaHoraFin
      };

      // 🔹 NUEVO: Si es admin y seleccionó un usuario, incluirlo en el payload
      if (isAdmin() && formData.persona.id) {
        payload.persona = { id: parseInt(formData.persona.id) };
      }

      if (editingReserva) {
        await reservaService.update(editingReserva.id, payload);
      } else {
        await reservaService.create(payload);
      }

      await loadData();
      handleCloseDialog();
    } catch (error) {
      setError(error.response?.data || 'Error al guardar la reserva');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta reserva?')) {
      try {
        await reservaService.delete(id);
        await loadData();
      } catch (error) {
        setError('Error al eliminar la reserva');
      }
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return '-';
    return new Date(dateTime).toLocaleString('es-AR');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          {isAdmin() ? 'Gestión de Reservas' : 'Mis Reservas'}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Nueva Reserva
        </Button>
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
              {isAdmin() && <TableCell><strong>Usuario</strong></TableCell>}
              <TableCell><strong>Sala</strong></TableCell>
              <TableCell><strong>Artículo</strong></TableCell>
              <TableCell><strong>Fecha Inicio</strong></TableCell>
              <TableCell><strong>Fecha Fin</strong></TableCell>
              <TableCell><strong>Estado</strong></TableCell>
              <TableCell align="center"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isAdmin() ? 8 : 7} align="center">
                  No hay reservas registradas
                </TableCell>
              </TableRow>
            ) : (
              reservas.map((reserva) => (
                <TableRow key={reserva.id} hover>
                  <TableCell>{reserva.id}</TableCell>
                  {isAdmin() && (
                    <TableCell>{reserva.persona?.nombre || reserva.persona?.email || '-'}</TableCell>
                  )}
                  <TableCell>{reserva.sala?.nombre || '-'}</TableCell>
                  <TableCell>{reserva.articulo?.nombre || '-'}</TableCell>
                  <TableCell>{formatDateTime(reserva.fechaHoraInicio)}</TableCell>
                  <TableCell>{formatDateTime(reserva.fechaHoraFin)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={new Date(reserva.fechaHoraFin) > new Date() ? 'Activa' : 'Finalizada'}
                      color={new Date(reserva.fechaHoraFin) > new Date() ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(reserva)}
                      size="small"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(reserva.id)}
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog para crear/editar */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingReserva ? 'Editar Reserva' : 'Nueva Reserva'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            {/* 🔹 NUEVO: Campo Usuario (solo para Admin) */}
            {isAdmin() && (
              <TextField
                select
                label="Usuario (opcional - si no seleccionas, se asigna a ti)"
                name="persona"
                value={formData.persona.id}
                onChange={handleChange}
                fullWidth
                helperText="Si no seleccionas usuario, la reserva se asignará a tu cuenta"
              >
                <MenuItem value="">-- Yo (Admin) --</MenuItem>
                {usuarios.map((usuario) => (
                  <MenuItem key={usuario.id} value={usuario.id}>
                    {usuario.nombre} ({usuario.email})
                  </MenuItem>
                ))}
              </TextField>
            )}

            <TextField
              select
              label="Sala"
              name="sala"
              value={formData.sala.id}
              onChange={handleChange}
              required
              fullWidth
            >
              <MenuItem value="">Seleccione una sala</MenuItem>
              {salas.map((sala) => (
                <MenuItem key={sala.id} value={sala.id}>
                  {sala.nombre} (Capacidad: {sala.capacidad})
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Artículo"
              name="articulo"
              value={formData.articulo.id}
              onChange={handleChange}
              required
              fullWidth
            >
              <MenuItem value="">Seleccione un artículo</MenuItem>
              {articulos.map((articulo) => (
                <MenuItem key={articulo.id} value={articulo.id}>
                  {articulo.nombre}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Fecha y Hora de Inicio"
              name="fechaHoraInicio"
              type="datetime-local"
              value={formData.fechaHoraInicio}
              onChange={handleChange}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Fecha y Hora de Fin"
              name="fechaHoraFin"
              type="datetime-local"
              value={formData.fechaHoraFin}
              onChange={handleChange}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || !formData.sala.id || !formData.articulo.id}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};