import React, { useState, useEffect } from 'react';

function MinhasDenunciasList() {
  const [denuncias, setDenuncias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDenuncias = async () => {
      try {
        const response = await fetch('/api/complaints');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDenuncias(data);
      } catch (e) {
        setError('Erro ao carregar denúncias: ' + e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDenuncias();
  }, []);

  if (loading) {
    return <div className="p-4 bg-white shadow-md rounded-lg">Carregando denúncias...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-100 text-red-800 shadow-md rounded-lg">{error}</div>;
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Minhas Denúncias</h2>
      {denuncias.length === 0 ? (
        <p>Você ainda não registrou nenhuma denúncia.</p>
      ) : (
        <div className="space-y-4">
          {denuncias.map((denuncia) => (
            <div key={denuncia.id} className="border p-4 rounded-md">
              <h3 className="text-lg font-semibold">{denuncia.description}</h3>
              <p><strong>Status:</strong> {denuncia.status}</p>
              <p><strong>Data:</strong> {new Date(denuncia.created_at).toLocaleDateString()}</p>
              {denuncia.location && <p><strong>Localização:</strong> {denuncia.location}</p>}
              {denuncia.photos.length > 0 && <p><strong>Fotos:</strong> {denuncia.photos.join(', ')}</p>}
              {denuncia.videos.length > 0 && <p><strong>Vídeos:</strong> {denuncia.videos.join(', ')}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MinhasDenunciasList;

