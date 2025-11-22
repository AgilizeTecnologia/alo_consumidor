import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, X, User, Bot, Clock, AlertCircle, Phone, Mail, Loader2, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent } from './ui/dialog';
import { complaintService } from '../services/complaintService';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const ChatInterface = ({ 
  isOpen, 
  onClose, 
  onEndChat,
  complaintData,
  aiAnalysis 
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatStep, setChatStep] = useState('chat'); // 'chat' for immediate start
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [connectionTimeout, setConnectionTimeout] = useState(null);
  const [protocolNumber, setProtocolNumber] = useState('');
  const [isFinalizing, setIsFinalizing] = useState(false);

  // Start chat immediately when component opens
  useEffect(() => {
    if (isOpen && chatStep === 'chat') {
      startChatSimulation();
    }
  }, [isOpen, chatStep]);

  // Start chat simulation with pre-configured messages
  const startChatSimulation = () => {
    // Add initial bot message
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      sender: 'bot',
      text: 'Olá! Sou o assistente virtual da Patrulha do Consumidor. Estou aqui para ajudar você com sua denúncia. Como posso auxiliar você hoje?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);

    // Simulate connection to mediator after a delay
    const timeoutDuration = 3 * 1000; // 3 seconds
    const timeoutId = setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length + 2,
        sender: 'mediator',
        text: 'Olá! Sou o mediador humano. Recebi suas informações e posso te ajudar. Como posso auxiliar você hoje?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, timeoutDuration);

    setConnectionTimeout(timeoutId);
  };

  // Handle chat input
  const handleChatInput = () => {
    if (!userInput.trim()) return;

    const newUserMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: userInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsTyping(true);

    // Simulate mediator response
    setTimeout(() => {
      setIsTyping(false);
      let response = '';
      if (newUserMessage.text.toLowerCase().includes('produto') || newUserMessage.text.toLowerCase().includes('defeito')) {
        response = 'Entendi. Você tem a nota fiscal ou fotos do produto?';
      } else if (newUserMessage.text.toLowerCase().includes('loja') || newUserMessage.text.toLowerCase().includes('atendimento')) {
        response = 'Qual o nome do estabelecimento e a data da ocorrência?';
      } else {
        response = 'Certo. Vamos analisar as melhores opções para o seu caso.';
      }
      setMessages(prev => [...prev, {
        id: messages.length + 2,
        sender: 'mediator',
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 2000);
  };

  // Finalize chat and generate protocol
  const finalizeChat = async () => {
    setIsFinalizing(true);
    setError(null);

    try {
      // Clear any active timeouts
      if (connectionTimeout) {
        clearTimeout(connectionTimeout);
        setConnectionTimeout(null);
      }

      // Generate protocol
      const protocol = `AT-${Date.now()}`;
      setProtocolNumber(protocol);

      // Prepare chat history for email
      const chatHistory = messages.map(msg => 
        `${msg.sender === 'user' ? 'Você' : (msg.sender === 'bot' ? 'Assistente Virtual' : 'Mediador')}: ${msg.text}`
      ).join('\n');

      // Send email notification
      await complaintService.sendEmailNotification({
        email: user.email,
        protocolNumber: protocol,
        chatHistory: chatHistory
      });

      // Add final message to chat
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        sender: 'bot',
        text: `Atendimento concluído! Seu protocolo é: ${protocol}. Você receberá um e-mail com o resumo deste atendimento em breve.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

      setChatStep('finalized');
      
      // Auto-close after showing success message
      setTimeout(() => {
        logout();
        onClose();
      }, 3000);

    } catch (error) {
      console.error('Error finalizing chat:', error);
      setError('Ocorreu um erro ao finalizar seu atendimento. Por favor, tente novamente.');
    } finally {
      setIsFinalizing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <Card className="w-full border-none shadow-none">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Shield className="w-6 h-6 text-blue-600" />
                <CardTitle className="text-xl font-bold text-gdf-gradient">
                  Atendimento com Mediador
                </CardTitle>
              </div>
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

          <CardContent className="space-y-4">
            {/* Chat Messages */}
            {(chatStep === 'chat' || chatStep === 'finalized') && (
              <div className="h-96 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-lg">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : message.sender === 'bot'
                          ? 'bg-white border border-gray-200'
                          : 'bg-green-50 border border-green-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        {message.sender === 'user' ? (
                          <User className="w-4 h-4" />
                        ) : message.sender === 'bot' ? (
                          <Bot className="w-4 h-4 text-blue-600" />
                        ) : (
                          <User className="w-4 h-4 text-green-600" />
                        )}
                        <span className="text-xs font-medium">
                          {message.sender === 'user' ? 'Você' : (message.sender === 'bot' ? 'Assistente Virtual' : 'Mediador')}
                        </span>
                        <span className="text-xs opacity-70">{message.timestamp}</span>
                      </div>
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-medium">Mediador</span>
                        <span className="text-xs opacity-70">
                          <Clock className="w-3 h-3 inline animate-pulse" />
                        </span>
                      </div>
                      <div className="flex space-x-1 mt-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Input Area */}
            {chatStep === 'chat' && (
              <div className="flex space-x-2">
                <Input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  onKeyPress={(e) => e.key === 'Enter' && handleChatInput()}
                  className="flex-1"
                  disabled={isFinalizing}
                />
                <Button 
                  onClick={handleChatInput} 
                  disabled={!userInput.trim() || isFinalizing}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Finalization Button */}
            {chatStep === 'chat' && (
              <div className="text-center pt-4">
                <Button
                  onClick={finalizeChat}
                  disabled={isFinalizing}
                  className="bg-red-500 hover:bg-red-600 text-white w-full py-3 font-semibold"
                >
                  {isFinalizing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Finalizando Atendimento...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Finalizar Atendimento e Sair do Sistema
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Finalized Message */}
            {chatStep === 'finalized' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Atendimento Concluído</h3>
                <p className="text-gray-600 mb-4">
                  Seu protocolo é: <span className="font-bold">{protocolNumber}</span>
                </p>
                <p className="text-green-600">
                  Atendimento concluído. Seu protocolo foi enviado para o seu e-mail.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default ChatInterface;