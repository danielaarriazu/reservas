import axios from 'axios';

const PYTHON_API_URL = import.meta.env.VITE_PYTHON_API_URL || 'http://localhost:8000';

const pythonApi = axios.create({
  baseURL: PYTHON_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const predictionService = {
  // Predicción de demanda por salas
  getPrediccionSalas: () => pythonApi.get('/prediccion/salas'),

  // Predicción de mantenimiento de artículos
  getPrediccionArticulos: () => pythonApi.get('/prediccion/articulos'),
};