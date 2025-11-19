"use client";

import React, { useState } from 'react';
import { CheckCircle, Star, X } from 'lucide-react';
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

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  const handleSubmitSurvey = async () => {
    setIsSubmitting(true);
    // Simulate API call to submit survey
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Pesquisa de satisfação enviada:', { protocolNumber, rating, comment });
    toast.success('Sua avaliação foi enviada com sucesso! Agradecemos seu feedback.');
    setIsSubmitting(false);
    onClose(); // Close the modal and the entire flow
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

          <CardContent className="space-y-6 text-center">
            <p className="text-green-700 text-lg font-semibold">
              Seu protocolo foi gerado: <span className="font-bold">{protocolNumber}</span>
            </p>
            <p className="text-gray-600">
              O resumo completo do seu atendimento foi enviado para o seu e-mail.
            </p>

            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Pesquisa de Satisfação Rápida</h3>
              <p className="text-gray-700">De 0 a 10, qual a probabilidade de você recomendar este serviço?</p>
              <div className="flex justify-center space-x-1">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                  <Button
                    key={value}
                    variant={rating === value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleRatingClick(value)}
                    className={`w-8 h-8 p-0 rounded-full ${
                      rating === value ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {value}
                  </Button>
                ))}
              </div>
              <textarea
                placeholder="Deixe um comentário (opcional)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md resize-none focus-gdf"
                rows={3}
              />
              <Button
                onClick={handleSubmitSurvey}
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default SatisfactionSurveyModal;