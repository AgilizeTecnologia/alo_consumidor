import React from 'react';
import { Button } from '@/components/ui/button';

function AtendimentoOnline() {
  const handleIniciarChat = () => {
    alert('Iniciando chat com mediador... (Funcionalidade real será implementada no backend)');
    // Lógica para iniciar chat
  };

  const handleIniciarVideochamada = () => {
    alert('Iniciando videochamada com mediador... (Funcionalidade real será implementada no backend)');
    // Lógica para iniciar videochamada
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Atendimento Online</h2>
      <p className="mb-4">Conecte-se com um mediador para obter ajuda em tempo real.</p>
      <div className="flex space-x-4">
        <Button onClick={handleIniciarChat}>Iniciar Chat</Button>
        <Button onClick={handleIniciarVideochamada}>Iniciar Videochamada</Button>
      </div>
      <p className="mt-4 text-sm text-gray-600">O totem de teleatendimento também oferecerá estas opções.</p>
    </div>
  );
}

export default AtendimentoOnline;

