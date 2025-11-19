import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Camera, Video, MapPin, Upload, X, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import AIAnalysisModal from './AIAnalysisModal';

function FormularioDenuncia() {
  const navigate = useNavigate();
  const [descricao, setDescricao] = useState('');
  const [fotos, setFotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [localizacao, setLocalizacao] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    if (type === 'fotos') {
      setFotos([...fotos, ...files]);
    } else if (type === 'videos') {
      setVideos([...videos, ...files]);
    }
  };

  const removeFile = (index, type) => {
    if (type === 'fotos') {
      setFotos(fotos.filter((_, i) => i !== index));
    } else if (type === 'videos') {
      setVideos(videos.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!descricao.trim()) {
      toast.error('Por favor, descreva o problema antes de enviar a denúncia.');
      return;
    }

    // Prepare complaint data for AI analysis
    const complaintData = {
      description: descricao,
      photos: fotos.map(file => file.name),
      videos: videos.map(file => file.name),
      location: localizacao
    };

    // Open the AI analysis modal
    setIsModalOpen(true);
  };

  const handleTalkToMediator = () => {
    setIsModalOpen(false);
    toast.info('Redirecionando para atendimento com mediador...');
    navigate('/atendimento');
  };

  const handleFinalizeComplaint = async () => {
    setIsModalOpen(false);
    setIsSubmitting(true);

    try {
      toast.info('Finalizando sua denúncia...');
      const complaintData = {
        description: descricao,
        photos: fotos.map(file => file.name),
        videos: videos.map(file => file.name),
        location: localizacao
      };

      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(complaintData),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`Denúncia enviada com sucesso! ID: ${result.id}. Um mediador entrará em contato em breve.`);
        
        // Resetar formulário
        setDescricao('');
        setFotos([]);
        setVideos([]);
        setLocalizacao('');
      } else {
        const errorData = await response.json();
        toast.error('Erro ao enviar denúncia: ' + (errorData.message || 'Erro desconhecido'));
      }
    } catch (error) {
      toast.error('Erro ao finalizar denúncia: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card-modern p-8 animate-fade-in-up">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Registrar Nova Denúncia</h3>
          <p className="text-gray-600">
            Descreva detalhadamente o problema e anexe evidências. Nossa IA analisará automaticamente com base no CDC.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="descricao" className="text-lg font-semibold text-gray-700">
              Descrição do Problema *
            </Label>
            <Textarea
              id="descricao"
              placeholder="Descreva detalhadamente o problema: produto/serviço, estabelecimento, valor, data, etc. Quanto mais detalhes, melhor será a análise."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
              className="min-h-32 focus-gdf resize-none"
              rows={6}
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {descricao.length}/1000 caracteres
              </span>
            </div>
          </div>

          {/* Upload de Fotos */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold text-gray-700 flex items-center">
              <Camera className="w-5 h-5 mr-2" />
              Fotos (Evidências)
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                id="fotos"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileChange(e, 'fotos')}
                className="hidden"
              />
              <label htmlFor="fotos" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-600">Clique para selecionar fotos ou arraste aqui</p>
                <p className="text-sm text-gray-500 mt-1">PNG, JPG até 10MB cada</p>
              </label>
            </div>
            
            {fotos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {fotos.map((foto, index) => (
                  <div key={index} className="relative group">
                    <div className="bg-gray-100 rounded-lg p-3 text-center">
                      <Camera className="w-6 h-6 mx-auto mb-1 text-gray-500" />
                      <p className="text-xs text-gray-600 truncate">{foto.name}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index, 'fotos')}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upload de Vídeos */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold text-gray-700 flex items-center">
              <Video className="w-5 h-5 mr-2" />
              Vídeos (Evidências)
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                id="videos"
                type="file"
                accept="video/*"
                multiple
                onChange={(e) => handleFileChange(e, 'videos')}
                className="hidden"
              />
              <label htmlFor="videos" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-600">Clique para selecionar vídeos ou arraste aqui</p>
                <p className="text-sm text-gray-500 mt-1">MP4, MOV até 50MB cada</p>
              </label>
            </div>
            
            {videos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {videos.map((video, index) => (
                  <div key={index} className="relative group">
                    <div className="bg-gray-100 rounded-lg p-3 text-center">
                      <Video className="w-6 h-6 mx-auto mb-1 text-gray-500" />
                      <p className="text-xs text-gray-600 truncate">{video.name}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index, 'videos')}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Localização */}
          <div className="space-y-2">
            <Label htmlFor="localizacao" className="text-lg font-semibold text-gray-700 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Localização do Estabelecimento
            </Label>
            <Input
              id="localizacao"
              type="text"
              placeholder="Ex: Shopping Brasília, Loja X, Asa Norte - Brasília/DF"
              value={localizacao}
              onChange={(e) => setLocalizacao(e.target.value)}
              className="focus-gdf"
            />
            <p className="text-sm text-gray-500">
              Informe o endereço completo ou ponto de referência do estabelecimento
            </p>
          </div>

          {/* Botão de Envio */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gdf-primary w-full py-4 text-lg font-semibold flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="gdf-loader w-5 h-5"></div>
                  <span>Enviando Denúncia...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Enviar Denúncia</span>
                </>
              )}
            </button>
            <p className="text-sm text-gray-500 text-center mt-3">
              Ao enviar, você concorda que as informações são verdadeiras e autoriza o contato de um mediador.
            </p>
          </div>
        </form>
      </div>

      {/* Informações Adicionais */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="card-modern p-6 animate-slide-in-left">
          <h4 className="font-semibold text-gray-800 mb-3">O que acontece após o envio?</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
              Nossa IA analisa automaticamente sua denúncia
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
              Um mediador especializado é designado
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
              Tentativa de resolução amigável com o fornecedor
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
              Se necessário, acionamento dos órgãos competentes
            </li>
          </ul>
        </div>

        <div className="card-modern p-6 animate-slide-in-right">
          <h4 className="font-semibold text-gray-800 mb-3">Dicas para uma boa denúncia</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-yellow-500 flex-shrink-0" />
              Seja específico sobre datas, valores e produtos
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-yellow-500 flex-shrink-0" />
              Anexe fotos de produtos, notas fiscais e preços
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-yellow-500 flex-shrink-0" />
              Inclua informações de contato do estabelecimento
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-yellow-500 flex-shrink-0" />
              Mantenha documentos originais em sua posse
            </li>
          </ul>
        </div>
      </div>

      {/* AI Analysis Modal */}
      <AIAnalysisModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        complaintData={{
          description: descricao,
          photos: fotos,
          videos: videos,
          location: localizacao
        }}
        onTalkToMediator={handleTalkToMediator}
        onFinalizeComplaint={handleFinalizeComplaint}
      />
    </div>
  );
}

export default FormularioDenuncia;