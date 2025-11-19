import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthFlow from './AuthFlow';

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { isAuthenticated, login } = useAuth();
  const [showAuthFlow, setShowAuthFlow] = useState(false);

  // Se não requer autenticação, renderiza o conteúdo diretamente
  if (!requireAuth) {
    return children;
  }

  // Se o usuário está autenticado, renderiza o conteúdo
  if (isAuthenticated()) {
    return children;
  }

  // Se não está autenticado, mostra o fluxo de autenticação
  const handleAuthSuccess = (userData) => {
    login(userData);
    setShowAuthFlow(false);
  };

  const handleCloseAuth = () => {
    setShowAuthFlow(false);
  };

  return (
    <div className="container mx-auto p-4 animate-fade-in-up">
      <div className="text-center py-12">
        <h2 className="text-3xl font-bold mb-6 text-gdf-gradient">Acesso Restrito</h2>
        <p className="text-gray-600 mb-8">
          Para fazer uma denúncia, você precisa estar logado no sistema.
        </p>
        <button
          onClick={() => setShowAuthFlow(true)}
          className="btn-gdf-primary hover-lift"
        >
          Fazer Login / Cadastro
        </button>
      </div>

      {showAuthFlow && (
        <AuthFlow
          onAuthSuccess={handleAuthSuccess}
          onClose={handleCloseAuth}
        />
      )}
    </div>
  );
};

export default ProtectedRoute;
