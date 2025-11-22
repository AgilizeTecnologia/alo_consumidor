import React, { useState, useEffect } from 'react';
import { Brain, CheckCircle, Phone, X, Loader2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent } from './ui/dialog';
import ChatInterface from './ChatInterface';
import SatisfactionSurveyModal from './SatisfactionSurveyModal';
import { complaintService } from '../services/complaintService';
import { toast } from 'sonner';

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
  const [showSatisfactionSurvey, setShowSatisfactionSurvey] = useState(false);
  const [protocolNumber, setProtocolNumber] = useState('');
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false); // Para expandir detalhes

  // Simulate AI analysis with 3 seconds (RNF-002)
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
          return prev + Math.random() * 35; // Faster progress for 3s total
        });
      }, 100); // Update more frequently

      // Simulate AI processing time (3 seconds as per RNF-002)
      await new Promise(resolve => setTimeout(resolve, 3000));

      clearInterval(progressInterval);

      // Generate analysis based on description
      if (description.toLowerCase().includes('produto com defeito')) {
        return {
          cdc_article: 'Art. 18 - Vício do Produto ou Serviço',
          mediation_guidance: 'O fornecedor tem 30 dias para sanar o vício. Caso contrário, o consumidor pode exigir a substituição do produto, a restituição imediata da quantia paga ou o abatimento proporcional do preço.',
          executive_summary: 'Denúncia classificada como "Vício do Produto" com alta probabilidade de resolução via mediação.',
          next_step_suggestion: 'Recomendamos iniciar o processo de mediação para buscar a substituição do produto ou restituição do valor.',
          risk_level: 'Alto Risco de Vício',
          classification_details: {
            type: 'Produto Defeituoso',
            urgency: 'Alta',
            estimated_resolution_time: '15-30 dias',
            success_probability: '85%'
          }
        };
      } else if (description.toLowerCase().includes('atendimento ruim')) {
        return {
          cdc_article: 'Art. 6º, III e IV - Direitos Básicos do Consumidor',
          mediation_guidance: 'O consumidor tem direito à informação clara e adequada e à proteção contra práticas abusivas. Recomenda-se registrar a ocorrência e buscar a mediação para uma solução amigável.',
          executive_summary: 'Denúncia de "Má Qualidade no Atendimento" com foco em direitos básicos do consumidor.',
          next_step_suggestion: 'Sugere-se formalizar a reclamação e, se necessário, buscar a mediação para resolução.',
          risk_level: 'Médio Risco de Conflito',
          classification_details: {
            type: 'Atendimento Deficiente',
            urgency: 'Média',
            estimated_resolution_time: '7-14 dias',
            success_probability: '70%'
          }
        };
      } else if (description.toLowerCase().includes('propaganda enganosa')) {
        return {
          cdc_article: 'Art. 37 - Publicidade Enganosa ou Abusiva',
          mediation_guidance: 'A publicidade enganosa é proibida. O consumidor pode exigir o cumprimento da oferta, a rescisão do contrato com restituição ou o abatimento proporcional do preço.',
          executive_summary: 'Denúncia de "Publicidade Enganosa" com base em informações inconsistentes.',
          next_step_suggestion: 'Aconselha-se reunir provas da publicidade e da oferta para iniciar um processo de mediação.',
          risk_level: 'Alto Risco de Fraude',
          classification_details: {
            type: 'Publicidade Enganosa',
            urgency: 'Alta',
            estimated_resolution_time: '10-20 dias',
            success_probability: '90%'
          }
        };
      } else if (description.toLowerCase().includes('cobrança indevida')) {
        return {
          cdc_article: 'Art. 42 - Cobrança de Dívidas',
          mediation_guidance: 'O consumidor cobrado em quantia indevida tem direito à repetição do indébito, por valor igual ao dobro do que pagou em excesso, acrescido de correção monetária e juros legais.',
          executive_summary: 'Denúncia de "Cobrança Indevida" com potencial para restituição em dobro.',
          next_step_suggestion: 'Recomendamos contestar a cobrança formalmente e, se não houver resolução, buscar a mediação para a restituição.',
          risk_level: 'Alto Risco Financeiro',
          classification_details: {
            type: 'Cobrança Indevida',
            urgency: 'Urgente',
            estimated_resolution_time: '5-15 dias',
            success_probability: '95%'
          }
        };
      } else {
        return {
          cdc_article: 'Art. 6º - Direitos Básicos do Consumidor',
          mediation_guidance: 'Sua denúncia será analisada por um mediador. Mantenha todas as evidências e aguarde o contato para os próximos passos.',
          executive_summary: 'Denúncia geral de consumo, requerendo análise detalhada por mediador humano.',
          next_step_suggestion: 'Aguarde o contato de um mediador para uma análise aprofundada e orientação personalizada.',
          risk_level: 'Risco a Ser Avaliado',
          classification_details: {
            type: 'Denúncia Geral',
            urgency: 'A ser definida',
            estimated_resolution_time: 'A ser definido',
            success_probability: 'A ser avaliado'
          }
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
      setShowSatisfactionSurvey(false);
      setProtocolNumber('');
      setError(null);
      setShowDetails(false);
    }
  }, [isOpen, complaintData]);

  const handleStartChat = () => {
    setShowChat(true);
  };

  const handleEndChatFromChat = () => {
    setShowChat(false);
    onClose(); // Close AIAnalysisModal after chat is finalized
  };

  const handleSatisfiedFlow = async () => {
    try {
      toast.info('Finalizando seu atendimento...');
      // Process complaint and generate protocol
      const result = await complaintService.processComplaint(complaintData, aiAnalysis);
      setProtocolNumber(result.protocolNumber);
      
      // Send email notification
      await complaintService.sendEmailNotification(complaintData, result.protocolNumber, aiAnalysis);
      
      toast.success('Atendimento concluído! Seu protocolo foi enviado para o seu e-mail.');
      setShowSatisfactionSurvey(true); // Open satisfaction survey
    } catch (error) {
      console.error('Error processing complaint:', error);
      toast.error('Ocorreu um erro ao finalizar seu atendimento. Por favor, tente novamente.');
      onClose(); // Close modal even if error
    }
  };

  const handleCloseSatisfactionSurvey = () => {
    setShowSatisfactionSurvey(false);
    onClose(); // Close AIAnalysisModal after survey is done
  };

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen && !showChat && !showSatisfactionSurvey} onOpenChange={onClose}>
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
                  <img src="/avatar_g1.gif" alt="Análise em andamento" className="w-32 h-32 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Iniciando Análise...</h3>
                  <p className="text-gray-600">
                    Nossa IA está preparando sua análise. Por favor, aguarde.
                  </p>
                </div>
              )}

              {analysisStep === 'analyzing' && (
                <div className="space-y-6">
                  <div className="text-center">
                    {/* New loading animation with avatar */}
                    <div className="loading-container">
                      <div className="loading-content">
                        <img 
                          src="/avatar_analise_documentos_v5_transparent.gif" 
                          alt="Avatar Patrulha do Consumidor Analisando Documentos" 
                          className="loading-avatar"
                        />
                        <p className="loading-text">Analisando documentos...</p>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 mt-4">Análise em Andamento</h3>
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

              {analysisStep === 'results' && aiAnalysis && (
                <div className="space-y-6">
                  <div className="text-center">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                    <h3 className="text-lg font-semibold mb-2">Análise Concluída!</h3>
                    <p className="text-gray-600">
                      Sua denúncia foi analisada com sucesso pela nossa IA.
                    </p>
                  </div>

                  {/* Resumo Executivo */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-800 mb-4 flex items-center">
                      <Brain className="w-5 h-5 mr-2" />
                      Resumo Executivo
                    </h4>
                    <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                      <p className="text-blue-700 font-medium">{aiAnalysis.risk_level}</p>
                      <p className="text-blue-600 mt-2">{aiAnalysis.executive_summary}</p>
                    </div>
                  </div>

                  {/* Sugestão de Próxima Etapa */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h4 className="font-semibold text-green-800 mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Sugestão de Próxima Etapa
                    </h4>
                    <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
                      <p className="text-green-700">{aiAnalysis.next_step_suggestion}</p>
                    </div>
                  </div>

                  {/* Action buttons - removed the question about proceeding with mediator */}
                  <div className="text-center">
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                      <Button
                        onClick={handleStartChat}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        A – Conversar com o Mediador
                      </Button>
                      <Button
                        onClick={handleSatisfiedFlow}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        B – Estou Satisfeito com o Atendimento
                      </Button>
                      <Button
                        onClick={() => setShowDetails(!showDetails)}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                      >
                        {showDetails ? (
                          <>
                            <ChevronUp className="w-4 h-4 mr-2" />
                            Ocultar Detalhes da Análise
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4 mr-2" />
                            Ver Detalhes da Análise
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Detalhes da Análise (expansível) */}
                  {showDetails && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
                      <h4 className="font-semibold text-gray-800 mb-4">Detalhes Técnicos da Análise</h4>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg">
                          <h5 className="font-medium text-gray-700 mb-2">Classificação</h5>
                          <p className="text-sm text-gray-600">Tipo: {aiAnalysis.classification_details.type}</p>
                          <p className="text-sm text-gray-600">Urgência: {aiAnalysis.classification_details.urgency}</p>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg">
                          <h5 className="font-medium text-gray-700 mb-2">Métricas</h5>
                          <p className="text-sm text-gray-600">Tempo Estimado: {aiAnalysis.classification_details.estimated_resolution_time}</p>
                          <p className="text-sm text-gray-600">Probabilidade de Sucesso: {aiAnalysis.classification_details.success_probability}</p>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg">
                        <h5 className="font-medium text-gray-700 mb-2">Base Legal</h5>
                        <p className="text-sm text-gray-600">{aiAnalysis.cdc_article}</p>
                      </div>

                      <div className="bg-white p-4 rounded-lg">
                        <h5 className="font-medium text-gray-700 mb-2">Orientação para Mediação</h5>
                        <p className="text-sm text-gray-600">{aiAnalysis.mediation_guidance}</p>
                      </div>
                    </div>
                  )}
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
        onEndChat={handleEndChatFromChat}
        complaintData={complaintData}
        aiAnalysis={aiAnalysis}
      />

      {/* Satisfaction Survey Modal */}
      {showSatisfactionSurvey && (
        <SatisfactionSurveyModal
          isOpen={showSatisfactionSurvey}
          onClose={handleCloseSatisfactionSurvey}
          protocolNumber={protocolNumber}
        />
      )}
    </>
  );
};

export default AIAnalysisModal;