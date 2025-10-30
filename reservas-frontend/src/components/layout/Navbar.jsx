import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LogoutOutlined, DashboardOutlined } from '@mui/icons-material';

const DRAWER_WIDTH = 240;

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar 
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml: { sm: `${DRAWER_WIDTH}px` },
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <DashboardOutlined sx={{ mr: 2 }} />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Sistema de Reservas
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography variant="body2">
            {user?.email} {isAdmin() && '(Admin)'}
          </Typography>
          <Button color="inherit" onClick={handleLogout} startIcon={<LogoutOutlined />}>
            Salir
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};