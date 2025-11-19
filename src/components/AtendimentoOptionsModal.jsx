import React, { useState } from 'react';
import { Phone, MessageCircle, Video, X, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent } from './ui/dialog';

const AtendimentoOptionsModal = ({ 
  isOpen, 
  onClose, 
  onAtendimentoSelect 
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleAtendimentoSelect = (type) => {
    setSelectedOption(type);
    setIsConnecting(true);
    
    // Simulate connection time
    setTimeout(() => {
      setIsConnecting(false);
      onAtendimentoSelect(type);
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <Card className="w-full border-none shadow-none">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-between items-center">
              <div></div>
              <CardTitle className="text-xl font-bold text-gdf-gradient">
                Escolha o Tipo de Atendimento
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-1 h-auto"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {isConnecting ? (
              <div className="text-center py-8">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-ping"></div>
                  <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Conectando com Mediador...</h3>
                <p className="text-gray-600">
                  Aguarde enquanto conectamos você com um especialista.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-center text-gray-700">
                  Como você prefere ser atendido pelo mediador?
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleAtendimentoSelect('chat')}
                    disabled={isConnecting}
                    className="flex flex-col items-center space-y-2 h-auto py-6"
                  >
                    <MessageCircle className="w-8 h-8 text-blue-600" />
                    <span>Chat</span>
                  </Button>
                  
                  <Button
                    onClick={() => handleAtendimentoSelect('video')}
                    disabled={isConnecting}
                    className="flex flex-col items-center space-y-2 h-auto py-6"
                  >
                    <Video className="w-8 h-8 text-green-600" />
                    <span>Vídeo</span>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default AtendimentoOptionsModal;