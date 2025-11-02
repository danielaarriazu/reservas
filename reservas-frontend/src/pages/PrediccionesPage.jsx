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
  Chip,
  Button
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
import { TrendingUp, Warning, CheckCircle, Refresh } from '@mui/icons-material';
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const PrediccionesPage = () => {
  const [prediccionSalas, setPrediccionSalas] = useState([]);
  const [prediccionArticulos, setPrediccionArticulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState(''); // Para mostrar info de debug

  useEffect(() => {
    loadPredicciones();
  }, []);

  const loadPredicciones = async () => {
    setLoading(true);
    setError('');
    setDebugInfo('');
    
    try {
      console.log('🔍 Intentando conectar con API Python...');
      
      // URLs de las APIs
      const PYTHON_API_URL = import.meta.env.VITE_PYTHON_API_URL || 'http://localhost:8000';
      const urlSalas = `${PYTHON_API_URL}/prediccion/salas`;
      const urlArticulos = `${PYTHON_API_URL}/prediccion/articulos`;

      console.log('📡 URL Salas:', urlSalas);
      console.log('📡 URL Artículos:', urlArticulos);

      // Intentar cargar ambas predicciones
      const [salasRes, articulosRes] = await Promise.all([
        axios.get(urlSalas, { timeout: 10000 }),
        axios.get(urlArticulos, { timeout: 10000 })
      ]);

      console.log('✅ Respuesta Salas:', salasRes.data);
      console.log('✅ Respuesta Artículos:', articulosRes.data);

      // Validar que las respuestas tengan datos
      if (!salasRes.data || salasRes.data.length === 0) {
        throw new Error('La API de predicción de salas no devolvió datos');
      }

      if (!articulosRes.data || articulosRes.data.length === 0) {
        throw new Error('La API de predicción de artículos no devolvió datos');
      }

      setPrediccionSalas(salasRes.data);
      setPrediccionArticulos(articulosRes.data);
      setDebugInfo(`✅ Datos cargados: ${salasRes.data.length} salas, ${articulosRes.data.length} artículos`);

    } catch (error) {
      console.error('❌ Error completo:', error);
      
      let errorMsg = 'Error desconocido';
      let debugMsg = '';

      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        errorMsg = 'No se puede conectar con la API de Python en el puerto 8000';
        debugMsg = `
          La API de Python no está respondiendo. Verifica:
          1. ¿Está corriendo? Ejecuta: cd prediccion_api && uvicorn main:app --reload
          2. ¿Está en el puerto 8000? Revisa la terminal
          3. URL intentada: ${import.meta.env.VITE_PYTHON_API_URL || 'http://localhost:8000'}
        `;
      } else if (error.response) {
        errorMsg = `Error HTTP ${error.response.status}: ${error.response.statusText}`;
        debugMsg = `Respuesta del servidor: ${JSON.stringify(error.response.data)}`;
      } else if (error.request) {
        errorMsg = 'La solicitud fue enviada pero no hubo respuesta del servidor';
        debugMsg = 'Verifica que la API Python esté corriendo y accesible';
      } else {
        errorMsg = error.message;
        debugMsg = error.stack;
      }

      setError(errorMsg);
      setDebugInfo(debugMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '400px', gap: 2 }}>
        <CircularProgress size={60} />
        <Typography variant="h6">Cargando predicciones...</Typography>
        <Typography variant="body2" color="text.secondary">
          Conectando con API Python en puerto 8000
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          📊 Predicciones de Demanda
        </Typography>
        
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          <strong>Error de Conexión:</strong> {error}
        </Alert>

        {debugInfo && (
          <Alert severity="info" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
            <strong>Información de depuración:</strong>
            {debugInfo}
          </Alert>
        )}

        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            🔧 Pasos para activar las predicciones:
          </Typography>
          <Box component="ol" sx={{ pl: 2 }}>
            <li>
              <Typography variant="body1" gutterBottom>
                <strong>Asegúrate que el backend Spring Boot esté corriendo</strong> (puerto 8080)
              </Typography>
              <code style={{ background: '#f5f5f5', padding: '4px 8px', borderRadius: '4px' }}>
                cd reservas && ./mvnw spring-boot:run
              </code>
            </li>
            <li>
              <Typography variant="body1" gutterBottom sx={{ mt: 2 }}>
                <strong>Ve a la carpeta de la API Python</strong>
              </Typography>
              <code style={{ background: '#f5f5f5', padding: '4px 8px', borderRadius: '4px' }}>
                cd prediccion_api
              </code>
            </li>
            <li>
              <Typography variant="body1" gutterBottom sx={{ mt: 2 }}>
                <strong>Instala las dependencias (si no lo hiciste)</strong>
              </Typography>
              <code style={{ background: '#f5f5f5', padding: '4px 8px', borderRadius: '4px' }}>
                pip install -r requirements.txt
              </code>
            </li>
            <li>
              <Typography variant="body1" gutterBottom sx={{ mt: 2 }}>
                <strong>Ejecuta la API Python</strong>
              </Typography>
              <code style={{ background: '#f5f5f5', padding: '4px 8px', borderRadius: '4px' }}>
                uvicorn main:app --reload --host 0.0.0.0 --port 8000
              </code>
            </li>
            <li>
              <Typography variant="body1" gutterBottom sx={{ mt: 2 }}>
                <strong>Verifica que la API responde</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Abre en tu navegador: <a href="http://localhost:8000/docs" target="_blank" rel="noopener">http://localhost:8000/docs</a>
              </Typography>
            </li>
          </Box>
        </Paper>

        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={loadPredicciones}
          size="large"
        >
          Reintentar Conexión
        </Button>
      </Box>
    );
  }

  // Si no hay datos
  if (prediccionSalas.length === 0 && prediccionArticulos.length === 0) {
    return (
      <Box>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          📊 Predicciones de Demanda
        </Typography>
        <Alert severity="warning" sx={{ mt: 2 }}>
          No hay datos suficientes para generar predicciones. 
          Asegúrate de tener reservas registradas en el sistema.
        </Alert>
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={loadPredicciones}
          sx={{ mt: 2 }}
        >
          Recargar
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          📊 Predicciones de Demanda
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={loadPredicciones}
        >
          Actualizar
        </Button>
      </Box>
      
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Análisis predictivo basado en datos históricos de reservas
      </Typography>

      {debugInfo && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {debugInfo}
        </Alert>
      )}

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

          {/* Gráfico de Barras */}
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

          {/* Gráfico de Líneas */}
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

          {/* Gráfico Circular */}
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

          {/* Duración Promedio */}
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

      {/* SECCIÓN 2: Predicción de Artículos */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Warning sx={{ mr: 1, color: '#ed6c02' }} />
          <Typography variant="h5" fontWeight="bold">
            Análisis de Mantenimiento de Artículos
          </Typography>
        </Box>

        <Grid container spacing={3}>
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

          {/* Gráfico de Uso */}
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

          {/* Distribución de Riesgo */}
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