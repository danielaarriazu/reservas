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
  Chip,
  Snackbar
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
  const [dialogError, setDialogError] = useState(''); 
  const [snackbarError, setSnackbarError] = useState('');
  const [loading, setLoading] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState('activas'); // 'todas', 'activas', 'finalizadas'
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
      setSnackbarError('Error al cargar los datos');
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
    setDialogError('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingReserva(null);
    setDialogError(''); 
  };

  // 🔹 Manejo de cambio en fecha de inicio (auto-completar fecha fin)
  const handleFechaInicioChange = (e) => {
    const inicio = e.target.value;
    
    setFormData(prev => ({
      ...prev,
      fechaHoraInicio: inicio
    }));

    // Si hay fecha de inicio, calcular fecha fin (+2 horas)
    if (inicio) {
      const fechaInicio = new Date(inicio);
      fechaInicio.setHours(fechaInicio.getHours() + 2);

      // Formatear para datetime-local (YYYY-MM-DDTHH:mm)
      const year = fechaInicio.getFullYear();
      const month = String(fechaInicio.getMonth() + 1).padStart(2, '0');
      const day = String(fechaInicio.getDate()).padStart(2, '0');
      const hours = String(fechaInicio.getHours()).padStart(2, '0');
      const minutes = String(fechaInicio.getMinutes()).padStart(2, '0');
      
      const fechaFinFormatted = `${year}-${month}-${day}T${hours}:${minutes}`;
      
      setFormData(prev => ({
        ...prev,
        fechaHoraFin: fechaFinFormatted
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'sala' || name === 'articulo' || name === 'persona') {
      setFormData(prev => ({
        ...prev,
        [name]: { id: value }
      }));
    } else if (name === 'fechaHoraInicio') {
      handleFechaInicioChange(e);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // 🔹 Validar fechas antes de enviar
  const validateDates = () => {
    const inicio = new Date(formData.fechaHoraInicio);
    const fin = new Date(formData.fechaHoraFin);
    const ahora = new Date();

    // Validar que fecha inicio sea menor que fecha fin
    if (inicio >= fin) {
      setDialogError('La fecha de inicio debe ser anterior a la fecha de finalización');
      return false;
    }

    // Validar que no se creen reservas en el pasado (solo para nuevas reservas)
    if (!editingReserva && inicio < ahora) {
      setDialogError('No se pueden crear reservas con fechas pasadas');
      return false;
    }

    // Validar duración mínima (30 minutos)
    const diffMinutos = (fin - inicio) / (1000 * 60);
    if (diffMinutos < 30) {
      setDialogError('La reserva debe durar al menos 30 minutos');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setDialogError('');

    // 🔹 Validar fechas
    if (!validateDates()) {
      return;
    }

    setLoading(true);

    try {
      const payload = {
        sala: { id: parseInt(formData.sala.id) },
        articulo: { id: parseInt(formData.articulo.id) },
        fechaHoraInicio: formData.fechaHoraInicio,
        fechaHoraFin: formData.fechaHoraFin
      };

      // Si es admin y seleccionó un usuario, incluirlo en el payload
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
      const errorMessage = error.response?.data?.message || 
                        error.response?.data || 
                        'Error al guardar la reserva';
    setDialogError(errorMessage);
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
        setSnackbarError('Error al eliminar la reserva');
      }
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return '-';
    return new Date(dateTime).toLocaleString('es-AR');
  };

  // 🔹 Filtrar reservas según el estado seleccionado
  const reservasFiltradas = reservas.filter((reserva) => {
    const fechaFin = new Date(reserva.fechaHoraFin);
    const ahora = new Date();
    
    if (filtroEstado === 'todas') return true;
    if (filtroEstado === 'activas') return fechaFin > ahora;
    if (filtroEstado === 'finalizadas') return fechaFin <= ahora;
    
    return true;
  });

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

      {/* 🔹 Filtros (solo para admin) */}
      {isAdmin() && (
        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <Button
            variant={filtroEstado === 'activas' ? 'contained' : 'outlined'}
            onClick={() => setFiltroEstado('activas')}
          >
            Activas ({reservas.filter(r => new Date(r.fechaHoraFin) > new Date()).length})
          </Button>
          <Button
            variant={filtroEstado === 'finalizadas' ? 'contained' : 'outlined'}
            onClick={() => setFiltroEstado('finalizadas')}
          >
            Finalizadas ({reservas.filter(r => new Date(r.fechaHoraFin) <= new Date()).length})
          </Button>
          <Button
            variant={filtroEstado === 'todas' ? 'contained' : 'outlined'}
            onClick={() => setFiltroEstado('todas')}
          >
            Todas ({reservas.length})
          </Button>
        </Box>
      )}

      <Snackbar 
        open={!!snackbarError} 
        autoHideDuration={6000} 
        onClose={() => setSnackbarError('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setSnackbarError('')}>
          {snackbarError}
        </Alert>
      </Snackbar>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
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
            {reservasFiltradas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isAdmin() ? 8 : 7} align="center">
                  {filtroEstado === 'todas' 
                    ? 'No hay reservas registradas' 
                    : `No hay reservas ${filtroEstado === 'activas' ? 'activas' : 'finalizadas'}`
                  }
                </TableCell>
              </TableRow>
            ) : (
              reservasFiltradas.map((reserva) => (
                <TableRow key={reserva.id} hover>
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
          {dialogError && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setDialogError('')}>
              {dialogError}
            </Alert>
          )}

  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
    {/* ... resto del formulario sin cambios ... */}
  </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            {/* Campo Usuario (solo para Admin) */}
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
              inputProps={{
                min: formData.fechaHoraInicio // No permitir fecha fin menor a fecha inicio
              }}
              helperText="Debe ser posterior a la fecha de inicio"
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