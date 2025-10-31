import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Divider,
  Box,
  Toolbar
} from '@mui/material';
import { 
  EventNote, 
  MeetingRoom, 
  Inventory, 
  TrendingUp,
  People 
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const DRAWER_WIDTH = 240;

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAuth();

  const menuItems = [
    { text: 'Mis Reservas', icon: <EventNote />, path: '/reservas', roles: ['USUARIO', 'ADMIN'] },
    { text: 'Salas', icon: <MeetingRoom />, path: '/salas', roles: ['USUARIO', 'ADMIN'] },
    { text: 'Artículos', icon: <Inventory />, path: '/articulos', roles: ['USUARIO', 'ADMIN'] },
  ];

  const adminItems = [
    { text: 'Predicciones', icon: <TrendingUp />, path: '/predicciones', roles: ['ADMIN'] },
    { text: 'Usuarios', icon: <People />, path: '/usuarios', roles: ['ADMIN'] },
  ];

  const drawer = (
    <Box>
      <Toolbar /> {/* Espacio para el navbar */}
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {isAdmin() && (
          <>
            <Divider />
            <List>
              {adminItems.map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    selected={location.pathname === item.path}
                    onClick={() => navigate(item.path)}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      {drawer}
    </Drawer>
  );
};