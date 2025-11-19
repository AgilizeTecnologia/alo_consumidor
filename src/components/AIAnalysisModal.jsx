import React, { useState, useEffect } from 'react';
import { Brain, CheckCircle, Phone, X, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent } from './ui/dialog';
import AtendimentoOptionsModal from './AtendimentoOptionsModal';

const AIAnalysisModal = ({ 
  isOpen, 
  onClose, 
  complaintData, 
  onTalkToMediator, 
  onFinalizeComplaint 
}) => {
  const [analysisStep, setAnalysisStep] = useState('initial'); // 'initial', 'analyzing', 'results'
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showAtendimentoOptions, setShowAtendimentoOptions] = useState(false);

  // Simulate AI analysis with 15 seconds
  const simulateAnalysis = async (description) => {
    setAnalysisStep('analyzing');
    setProgress(0);

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

    // Simulate AI processing time (15 seconds as requested)
    await new Promise(resolve => setTimeout(resolve, 15000));

    clearInterval(progressInterval);

    // Generate analysis based on description
    if (description.toLowerCase().includes('produto com defeito')) {
      return {
        cdc_article: 'Art. 18 - Vício do Produto ou Serviço',
        mediation_guidance: 'O fornecedor tem 30 dias para sanar o vício. Caso contrário, o consumidor pode exigir a substituição do produto, a restituição imediata da quantia paga ou o abatimento proporcional do preço.'
      };
    } else if (description.toLowerCase().includes('atendimento ruim')) {
      return {
        cdc_article: 'Art. 6º, III e IV - Direitos Básicos do Consumidor',
        mediation_guidance: 'O consumidor tem direito à informação clara e adequada e à proteção contra práticas abusivas. Recomenda-se registrar a ocorrência e buscar a mediação para uma solução amigável.'
      };
    } else if (description.toLowerCase().includes('propaganda enganosa')) {
      return {
        cdc_article: 'Art. 37 - Publicidade Enganosa ou Abusiva',
        mediation_guidance: 'A publicidade enganosa é proibida. O consumidor pode exigir o cumprimento da oferta, a rescisão do contrato com restituição ou o abatimento proporcional do preço.'
      };
    } else {
      return {
        cdc_article: 'Art. 6º - Direitos Básicos do Consumidor',
        mediation_guidance: 'Sua denúncia será analisada por um mediador. Mantenha todas as evidências e aguarde o contato para os próximos passos.'
      };
    }
  };

  useEffect(() => {
    if (isOpen && complaintData) {
      const runAnalysis = async () => {
        const analysis = await simulateAnalysis(complaintData.description);
        setAiAnalysis(analysis);
        setAnalysisStep('results');
      };
      runAnalysis();
    } else if (!isOpen) {
      // Reset state when modal closes
      setAnalysisStep('initial');
      setProgress(0);
      setAiAnalysis(null);
      setShowAtendimentoOptions(false);
    }
  }, [isOpen, complaintData]);

  const handleTalkToMediator = () => {
    setShowAtendimentoOptions(true);
  };

  const handleAtendimentoSelect = (type) => {
    onTalkToMediator(type);
  };

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <Card className="w-full border-none shadow-none">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-between items-center">
                <div></div>
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
                  <Brain className="w-16 h-16 mx-auto mb-4 text-blue-500 animate-pulse" />
                  <h3 className="text-lg font-semibold mb-2">Iniciando Análise...</h3>
                  <p className="text-gray-600">
                    Nossa IA está preparando sua análise. Por favor, aguarde.
                  </p>
                </div>
              )}

              {analysisStep === 'analyzing' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Brain className="w-16 h-16 text-blue-600 animate-spin" />
                      </div>
                      <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-ping"></div>
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

              {analysisStep === 'results' && aiAnalysis && !showAtendimentoOptions && (
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
                        <strong className="text-blue-700">Artigo do CDC Aplicável:</strong>
                        <p className="text-blue-600 mt-1">{aiAnalysis.cdc_article}</p>
                      </div>
                      <div>
                        <strong className="text-blue-700">Orientação para Mediação:</strong>
                        <p className="text-blue-600 mt-1">{aiAnalysis.mediation_guidance}</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-gray-700 mb-6">
                      A análise da IA foi concluída. Você está satisfeito com a resposta ou prefere conversar com um mediador humano?
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                      <Button
                        onClick={handleTalkToMediator}
                        className="bg-green-600 hover:bg-green-700 text-white flex-1"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Sim, quero conversar com um mediador
                      </Button>
                      <Button
                        onClick={onFinalizeComplaint}
                        variant="outline"
                        className="flex-1"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Estou satisfeito com a resposta
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>

      {/* Atendimento Options Modal */}
      <AtendimentoOptionsModal
        isOpen={showAtendimentoOptions}
        onClose={() => setShowAtendimentoOptions(false)}
        onAtendimentoSelect={handleAtendimentoSelect}
      />
    </>
  );
};

export default AIAnalysisModal;