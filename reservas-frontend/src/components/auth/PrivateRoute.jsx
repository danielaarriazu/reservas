import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.rol !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
};