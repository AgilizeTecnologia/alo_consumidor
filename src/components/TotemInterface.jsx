import React, { useState, useEffect } from 'react';
import { Phone, Video, MessageCircle, User, Clock, Shield, AlertCircle, CheckCircle } from 'lucide-react';

function TotemInterface() {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [mediatorConnected, setMediatorConnected] = useState(false);
  const [connectionTime, setConnectionTime] = useState(0);
  const [userInfo, setUserInfo] = useState({
    name: '',
    cpf: '',
    phone: ''
  });

  // Simular conexão com mediador
  useEffect(() => {
    let interval;
    if (mediatorConnected) {
      interval = setInterval(() => {
        setConnectionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mediatorConnected]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartConnection = (type) => {
    setCurrentStep('connecting');
    // Simular tempo de conexão
    setTimeout(() => {
      setMediatorConnected(true);
      setCurrentStep('connected');
    }, 3000);
  };

  const handleEndConnection = () => {
    setMediatorConnected(false);
    setConnectionTime(0);
    setCurrentStep('feedback');
  };

  const renderWelcomeScreen = () => (
    <div className="text-center space-y-8 animate-fade-in-up">
      <div className="bg-gdf-gradient rounded-full w-32 h-32 mx-auto flex items-center justify-center">
        <Shield className="w-16 h-16 text-white" />
      </div>
      
      <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Totem de Atendimento
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Secretaria do Consumidor GDF
        </p>
        <p className="text-lg text-gray-500">
          Conecte-se com um mediador especializado para resolver seu problema
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <button
          onClick={() => handleStartConnection('video')}
          className="card-modern p-8 hover-lift text-center group"
        >
          <Video className="w-16 h-16 mx-auto mb-4 text-blue-600 group-hover:scale-110 transition-transform" />
          <h3 className="text-xl font-semibold mb-2">Videochamada</h3>
          <p className="text-gray-600">Atendimento por vídeo com mediador</p>
        </button>

        <button
          onClick={() => handleStartConnection('audio')}
          className="card-modern p-8 hover-lift text-center group"
        >
          <Phone className="w-16 h-16 mx-auto mb-4 text-green-600 group-hover:scale-110 transition-transform" />
          <h3 className="text-xl font-semibold mb-2">Chamada de Voz</h3>
          <p className="text-gray-600">Atendimento por áudio apenas</p>
        </button>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-2xl mx-auto">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
          <div className="text-left">
            <h4 className="font-semibold text-yellow-800 mb-2">Antes de começar:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Tenha em mãos documentos relacionados ao problema</li>
              <li>• Prepare fotos ou vídeos como evidência</li>
              <li>• Anote detalhes como datas, valores e nomes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConnectingScreen = () => (
    <div className="text-center space-y-8 animate-fade-in-up">
      <div className="relative">
        <div className="w-32 h-32 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
          <Phone className="w-16 h-16 text-blue-600 animate-pulse-custom" />
        </div>
        <div className="absolute inset-0 w-32 h-32 mx-auto border-4 border-blue-200 rounded-full animate-ping"></div>
      </div>
      
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Conectando com Mediador
        </h2>
        <p className="text-lg text-gray-600 mb-4">
          Aguarde enquanto conectamos você com um especialista...
        </p>
        <div className="flex justify-center">
          <div className="gdf-loader"></div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
        <p className="text-blue-800 text-sm">
          <strong>Tempo médio de espera:</strong> 2-3 minutos
        </p>
      </div>
    </div>
  );

  const renderConnectedScreen = () => (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header da chamada */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-green-800">Mediador Ana Silva</h3>
              <p className="text-sm text-green-600">Especialista em Direito do Consumidor</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 text-green-600">
              <Clock className="w-4 h-4" />
              <span className="font-mono">{formatTime(connectionTime)}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-green-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Conectado</span>
            </div>
          </div>
        </div>
      </div>

      {/* Área de vídeo simulada */}
      <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900 opacity-50"></div>
        <div className="relative z-10 text-center text-white">
          <Video className="w-16 h-16 mx-auto mb-4 opacity-75" />
          <p className="text-lg">Videochamada em Andamento</p>
          <p className="text-sm opacity-75">Mediador conectado via central de atendimento</p>
        </div>
        
        {/* Controles da chamada */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
          <button className="w-12 h-12 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors">
            <Phone className="w-6 h-6" />
          </button>
          <button className="w-12 h-12 bg-gray-600 hover:bg-gray-700 rounded-full flex items-center justify-center text-white transition-colors">
            <Video className="w-6 h-6" />
          </button>
          <button className="w-12 h-12 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white transition-colors">
            <MessageCircle className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Informações da sessão */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card-modern p-4">
          <h4 className="font-semibold text-gray-800 mb-2">Status da Sessão</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Protocolo:</span>
              <span className="font-mono">#TOT-2025-001</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tipo:</span>
              <span>Atendimento Presencial</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Local:</span>
              <span>Shopping Brasília</span>
            </div>
          </div>
        </div>

        <div className="card-modern p-4">
          <h4 className="font-semibold text-gray-800 mb-2">Próximos Passos</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Análise do problema</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-blue-500 rounded-full animate-pulse"></div>
              <span>Orientação legal</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
              <span>Encaminhamento</span>
            </div>
          </div>
        </div>
      </div>

      {/* Botão para encerrar */}
      <div className="text-center">
        <button
          onClick={handleEndConnection}
          className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          Encerrar Atendimento
        </button>
      </div>
    </div>
  );

  const renderFeedbackScreen = () => (
    <div className="text-center space-y-8 animate-fade-in-up">
      <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>
      
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Atendimento Concluído
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Obrigado por utilizar nosso serviço!
        </p>
      </div>

      <div className="card-modern p-6 max-w-md mx-auto">
        <h3 className="font-semibold text-gray-800 mb-4">Avalie seu atendimento</h3>
        <div className="flex justify-center space-x-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className="text-2xl text-yellow-400 hover:text-yellow-500 transition-colors"
            >
              ★
            </button>
          ))}
        </div>
        <textarea
          placeholder="Deixe seu comentário (opcional)"
          className="w-full p-3 border border-gray-300 rounded-lg resize-none"
          rows={3}
        />
        <button className="btn-gdf-primary w-full mt-4">
          Enviar Avaliação
        </button>
      </div>

      <button
        onClick={() => setCurrentStep('welcome')}
        className="btn-gdf-secondary"
      >
        Novo Atendimento
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header do Totem */}
        <div className="bg-white shadow-lg rounded-lg mb-6 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gdf-gradient rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Totem de Atendimento</h1>
                <p className="text-sm text-gray-600">Shopping Brasília - Asa Norte</p>
              </div>
            </div>
            <div className="text-right text-sm text-gray-500">
              <p>{new Date().toLocaleDateString('pt-BR')}</p>
              <p>{new Date().toLocaleTimeString('pt-BR')}</p>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="bg-white shadow-lg rounded-lg p-8 min-h-96">
          {currentStep === 'welcome' && renderWelcomeScreen()}
          {currentStep === 'connecting' && renderConnectingScreen()}
          {currentStep === 'connected' && renderConnectedScreen()}
          {currentStep === 'feedback' && renderFeedbackScreen()}
        </div>

        {/* Footer do Totem */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Em caso de emergência, ligue 190 (PM) ou 197 (Bombeiros)</p>
          <p>Suporte técnico: (61) 3000-0000</p>
        </div>
      </div>
    </div>
  );
}

export default TotemInterface;
