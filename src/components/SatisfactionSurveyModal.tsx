"use client";

import React, { useState } from 'react';
import { CheckCircle, Star, X, Heart, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent } from './ui/dialog';
import { toast } from 'sonner';

interface SatisfactionSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  protocolNumber: string;
}

const SatisfactionSurveyModal: React.FC<SatisfactionSurveyModalProps> = ({
  isOpen,
  onClose,
  protocolNumber,
}) => {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  const handleSubmitSurvey = async () => {
    if (rating === null) {
      toast.error('Por favor, avalie nosso atendimento antes de enviar.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call to submit survey
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Log the survey data
      console.log('Pesquisa de satisfação enviada:', { 
        protocolNumber, 
        rating, 
        comment,
        timestamp: new Date().toISOString()
      });
      
      setShowThankYou(true);
      
      // Auto-close after showing thank you message
      setTimeout(() => {
        setShowThankYou(false);
        onClose();
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting survey:', error);
      toast.error('Ocorreu um erro ao enviar sua avaliação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <Card className="w-full border-none shadow-none">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-between items-center">
              <div></div>
              <CardTitle className="text-xl font-bold text-gdf-gradient flex items-center">
                <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
                Atendimento Concluído!
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
            {!showThankYou ? (
              <>
                <div className="text-center">
                  <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <p className="text-green-700 text-lg font-semibold mb-2">
                    Protocolo: <span className="font-bold">{protocolNumber}</span>
                  </p>
                  <p className="text-gray-600">
                    O resumo completo do seu atendimento foi enviado para o seu e-mail.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center flex items-center justify-center">
                    <Heart className="w-5 h-5 mr-2 text-red-500" />
                    Pesquisa de Satisfação
                  </h3>
                  
                  <p className="text-gray-700 text-center mb-6">
                    De 0 a 10, qual a probabilidade de você recomendar este serviço?
                  </p>

                  <div className="flex justify-center space-x-2 mb-6">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                      <Button
                        key={value}
                        variant={rating === value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleRatingClick(value)}
                        className={`w-10 h-10 p-0 rounded-full transition-all ${
                          rating === value 
                            ? 'bg-blue-600 text-white scale-110' 
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:scale-105'
                        }`}
                      >
                        {value}
                      </Button>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor((rating || 0) / 2)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {rating === null ? 'Nenhuma avaliação' : `${rating}/10`}
                      </span>
                    </div>

                    <div className="relative">
                      <textarea
                        placeholder="Deixe um comentário (opcional)..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus-gdf focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        rows={3}
                      />
                      <MessageCircle className="absolute bottom-3 right-3 w-4 h-4 text-gray-400" />
                    </div>

                    <Button
                      onClick={handleSubmitSurvey}
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 transition-all hover:scale-105"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Enviar Avaliação
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-2">Obrigado!</h3>
                <p className="text-gray-600">
                  Sua avaliação é muito importante para nós.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default SatisfactionSurveyModal;