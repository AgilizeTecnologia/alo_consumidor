import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService'; // Import authService

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar se há um usuário logado no localStorage ao inicializar
  useEffect(() => {
    const initializeAuth = async () => {
      // Create test user first
      await authService.createTestUser();

      const savedUser = localStorage.getItem('consumer_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error('Erro ao carregar usuário do localStorage:', error);
          localStorage.removeItem('consumer_user');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Função para fazer login
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('consumer_user', JSON.stringify(userData));
  };

  // Função para fazer logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('consumer_user');
  };

  // Verificar se o usuário está autenticado
  const isAuthenticated = () => {
    return user !== null;
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;