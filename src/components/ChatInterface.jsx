import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, X, User, Bot, Clock, AlertCircle, Phone, Mail, Loader2 } from 'lucide-react';
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
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatStep, setChatStep] = useState('initial'); // 'initial', 'collecting_info', 'queue', 'human_chat', 'timeout_options', 'finalized'
  const [queuePosition, setQueuePosition] = useState(0);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState(0);
  const [connectionTimeout, setConnectionTimeout] = useState(null);
  const [contactPreference, setContactPreference] = useState(null); // 'email' or 'phone'
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Initial user info for chatbot collection
  const [collectedInfo, setCollectedInfo] = useState({
    nome: user?.nome || '',
    telefone: user?.telefone || '',
    email: user?.email || '',
    resumo: complaintData?.description || ''
  });
  const [infoStep, setInfoStep] = useState(0); // 0: nome, 1: telefone, 2: email, 3: resumo

  const infoQuestions = [
    { field: 'nome', question: 'Para começarmos, qual é o seu nome completo?', icon: <User className="w-4 h-4" /> },
    { field: 'telefone', question: 'Qual o seu telefone para contato (com DDD)?', icon: <Phone className="w-4 h-4" /> },
    { field: 'email', question: 'E qual o seu melhor e-mail?', icon: <Mail className="w-4 h-4" /> },
    { field: 'resumo', question: 'Poderia me dar um breve resumo do seu problema em poucas palavras-chave?', icon: <AlertCircle className="w-4 h-4" /> },
  ];

  // Simulate chat conversation
  useEffect(() => {
    if (isOpen) {
      setMessages([]);
      setError(null);
      setChatStep('initial');
      setCollectedInfo({
        nome: user?.nome || '',
        telefone: user?.telefone || '',
        email: user?.email || '',
        resumo: complaintData?.description || ''
      });
      setInfoStep(0);
      setConnectionTimeout(null);

      // Start chatbot flow
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: 1,
          sender: 'bot',
          text: 'Olá! Sou o assistente virtual da Secretaria do Consumidor GDF. Para te conectar com um mediador humano, preciso de algumas informações.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setTimeout(() => {
          setChatStep('collecting_info');
          askNextInfoQuestion();
        }, 1500);
      }, 1000);
    } else {
      // Clear any active timeouts when modal closes
      if (connectionTimeout) {
        clearTimeout(connectionTimeout);
      }
    }
  }, [isOpen, user, complaintData]);

  const askNextInfoQuestion = () => {
    if (infoStep < infoQuestions.length) {
      const currentQuestion = infoQuestions[infoStep];
      // Only ask if the info is not already pre-filled
      if (!collectedInfo[currentQuestion.field]) {
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          sender: 'bot',
          text: currentQuestion.question,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        // If pre-filled, just move to next step
        setInfoStep(prev => prev + 1);
        setTimeout(askNextInfoQuestion, 500); // Small delay for natural flow
      }
    } else {
      // All info collected, proceed to queue
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          sender: 'bot',
          text: 'Ótimo! Todas as informações foram coletadas. Agora vou te colocar na fila para um mediador humano.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setChatStep('queue');
        startQueueSimulation();
      }, 1000);
    }
  };

  const handleChatbotInput = () => {
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

    setTimeout(() => {
      setIsTyping(false);
      const currentQuestion = infoQuestions[infoStep];
      if (currentQuestion) {
        setCollectedInfo(prev => ({
          ...prev,
          [currentQuestion.field]: newUserMessage.text
        }));
        setInfoStep(prev => prev + 1);
        askNextInfoQuestion();
      }
    }, 1000);
  };

  const startQueueSimulation = () => {
    setQueuePosition(Math.floor(Math.random() * 5) + 1); // Simulate 1-5 people in queue
    setEstimatedWaitTime(queuePosition * 60 + Math.floor(Math.random() * 30)); // 1-5 mins + 0-30 secs

    setMessages(prev => [...prev, {
      id: prev.length + 1,
      sender: 'bot',
      text: `Você está na posição ${queuePosition} na fila. Tempo de espera estimado: ${Math.ceil(estimatedWaitTime / 60)} minuto(s).`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);

    // Simulate human connection or timeout
    const timeoutDuration = 5 * 60 * 1000; // 5 minutes
    const connectionChance = Math.random(); // Simulate chance of connecting

    const timeoutId = setTimeout(() => {
      if (connectionChance > 0.3) { // 70% chance to connect to human
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          sender: 'mediator',
          text: 'Olá! Sou o mediador humano. Recebi suas informações e o resumo da sua denúncia. Como posso te ajudar a partir daqui?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setChatStep('human_chat');
      } else { // 30% chance to timeout
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          sender: 'bot',
          text: 'Não foi possível alocar um mediador no momento. Deseja que entremos em contato por e-mail ou telefone?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setChatStep('timeout_options');
      }
    }, timeoutDuration); // 5 minutes simulation

    setConnectionTimeout(timeoutId);
  };

  const handleHumanChatInput = () => {
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

  const handleTimeoutOption = async (option) => {
    setContactPreference(option);
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      sender: 'user',
      text: `Sim, desejo ser contatado por ${option === 'email' ? 'e-mail' : 'telefone'}.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    toast.info(`Seu pedido de contato por ${option === 'email' ? 'e-mail' : 'telefone'} foi registrado.`);
    await finalizeChat(true, option); // Finalize with contact preference
  };

  const handleRefuseTimeoutOption = async () => {
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      sender: 'user',
      text: 'Não, obrigado. Desejo finalizar o atendimento.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    await finalizeChat(false); // Finalize without contact preference
  };

  const finalizeChat = async (contactRequested = false, contactMethod = null) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Clear any active timeouts
      if (connectionTimeout) {
        clearTimeout(connectionTimeout);
        setConnectionTimeout(null);
      }

      // Prepare chat history for email
      const chatHistory = messages.map(msg => 
        `${msg.sender === 'user' ? 'Você' : (msg.sender === 'bot' ? 'Assistente Virtual' : 'Mediador')}: ${msg.text}`
      ).join('\n');

      const finalComplaintData = {
        ...complaintData,
        description: `Denúncia iniciada via chat. Resumo inicial: ${collectedInfo.resumo}. Histórico do chat:\n${chatHistory}`,
        contactInfo: collectedInfo,
        contactRequested: contactRequested,
        contactMethod: contactMethod
      };

      // Process complaint and generate protocol
      const result = await complaintService.processComplaint(finalComplaintData, aiAnalysis);
      
      // Send email notification
      await complaintService.sendEmailNotification(finalComplaintData, result.protocolNumber, aiAnalysis, chatHistory);
      
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        sender: 'bot',
        text: `Obrigado pelo seu contato! Seu protocolo é: ${result.protocolNumber}. Você receberá um e-mail com o resumo deste atendimento em breve.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setChatStep('finalized');
    } catch (error) {
      console.error('Error processing complaint:', error);
      setError('Ocorreu um erro ao processar seu atendimento. Por favor, tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinalizeAndExit = () => {
    if (chatStep !== 'finalized') {
      finalizeChat(); // Ensure finalization if not already done
    }
    onEndChat(); // Close the modal
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
                      ) : message.sender === 'bot' ? (
                        <Bot className="w-4 h-4 text-blue-600" />
                      ) : (
                        <User className="w-4 h-4 text-green-600" /> // Human mediator icon
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
                      <span className="text-xs font-medium">Assistente Virtual</span>
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

              {chatStep === 'queue' && (
                <div className="flex justify-center">
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-center">
                    <Loader2 className="w-6 h-6 mx-auto mb-2 text-blue-600 animate-spin" />
                    <p className="text-blue-800 font-semibold">Aguarde na fila...</p>
                    <p className="text-blue-700 text-sm">Posição: {queuePosition} | Tempo estimado: {Math.ceil(estimatedWaitTime / 60)} min</p>
                  </div>
                </div>
              )}

              {chatStep === 'timeout_options' && (
                <div className="flex justify-center">
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-center space-y-3">
                    <p className="text-yellow-800 font-semibold">Não foi possível alocar um mediador no momento.</p>
                    <p className="text-yellow-700">Deseja que entremos em contato por e-mail ou telefone?</p>
                    <div className="flex justify-center space-x-2">
                      <Button onClick={() => handleTimeoutOption('email')} className="bg-blue-600 hover:bg-blue-700">
                        <Mail className="w-4 h-4 mr-2" /> E-mail
                      </Button>
                      <Button onClick={() => handleTimeoutOption('phone')} className="bg-green-600 hover:bg-green-700">
                        <Phone className="w-4 h-4 mr-2" /> Telefone
                      </Button>
                      <Button onClick={handleRefuseTimeoutOption} variant="outline">
                        Não, obrigado
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <AlertCircle className="w-12 h-12 mx-auto mb-2 text-red-500" />
                <p className="text-red-700 mb-3">{error}</p>
                <Button onClick={() => setError(null)} className="bg-red-600 hover:bg-red-700">
                  Tentar Novamente
                </Button>
              </div>
            )}

            {/* Input Area */}
            {(chatStep === 'collecting_info' || chatStep === 'human_chat') && !error && (
              <div className="flex space-x-2">
                <Input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  onKeyPress={(e) => e.key === 'Enter' && (chatStep === 'collecting_info' ? handleChatbotInput() : handleHumanChatInput())}
                  className="flex-1"
                  disabled={isProcessing}
                />
                <Button 
                  onClick={chatStep === 'collecting_info' ? handleChatbotInput : handleHumanChatInput} 
                  disabled={!userInput.trim() || isProcessing}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Finalize Button */}
            {(chatStep === 'human_chat' || chatStep === 'timeout_options' || chatStep === 'finalized') && (
              <div className="text-center">
                <Button
                  onClick={handleFinalizeAndExit}
                  disabled={isProcessing}
                  className="bg-red-500 hover:bg-red-600 text-white w-full py-3 font-semibold transition-all hover:scale-105"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Finalizando...
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
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default ChatInterface;