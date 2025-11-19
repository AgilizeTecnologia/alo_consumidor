import React, { useState, useEffect } from 'react';

function CDCViewer() {
  const [cdcText, setCdcText] = useState('');

  useEffect(() => {
    // Simula a leitura do arquivo de texto do CDC
    const cdcContent = `LEI Nº 8.078, DE 11 DE SETEMBRO DE 1990.\n\nDispõe sobre a proteção do consumidor e dá outras providências.\n\nTÍTULO I\nDos Direitos do Consumidor\n\nCAPÍTULO I\nDisposições Gerais\n\nArt. 1° O presente código estabelece normas de proteção e defesa do consumidor, de ordem pública e interesse social, nos termos dos arts. 5°, inciso XXXII, 170, inciso V, da Constituição Federal e art. 48 de suas Disposições Transitórias.\n\n... (conteúdo completo do CDC aqui) ...`;
    setCdcText(cdcContent);
  }, []);

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Código de Defesa do Consumidor</h2>
      <div className="prose max-w-none">
        <pre className="whitespace-pre-wrap">{cdcText}</pre>
      </div>
    </div>
  );
}

export default CDCViewer;
