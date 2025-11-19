import React, { useState, useEffect } from 'react';
import { Brain, CheckCircle, Phone, X, Loader2, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent } from './ui/dialog';
import ChatInterface from './ChatInterface'; // Import the chat interface
import { complaintService } from '../services/complaintService';

const AIAnalysisModal = ({ 
  isOpen, 
  onClose, 
  complaintData, 
  onFinalizeComplaint 
}) => {
  const [analysisStep, setAnalysisStep] = useState('initial'); // 'initial', 'analyzing', 'results'
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [error, setError] = useState(null);

  // Simulate AI analysis with 10 seconds
  const simulateAnalysis = async (description) => {
    setAnalysisStep('analyzing');
    setProgress(0);
    setError(null);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 500);

      // Simulate AI processing time (10 seconds as requested)
      await new Promise(resolve => setTimeout(resolve, 10000));

      clearInterval(progressInterval);

      // Generate analysis based on description
      if (description.toLowerCase().includes('produto com defeito')) {
        return {
          cdc_article: 'Art. 18 - Vício do Produto ou Serviço',
          mediation_guidance: 'O fornecedor tem 30 dias para sanar o vício. Caso contrário, o consumidor pode exigir a substituição do produto, a restituição imediata da quantia paga ou o abatimento proporcional do preço.',
          executive_summary: 'Denúncia classificada como "Vício do Produto" com alta probabilidade de resolução via mediação.',
          next_step_suggestion: 'Recomendamos iniciar o processo de mediação para buscar a substituição do produto ou restituição do valor.'
        };
      } else if (description.toLowerCase().includes('atendimento ruim')) {
        return {
          cdc_article: 'Art. 6º, III e IV - Direitos Básicos do Consumidor',
          mediation_guidance: 'O consumidor tem direito à informação clara e adequada e à proteção contra práticas abusivas. Recomenda-se registrar a ocorrência e buscar a mediação para uma solução amigável.',
          executive_summary: 'Denúncia de "Má Qualidade no Atendimento" com foco em direitos básicos do consumidor.',
          next_step_suggestion: 'Sugere-se formalizar a reclamação e, se necessário, buscar a mediação para resolução.'
        };
      } else if (description.toLowerCase().includes('propaganda enganosa')) {
        return {
          cdc_article: 'Art. 37 - Publicidade Enganosa ou Abusiva',
          mediation_guidance: 'A publicidade enganosa é proibida. O consumidor pode exigir o cumprimento da oferta, a rescisão do contrato com restituição ou o abatimento proporcional do preço.',
          executive_summary: 'Denúncia de "Publicidade Enganosa" com base em informações inconsistentes.',
          next_step_suggestion: 'Aconselha-se reunir provas da publicidade e da oferta para iniciar um processo de mediação.'
        };
      } else if (description.toLowerCase().includes('cobrança indevida')) {
        return {
          cdc_article: 'Art. 42 - Cobrança de Dívidas',
          mediation_guidance: 'O consumidor cobrado em quantia indevida tem direito à repetição do indébito, por valor igual ao dobro do que pagou em excesso, acrescido de correção monetária e juros legais.',
          executive_summary: 'Denúncia de "Cobrança Indevida" com potencial para restituição em dobro.',
          next_step_suggestion: 'Recomendamos contestar a cobrança formalmente e, se não houver resolução, buscar a mediação para a restituição.'
        };
      } else {
        return {
          cdc_article: 'Art. 6º - Direitos Básicos do Consumidor',
          mediation_guidance: 'Sua denúncia será analisada por um mediador. Mantenha todas as evidências e aguarde o contato para os próximos passos.',
          executive_summary: 'Denúncia geral de consumo, requerendo análise detalhada por mediador humano.',
          next_step_suggestion: 'Aguarde o contato de um mediador para uma análise aprofundada e orientação personalizada.'
        };
      }
    } catch (error) {
      setError('Ocorreu um erro durante a análise. Por favor, tente novamente.');
      throw error;
    }
  };

  useEffect(() => {
    if (isOpen && complaintData) {
      const runAnalysis = async () => {
        try {
          const analysis = await simulateAnalysis(complaintData.description);
          setAiAnalysis(analysis);
          setAnalysisStep('results');
        } catch (error) {
          console.error('Analysis failed:', error);
        }
      };
      runAnalysis();
    } else if (!isOpen) {
      // Reset state when modal closes
      setAnalysisStep('initial');
      setProgress(0);
      setAiAnalysis(null);
      setShowChat(false);
      setError(null);
    }
  }, [isOpen, complaintData]);

  const handleStartChat = () => {
    setShowChat(true);
  };

  const handleEndChat = () => {
    setShowChat(false);
    onClose();
  };

  const handleFinalizeComplaint = async () => {
    try {
      // Process complaint and generate protocol
      const result = await complaintService.processComplaint(complaintData, aiAnalysis);
      
      // Send email notification
      await complaintService.sendEmailNotification(complaintData, result.protocolNumber, aiAnalysis);
      
      onFinalizeComplaint();
    } catch (error) {
      console.error('Error processing complaint:', error);
      onFinalizeComplaint();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <Card className="w-full border-none shadow-none">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-between items-center">
                <div></div> {/* Placeholder for alignment */}
                <CardTitle className="text-xl font-bold text-gdf-gradient flex items-center">
                  <Brain className="w-6 h-6 mr-2" />
                  Análise Inteligente da Denúncia
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
              {analysisStep === 'initial' && (
                <div className="text-center py-8">
                  <img src="/brain.gif" alt="Brain animation" className="w-32 h-32 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Iniciando Análise...</h3>
                  <p className="text-gray-600">
                    Nossa IA está preparando sua análise. Por favor, aguarde.
                  </p>
                </div>
              )}

              {analysisStep === 'analyzing' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="relative w-80 h-80 mx-auto mb-4 flex items-center justify-center">
                      <img src="/brain.gif" alt="Brain animation" className="w-32 h-32" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Analisando Conteúdo...</h3>
                    <p className="text-gray-600 mb-4">
                      Processando sua denúncia e verificando o Código de Defesa do Consumidor
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progresso da Análise:</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span>Lendo descrição</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                        <span>Analisando anexos</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                        <span>Consultando CDC</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
                        <span>Gerando relatório</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Erro na Análise</h3>
                  <p className="text-red-700 mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700">
                    Tentar Novamente
                  </Button>
                </div>
              )}

              {analysisStep === 'results' && aiAnalysis && !showChat && (
                <div className="space-y-6">
                  <div className="text-center">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                    <h3 className="text-lg font-semibold mb-2">Análise Concluída!</h3>
                    <p className="text-gray-600">
                      Sua denúncia foi analisada com sucesso pela nossa IA.
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-800 mb-4 flex items-center">
                      <Brain className="w-5 h-5 mr-2" />
                      Resultado da Análise
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <strong className="text-blue-700">Resumo Executivo:</strong>
                        <p className="text-blue-600 mt-1">{aiAnalysis.executive_summary}</p>
                      </div>
                      <div>
                        <strong className="text-blue-700">Artigo do CDC Aplicável:</strong>
                        <p className="text-blue-600 mt-1">{aiAnalysis.cdc_article}</p>
                      </div>
                      <div>
                        <strong className="text-blue-700">Orientação para Mediação:</strong>
                        <p className="text-blue-600 mt-1">{aiAnalysis.mediation_guidance}</p>
                      </div>
                      <div>
                        <strong className="text-blue-700">Sugestão de Próxima Etapa:</strong>
                        <p className="text-blue-600 mt-1">{aiAnalysis.next_step_suggestion}</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-gray-700 mb-6">
                      Deseja conversar com o mediador/atendente humano?
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                      <Button
                        onClick={handleStartChat}
                        className="bg-green-600 hover:bg-green-700 text-white flex-1"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Conversar com o mediador/atendente humano
                      </Button>
                      <Button
                        onClick={handleFinalizeComplaint}
                        variant="outline"
                        className="flex-1"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Estou satisfeito com o atendimento
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>

      {/* Chat Interface */}
      <ChatInterface
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        onEndChat={handleEndChat}
        complaintData={complaintData}
        aiAnalysis={aiAnalysis}
      />
    </>
  );
};

export default AIAnalysisModal;