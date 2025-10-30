import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Decodificar token para obtener info del usuario
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          email: payload.sub,
          rol: payload.rol
        });
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const token = response.data;
      
      localStorage.setItem('token', token);
      
      // Decodificar token
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({
        email: payload.sub,
        rol: payload.rol
      });
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data || 'Error al iniciar sesión' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const isAdmin = () => user?.rol === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};