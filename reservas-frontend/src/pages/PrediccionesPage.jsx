import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  Chip
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, Warning, CheckCircle } from '@mui/icons-material';
import { predictionService } from '../services/predictionService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const PrediccionesPage = () => {
  const [prediccionSalas, setPrediccionSalas] = useState([]);
  const [prediccionArticulos, setPrediccionArticulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPredicciones();
  }, []);

  const loadPredicciones = async () => {
    setLoading(true);
    setError('');
    
    try {
      const [salasRes, articulosRes] = await Promise.all([
        predictionService.getPrediccionSalas(),
        predictionService.getPrediccionArticulos()
      ]);

      setPrediccionSalas(salasRes.data);
      setPrediccionArticulos(articulosRes.data);
    } catch (error) {
      console.error('Error al cargar predicciones:', error);
      setError('Error al conectar con la API de predicciones. Verifica que esté corriendo en el puerto 8000.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Predicciones de Demanda
        </Typography>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
        <Alert severity="info" sx={{ mt: 2 }}>
          <strong>Para activar las predicciones:</strong>
          <ol style={{ marginTop: '10px', marginBottom: 0 }}>
            <li>Asegúrate que el backend Spring Boot esté corriendo (puerto 8080)</li>
            <li>Ve a la carpeta <code>prediccion_api</code></li>
            <li>Ejecuta: <code>uvicorn main:app --reload</code></li>
          </ol>
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        📊 Predicciones de Demanda
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Análisis predictivo basado en datos históricos de reservas
      </Typography>

      <Divider sx={{ my: 3 }} />

      {/* SECCIÓN 1: Predicción de Demanda por Salas */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <TrendingUp sx={{ mr: 1, color: '#1976d2' }} />
          <Typography variant="h5" fontWeight="bold">
            Demanda Predicha por Sala
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Tarjetas de resumen */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {prediccionSalas.slice(0, 4).map((sala, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card sx={{ 
                    background: `linear-gradient(135deg, ${COLORS[index % COLORS.length]}20 0%, ${COLORS[index % COLORS.length]}40 100%)`,
                    border: `2px solid ${COLORS[index % COLORS.length]}`
                  }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" noWrap>
                        {sala.salaNombre || `Sala ${sala.salaId}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Capacidad: {sala.salaCapacidad || 'N/A'}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="caption">Actual:</Typography>
                        <Typography variant="caption" fontWeight="bold">
                          {sala.cantidad_reservas} reservas
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption">Predicción:</Typography>
                        <Typography variant="caption" fontWeight="bold" color="primary">
                          {sala.prediccion_futura?.toFixed(1)} reservas
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="caption">Variación:</Typography>
                        <Chip 
                          label={`${sala['variacion_%'] > 0 ? '+' : ''}${sala['variacion_%']?.toFixed(1)}%`}
                          size="small"
                          color={sala['variacion_%'] > 0 ? 'success' : 'error'}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Gráfico de Barras - Comparación Actual vs Predicción */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Reservas Actuales vs Predicción
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={prediccionSalas}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="salaNombre" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cantidad_reservas" fill="#1976d2" name="Actual" />
                <Bar dataKey="prediccion_futura" fill="#82ca9d" name="Predicción" />
              </BarChart>
            </ResponsiveContainer>
          </Grid>

          {/* Gráfico de Líneas - Tendencia */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Tendencia de Demanda
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={prediccionSalas}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="salaNombre"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="cantidad_reservas" 
                  stroke="#1976d2" 
                  strokeWidth={2}
                  name="Actual"
                />
                <Line 
                  type="monotone" 
                  dataKey="prediccion_futura" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Predicción"
                />
              </LineChart>
            </ResponsiveContainer>
          </Grid>

          {/* Gráfico Circular - Distribución de uso */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Distribución de Reservas Actuales
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={prediccionSalas}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ salaNombre, cantidad_reservas }) => 
                    `${salaNombre}: ${cantidad_reservas}`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="cantidad_reservas"
                >
                  {prediccionSalas.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Grid>

          {/* Gráfico de Duración Promedio */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Duración Promedio por Sala (horas)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={prediccionSalas}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="salaNombre"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="duracion_promedio" fill="#FF8042" name="Duración Promedio (hrs)" />
              </BarChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>
      </Paper>

      {/* SECCIÓN 2: Predicción de Mantenimiento de Artículos */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Warning sx={{ mr: 1, color: '#ed6c02' }} />
          <Typography variant="h5" fontWeight="bold">
            Análisis de Mantenimiento de Artículos
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Tabla de artículos con riesgo */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Estado de Artículos por Uso
            </Typography>
            <Grid container spacing={2}>
              {prediccionArticulos.map((articulo, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card 
                    sx={{ 
                      borderLeft: `4px solid ${articulo.riesgo_mantenimiento === 'ALTO' ? '#f44336' : '#4caf50'}`,
                      position: 'relative'
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <Typography variant="h6" fontWeight="bold">
                          {articulo.articuloNombre || `Artículo ${articulo.articuloId}`}
                        </Typography>
                        {articulo.riesgo_mantenimiento === 'ALTO' ? (
                          <Warning color="error" />
                        ) : (
                          <CheckCircle color="success" />
                        )}
                      </Box>
                      
                      <Divider sx={{ my: 1.5 }} />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Veces usado:
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {articulo.veces_usado}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Duración promedio:
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {articulo.duracion_promedio?.toFixed(1)} hrs
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Estado:
                        </Typography>
                        <Chip
                          label={articulo.riesgo_mantenimiento}
                          color={articulo.riesgo_mantenimiento === 'ALTO' ? 'error' : 'success'}
                          size="small"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Gráfico de barras - Uso de artículos */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Frecuencia de Uso
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={prediccionArticulos}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="articuloNombre"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="veces_usado" 
                  fill="#ed6c02" 
                  name="Veces Usado"
                />
              </BarChart>
            </ResponsiveContainer>
          </Grid>

          {/* Gráfico circular - Distribución de riesgo */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Distribución de Riesgo de Mantenimiento
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { 
                      name: 'Alto Riesgo', 
                      value: prediccionArticulos.filter(a => a.riesgo_mantenimiento === 'ALTO').length 
                    },
                    { 
                      name: 'Normal', 
                      value: prediccionArticulos.filter(a => a.riesgo_mantenimiento === 'NORMAL').length 
                    }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#f44336" />
                  <Cell fill="#4caf50" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};