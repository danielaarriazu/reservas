import api from './api';

export const reservaService = {
  // Obtener todas las reservas (del usuario logueado o todas si es admin)
  getAll: () => api.get('/reservas'),

  // Crear nueva reserva
  create: (reserva) => api.post('/reservas', reserva),

  // Actualizar reserva
  update: (id, reserva) => api.put(`/reservas/${id}`, reserva),

  // Eliminar reserva
  delete: (id) => api.delete(`/reservas/${id}`),

  // Obtener salas disponibles
  getSalas: () => api.get('/salas'),

  // Obtener artículos disponibles
  getArticulos: () => api.get('/articulos'),

  // Obtener datos para predicción
  getDatosPrediccion: () => api.get('/reservas/datos'),

  // Obtener predicciones de Python API
  getPrediccionSalas: () => 
    api.get(`${import.meta.env.VITE_PYTHON_API_URL}/prediccion/salas`),

  getPrediccionArticulos: () => 
    api.get(`${import.meta.env.VITE_PYTHON_API_URL}/prediccion/articulos`),
};