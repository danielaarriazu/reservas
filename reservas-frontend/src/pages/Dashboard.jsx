import { Box, Grid, Paper, Typography, Card, CardContent } from '@mui/material';
import { EventNote, MeetingRoom, Inventory, TrendingUp } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

export const Dashboard = () => {
  const { user, isAdmin } = useAuth();

  const stats = [
    { title: 'Mis Reservas', value: '5', icon: <EventNote fontSize="large" />, color: '#1976d2' },
    { title: 'Salas Disponibles', value: '8', icon: <MeetingRoom fontSize="large" />, color: '#2e7d32' },
    { title: 'Artículos', value: '12', icon: <Inventory fontSize="large" />, color: '#ed6c02' },
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