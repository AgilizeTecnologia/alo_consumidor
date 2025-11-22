import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from './ui/dialog';
import ChatInterface from './ChatInterface';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

function AtendimentoOnline() {
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const handleIniciarChat = () => {
    if (!isAuthenticated()) {
      // User is not logged in, redirect to login
      toast.info('Redirecionando para login...');
      // The AuthFlow modal will be handled by the ProtectedRoute
      return;
    }
    // User is logged in, open chat immediately
    setChatModalOpen(true);
  };

  const handleIniciarVideochamada = () => {
    if (!isAuthenticated()) {
      toast.error('Você precisa estar logado para iniciar a videochamada.');
      return;
    }
    setVideoModalOpen(true);
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Atendimento Online</h2>
      <p className="mb-4">Conecte-se com um mediador para obter ajuda em tempo real.</p>
      
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleIniciarChat}>
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Iniciar via chat</h3>
            <p className="text-gray-600 text-sm">Atendimento por texto com mediador</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleIniciarVideochamada}>
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Iniciar video-chamadada</h3>
            <p className="text-gray-600 text-sm">Atendimento por vídeo com mediador</p>
          </CardContent>
        </Card>
      </div>

      <p className="mt-4 text-sm text-gray-600">
        O totem de teleatendimento também oferecerá estas opções.
      </p>

      {/* Chat Modal */}
      <Dialog open={chatModalOpen} onOpenChange={setChatModalOpen}>
        <DialogContent className="max-w-3xl">
          <ChatInterface
            isOpen={chatModalOpen}
            onClose={() => setChatModalOpen(false)}
            complaintData={null}
            aiAnalysis={null}
          />
        </DialogContent>
      </Dialog>

      {/* Video Call Modal - Placeholder for now */}
      <Dialog open={videoModalOpen} onOpenChange={setVideoModalOpen}>
        <DialogContent className="max-w-2xl">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Videochamada em Desenvolvimento</h3>
            <p className="text-gray-600 mb-4">
              A funcionalidade de videochamada está em desenvolvimento e será lançada em breve.
            </p>
            <Button onClick={() => setVideoModalOpen(false)}>Fechar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AtendimentoOnline;