import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, X, User, Bot, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent } from './ui/dialog';

const ChatInterface = ({ 
  isOpen, 
  onClose, 
  onEndChat 
}) => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [protocolNumber, setProtocolNumber] = useState('');
  const [showProtocol, setShowProtocol] = useState(false);

  // Generate a random protocol number
  const generateProtocol = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `DEN-${year}${month}${day}-${random}`;
  };

  // Simulate chat conversation
  useEffect(() => {
    if (isOpen) {
      setMessages([]);
      setProtocolNumber(generateProtocol());
      
      // Initial message from mediator
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: 1,
          sender: 'mediator',
          text: 'Olá! Sou seu mediador. Como posso ajudar você hoje?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 1000);
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    // Add user message
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
      
      // Determine response based on user input
      let response = '';
      if (userInput.toLowerCase().includes('produto') || userInput.toLowerCase().includes('defeito')) {
        response = 'Entendo. Pode me contar mais detalhes sobre o produto e o problema?';
      } else if (userInput.toLowerCase().includes('loja') || userInput.toLowerCase().includes('atendimento')) {
        response = 'Já tentou resolver diretamente com o estabelecimento?';
      } else {
        response = 'Vamos verificar as opções de solução para o seu caso. Posso te ajudar com isso.';
      }
      
      setMessages(prev => [...prev, {
        id: messages.length + 2,
        sender: 'mediator',
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 2000);
  };

  const handleEndChat = () => {
    // Add final message with protocol
    const finalMessage = {
      id: messages.length + 1,
      sender: 'mediator',
      text: `Obrigado pelo seu contato! Seu protocolo é: ${protocolNumber}. Você receberá um e-mail com o resumo deste atendimento em breve.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, finalMessage]);
    setShowProtocol(true);
  };

  const handleFinalize = () => {
    onEndChat();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <Card className="w-full border-none shadow-none">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Bot className="w-6 h-6 text-blue-600" />
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
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      {message.sender === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4 text-blue-600" />
                      )}
                      <span className="text-xs font-medium">
                        {message.sender === 'user' ? 'Você' : 'Mediador'}
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

            {/* Input Area */}
            {!showProtocol && (
              <div className="flex space-x-2">
                <Input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!userInput.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Protocol Display */}
            {showProtocol && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center animate-fade-in-up">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                <h3 className="text-lg font-semibold text-green-800 mb-2">Atendimento Finalizado!</h3>
                <p className="text-green-700 mb-4">
                  Seu protocolo é: <span className="font-bold text-lg">{protocolNumber}</span>
                </p>
                <p className="text-green-700 mb-6">
                  O resumo deste atendimento e o número do protocolo serão enviados para o seu e-mail em breve.
                </p>
                <Button
                  onClick={handleFinalize}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Finalizar Atendimento
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default ChatInterface;