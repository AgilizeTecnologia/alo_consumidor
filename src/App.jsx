import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Shield, Phone, FileText, Home as HomeIcon, List, User, LogOut } from 'lucide-react';
import './App.css';
import './gdf-styles.css';

// Contextos
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Componentes
import FormularioDenuncia from './components/FormularioDenuncia';
import AtendimentoOnline from './components/AtendimentoOnline';
import CDCViewer from './components/CDCViewer';
import MinhasDenunciasList from './components/MinhasDenunciasList';
import TotemInterface from './components/TotemInterface';
import ProtectedRoute from './components/ProtectedRoute';
import AuthFlow from './components/AuthFlow';

// Componente de elementos flutuantes
const FloatingElements = () => (
  <>
    <div className="floating-element"></div>
    <div className="floating-element"></div>
    <div className="floating-element"></div>
  </>
);

// Componente Home atualizado
const Home = () => {
  const { isAuthenticated } = useAuth();
  const [showAuthFlow, setShowAuthFlow] = useState(false);
  const navigate = useNavigate();

  const handleDenunciaClick = (e) => {
    if (!isAuthenticated()) {
      e.preventDefault();
      setShowAuthFlow(true);
    }
  };

  const handleAuthSuccess = (userData) => {
    setShowAuthFlow(false);
    // Redirecionar para a página de denúncias após o login
    navigate('/denuncias');
  };

  return (
    <div className="relative min-h-screen">
      <FloatingElements />
      
      {/* Hero Section */}
      <section className="relative bg-gdf-gradient text-white py-20 px-4 overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up">
            Defesa do Consumidor
          </h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in-up opacity-90" style={{animationDelay: '0.2s'}}>
            Protegendo seus direitos em Brasília
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <Link 
              to="/denuncias" 
              className="btn-gdf-secondary hover-lift"
              onClick={handleDenunciaClick}
            >
              Fazer Denúncia
            </Link>
            <Link to="/atendimento" className="btn-gdf-primary hover-lift">
              Atendimento Online
            </Link>
            <Link to="/totem" className="btn-gdf-secondary hover-lift">
              Totem de Atendimento
            </Link>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-float"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white opacity-5 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
      </section>

      {/* Auth Flow Modal */}
      {showAuthFlow && (
        <AuthFlow
          onAuthSuccess={handleAuthSuccess}
          onClose={() => setShowAuthFlow(false)}
        />
      )}

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gdf-gradient">
            Como Podemos Ajudar
          </h2>
          <div className="grid md:grid-cols-3 gap-8 stagger-animation">
            <div className="card-modern p-8 text-center hover-lift">
              <Shield className="w-16 h-16 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-4">Denúncias Online</h3>
              <p className="text-gray-600">
                Registre suas denúncias com fotos e vídeos. Nossa IA analisa automaticamente com base no CDC.
              </p>
            </div>
            <div className="card-modern p-8 text-center hover-lift">
              <Phone className="w-16 h-16 mx-auto mb-4 text-yellow-600" />
              <h3 className="text-xl font-semibold mb-4">Atendimento 24/7</h3>
              <p className="text-gray-600">
                Mediadores especializados disponíveis para orientação e resolução de conflitos.
              </p>
            </div>
            <div className="card-modern p-8 text-center hover-lift">
              <FileText className="w-16 h-16 mx-auto mb-4 text-orange-600" />
              <h3 className="text-xl font-semibold mb-4">CDC Interativo</h3>
              <p className="text-gray-600">
                Consulte o Código de Defesa do Consumidor com busca inteligente e orientações práticas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gdf-gradient-subtle text-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="animate-bounce-custom">
              <div className="text-4xl font-bold mb-2">1.2K+</div>
              <div className="text-lg opacity-90">Denúncias Resolvidas</div>
            </div>
            <div className="animate-bounce-custom" style={{animationDelay: '0.5s'}}>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-lg opacity-90">Atendimento</div>
            </div>
            <div className="animate-bounce-custom" style={{animationDelay: '1s'}}>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-lg opacity-90">Satisfação</div>
            </div>
            <div className="animate-bounce-custom" style={{animationDelay: '1.5s'}}>
              <div className="text-4xl font-bold mb-2">48h</div>
              <div className="text-lg opacity-90">Tempo Médio</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Componente de navegação móvel
const MobileNav = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Início', icon: HomeIcon },
    { path: '/denuncias', label: 'Denúncias', icon: Shield },
    { path: '/atendimento', label: 'Atendimento', icon: Phone },
    { path: '/cdc', label: 'CDC', icon: FileText },
    { path: '/minhas-denuncias', label: 'Minhas Denúncias', icon: List },
  ];

  return (
    <div className={`fixed inset-0 z-50 lg:hidden ${isOpen ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsOpen(false)}></div>
      <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform">
        <div className="p-4 border-b">
          <button onClick={() => setIsOpen(false)} className="float-right">
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-semibold">Menu</h2>
        </div>
        <nav className="p-4">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center space-x-3 p-3 rounded-lg mb-2 transition-colors ${
                location.pathname === path
                  ? 'bg-blue-100 text-blue-600'
                  : 'hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

// Componente de Header com informações do usuário
const Header = ({ mobileNavOpen, setMobileNavOpen }) => {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <header className="bg-white shadow-lg border-b-4 border-blue-600 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gdf-gradient rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Consumidor GDF
              </h1>
              <p className="text-sm text-gray-600">Secretaria do Consumidor</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Início
              </Link>
              <Link to="/denuncias" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Denúncias
              </Link>
              <Link to="/atendimento" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Atendimento
              </Link>
              <Link to="/cdc" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                CDC
              </Link>
              <Link to="/minhas-denuncias" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Minhas Denúncias
              </Link>
            </nav>

            {/* User Info */}
            {isAuthenticated() && (
              <div className="hidden lg:flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{user?.nome}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

// Componente principal
function AppContent() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header mobileNavOpen={mobileNavOpen} setMobileNavOpen={setMobileNavOpen} />

      {/* Mobile Navigation */}
      <MobileNav isOpen={mobileNavOpen} setIsOpen={setMobileNavOpen} />

      {/* Main Content */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/denuncias" element={
            <ProtectedRoute requireAuth={true}>
              <div className="container mx-auto p-4 animate-fade-in-up">
                <h2 className="text-3xl font-bold mb-6 text-gdf-gradient">Registrar Denúncia</h2>
                <FormularioDenuncia />
              </div>
            </ProtectedRoute>
          } />
          <Route path="/atendimento" element={
            <div className="container mx-auto p-4 animate-fade-in-up">
              <h2 className="text-3xl font-bold mb-6 text-gdf-gradient">Atendimento Online</h2>
              <AtendimentoOnline />
            </div>
          } />
          <Route path="/cdc" element={<CDCViewer />} />
          <Route path="/minhas-denuncias" element={
            <ProtectedRoute requireAuth={true}>
              <div className="container mx-auto p-4 animate-fade-in-up">
                <h2 className="text-3xl font-bold mb-6 text-gdf-gradient">Minhas Denúncias</h2>
                <MinhasDenunciasList />
              </div>
            </ProtectedRoute>
          } />
          <Route path="/totem" element={<TotemInterface />} />
        </Routes>
      </main>

      {/* Footer moderno */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Consumidor GDF</h3>
              <p className="text-gray-400">
                Protegendo os direitos dos consumidores no Distrito Federal com tecnologia e eficiência.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contato</h3>
              <p className="text-gray-400">Telefone: (61) 3000-0000</p>
              <p className="text-gray-400">Email: consumidor@df.gov.br</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Horário</h3>
              <p className="text-gray-400">Segunda a Sexta: 8h às 18h</p>
              <p className="text-gray-400">Atendimento Online: 24/7</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Secretaria do Consumidor GDF. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Componente App principal com AuthProvider
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;