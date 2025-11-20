// Serviço para processar denúncias, gerar protocolos e simular envio de e-mails

const generateProtocol = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `DEN-${year}${month}${day}-${random}`;
};

const generateEmailContent = (complaintData, protocolNumber, aiAnalysis, chatHistory = null) => {
  const date = new Date().toLocaleDateString('pt-BR');
  const time = new Date().toLocaleTimeString('pt-BR');
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #0057B8 0%, #FFD700 100%); color: white; padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
        <h1 style="margin: 0; font-size: 24px;">Secretaria do Consumidor GDF</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Atendimento ao Consumidor</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
        <h2 style="color: #0057B8; margin-top: 0;">Protocolo de Atendimento</h2>
        <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #0057B8; margin: 10px 0;">
          <strong>Número do Protocolo:</strong> ${protocolNumber}
        </div>
        <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #0057B8; margin: 10px 0;">
          <strong>Data e Hora:</strong> ${date} às ${time}
        </div>
      </div>
      
      <div style="background: #e3f2fd; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
        <h3 style="color: #0057B8; margin-top: 0;">Resumo do Atendimento</h3>
        <p><strong>Descrição do Problema:</strong></p>
        <div style="background: white; padding: 15px; border-radius: 5px; margin: 10px 0; border: 1px solid #ddd;">
          ${complaintData.description}
        </div>
        
        ${complaintData.location ? `
          <p><strong>Localização:</strong> ${complaintData.location}</p>
        ` : ''}
        
        ${complaintData.photos.length > 0 ? `
          <p><strong>Evidências Fotográficas:</strong> ${complaintData.photos.length} foto(s) anexada(s)</p>
        ` : ''}
        
        ${complaintData.videos.length > 0 ? `
          <p><strong>Evidências em Vídeo:</strong> ${complaintData.videos.length} vídeo(s) anexado(s)</p>
        ` : ''}

        ${chatHistory ? `
          <h4 style="color: #0057B8; margin-top: 20px;">Histórico do Chat:</h4>
          <div style="background: white; padding: 15px; border-radius: 5px; margin: 10px 0; border: 1px solid #ddd; white-space: pre-wrap;">
            ${chatHistory}
          </div>
        ` : ''}
      </div>
      
      ${aiAnalysis ? `
        <div style="background: #fff3e0; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h3 style="color: #f57c00; margin-top: 0;">Análise da IA</h3>
          <div style="background: white; padding: 15px; border-radius: 5px; margin: 10px 0; border: 1px solid #ddd;">
            <p><strong>Nível de Risco:</strong> ${aiAnalysis.risk_level}</p>
            <p><strong>Resumo Executivo:</strong></p>
            <p>${aiAnalysis.executive_summary}</p>
            <p><strong>Artigo do CDC Aplicável:</strong></p>
            <p>${aiAnalysis.cdc_article}</p>
            <p><strong>Orientação para Mediação:</strong></p>
            <p>${aiAnalysis.mediation_guidance}</p>
            <p><strong>Sugestão de Próxima Etapa:</strong></p>
            <p>${aiAnalysis.next_step_suggestion}</p>
          </div>
        </div>
      ` : ''}
      
      <div style="background: #f1f8e9; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
        <h3 style="color: #689f38; margin-top: 0;">Próximos Passos</h3>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li>Um mediador especializado entrará em contato em até 48 horas</li>
          <li>Mantenha todas as evidências em sua posse</li>
          <li>Responda aos contatos para agilizar o processo</li>
          <li>Em caso de urgência, ligue para (61) 3000-0000</li>
        </ul>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #666; font-size: 14px; border-top: 1px solid #eee;">
        <p>Este é um e-mail automático. Por favor, não responda a esta mensagem.</p>
        <p>Secretaria do Consumidor do Distrito Federal</p>
        <p>© 2025 Governo do Distrito Federal</p>
      </div>
    </div>
  `;
};

export const complaintService = {
  // Processar denúncia e gerar protocolo
  async processComplaint(complaintData, aiAnalysis = null) {
    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const protocolNumber = generateProtocol();
    
    // Simular armazenamento da denúncia
    const complaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    const newComplaint = {
      id: Date.now().toString(),
      protocolNumber,
      ...complaintData,
      aiAnalysis,
      status: 'pending',
      createdAt: new Date().toISOString(),
      userId: localStorage.getItem('consumer_user') ? JSON.parse(localStorage.getItem('consumer_user')).id : null
    };
    
    complaints.push(newComplaint);
    localStorage.setItem('complaints', JSON.stringify(complaints));
    
    return {
      success: true,
      protocolNumber,
      complaint: newComplaint
    };
  },

  // Simular envio de e-mail
  async sendEmailNotification(complaintData, protocolNumber, aiAnalysis = null, chatHistory = null) {
    // Simular envio de e-mail
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const emailContent = generateEmailContent(complaintData, protocolNumber, aiAnalysis, chatHistory);
    
    // Em um ambiente real, aqui seria chamada uma API de envio de e-mails
    console.log('Enviando e-mail para:', complaintData.email || 'usuario@teste.com');
    console.log('Assunto: Protocolo de Atendimento - Secretaria do Consumidor GDF');
    console.log('Conteúdo do e-mail:', emailContent);
    
    // Simular salvamento do e-mail enviado
    const sentEmails = JSON.parse(localStorage.getItem('sent_emails') || '[]');
    sentEmails.push({
      id: Date.now().toString(),
      to: complaintData.email || 'usuario@teste.com',
      subject: `Protocolo de Atendimento - ${protocolNumber}`,
      content: emailContent,
      sentAt: new Date().toISOString(),
      complaintId: complaintData.id
    });
    
    localStorage.setItem('sent_emails', JSON.stringify(sentEmails));
    
    return {
      success: true,
      message: 'E-mail enviado com sucesso'
    };
  },

  // Obter denúncias do usuário
  async getUserComplaints(userId) {
    const complaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    return complaints.filter(complaint => complaint.userId === userId);
  },

  // Obter denúncia por protocolo
  async getComplaintByProtocol(protocolNumber) {
    const complaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    return complaints.find(complaint => complaint.protocolNumber === protocolNumber);
  }
};

export default complaintService;