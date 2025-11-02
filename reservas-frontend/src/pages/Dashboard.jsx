import { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, Card, CardContent } from '@mui/material';
import { EventNote, MeetingRoom, Inventory, TrendingUp } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

export const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [reservasCount, setReservasCount] = useState(0);
  const [salasCount, setSalasCount] = useState(0);
  const [articulosCount, setArticulosCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🔹 Llamadas simultáneas a los endpoints del backend
        const [reservasRes, salasRes, articulosRes] = await Promise.all([
          api.get('/reservas'),
          api.get('/salas'),
          api.get('/articulos'),
        ]);

        // ✅ Los controladores ya filtran según el rol, así que no hay que hacer lógica extra
        setReservasCount(reservasRes.data.length);
        setSalasCount(salasRes.data.length);
        setArticulosCount(articulosRes.data.length);
      } catch (error) {
        console.error('❌ Error al obtener datos del dashboard:', error);
      }
    };

    fetchData();
  }, []);

  const stats = [
    { title: 'Mis Reservas', value: reservasCount, icon: <EventNote fontSize="large" />, color: '#1976d2' },
    { title: 'Salas Disponibles', value: salasCount, icon: <MeetingRoom fontSize="large" />, color: '#2e7d32' },
    { title: 'Artículos', value: articulosCount, icon: <Inventory fontSize="large" />, color: '#ed6c02' },
  ];

  if (isAdmin()) {
    stats.push({ 
      title: 'Predicciones', 
      value: 'Ver', 
      icon: <TrendingUp fontSize="large" />, 
      color: '#9c27b0' 
    });
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Bienvenido, {user?.email.split('@')[0]}
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}dd 100%)`,
                color: 'white',
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {stat.title}
                    </Typography>
                  </Box>
                  {stat.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 3, mt: 4 }} elevation={2}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Acciones Rápidas
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Usa el menú lateral para navegar por las diferentes secciones del sistema.
        </Typography>
      </Paper>
    </Box>
  );
};