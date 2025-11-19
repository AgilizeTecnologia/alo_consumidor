// Serviço de autenticação simulado
// Em um ambiente real, estas funções fariam chamadas HTTP para uma API backend

const API_BASE_URL = '/api'; // Em produção, seria a URL real da API

// Simular delay de rede
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simular banco de dados em memória (localStorage)
const getUsers = () => {
  const users = localStorage.getItem('consumer_users');
  return users ? JSON.parse(users) : [];
};

const saveUsers = (users) => {
  localStorage.setItem('consumer_users', JSON.stringify(users));
};

const getPendingVerifications = () => {
  const pending = localStorage.getItem('consumer_pending_verifications');
  return pending ? JSON.parse(pending) : [];
};

const savePendingVerifications = (pending) => {
  localStorage.setItem('consumer_pending_verifications', JSON.stringify(pending));
};

// Gerar código de verificação de 6 dígitos
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Validar CPF
const validateCPF = (cpf) => {
  const numbers = cpf.replace(/\D/g, '');
  if (numbers.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(numbers)) return false;
  
  // Validação dos dígitos verificadores
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers[i]) * (10 - i);
  }
  let digit1 = 11 - (sum % 11);
  if (digit1 > 9) digit1 = 0;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers[i]) * (11 - i);
  }
  let digit2 = 11 - (sum % 11);
  if (digit2 > 9) digit2 = 0;
  
  return digit1 === parseInt(numbers[9]) && digit2 === parseInt(numbers[10]);
};

// Validar email
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// API de autenticação
export const authService = {
  // Registrar usuário e enviar código de verificação
  async register(userData) {
    await delay(1500); // Simular delay de rede
    
    const { nome, cpf, email, telefone, verificationMethod, emailNotifications, whatsappNotifications, isWhatsapp } = userData;
    
    // Validações
    if (!nome || !cpf || !email || !telefone) {
      throw new Error('Todos os campos são obrigatórios');
    }
    
    if (!validateCPF(cpf)) {
      throw new Error('CPF inválido');
    }
    
    if (!validateEmail(email)) {
      throw new Error('E-mail inválido');
    }
    
    // Verificar se usuário já existe
    const users = getUsers();
    const existingUser = users.find(user => 
      user.cpf === cpf.replace(/\D/g, '') || user.email === email
    );
    
    if (existingUser) {
      throw new Error('Usuário já cadastrado com este CPF ou e-mail');
    }
    
    // Gerar código de verificação
    const verificationCode = generateVerificationCode();
    
    // Salvar dados temporários para verificação
    const pendingVerifications = getPendingVerifications();
    const verificationData = {
      id: Date.now().toString(),
      userData: {
        nome,
        cpf: cpf.replace(/\D/g, ''),
        email,
        telefone: telefone.replace(/\D/g, ''),
        emailNotifications,
        whatsappNotifications,
        isWhatsapp
      },
      verificationCode,
      verificationMethod,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutos
    };
    
    pendingVerifications.push(verificationData);
    savePendingVerifications(pendingVerifications);
    
    // Simular envio do código
    console.log(`Código de verificação enviado via ${verificationMethod}:`, verificationCode);
    
    if (verificationMethod === 'email') {
      console.log(`E-mail enviado para: ${email}`);
      console.log(`Código: ${verificationCode}`);
    } else if (verificationMethod === 'whatsapp') {
      console.log(`WhatsApp enviado para: ${telefone}`);
      console.log(`Código: ${verificationCode}`);
    }
    
    return {
      success: true,
      message: `Código de verificação enviado para ${verificationMethod === 'email' ? 'seu e-mail' : 'seu WhatsApp'}. Verifique sua caixa de entrada/spam ou mensagens.`,
      verificationId: verificationData.id
    };
  },

  // Verificar código e finalizar cadastro
  async verifyAndCreateAccount(verificationData) {
    await delay(1500); // Simular delay de rede
    
    const { cpf, verificationCode, password, confirmPassword } = verificationData;
    
    // Validações
    if (!verificationCode || verificationCode.length !== 6) {
      throw new Error('Código de verificação deve ter 6 dígitos');
    }
    
    if (!password || password.length < 6) {
      throw new Error('Senha deve ter pelo menos 6 caracteres');
    }
    
    if (password !== confirmPassword) {
      throw new Error('Senhas não coincidem');
    }
    
    // Buscar dados de verificação pendente
    const pendingVerifications = getPendingVerifications();
    const pendingIndex = pendingVerifications.findIndex(pending => 
      pending.userData.cpf === cpf.replace(/\D/g, '') && 
      pending.verificationCode === verificationCode
    );
    
    if (pendingIndex === -1) {
      throw new Error('Código de verificação inválido ou expirado');
    }
    
    const pendingData = pendingVerifications[pendingIndex];
    
    // Verificar se não expirou
    if (new Date() > new Date(pendingData.expiresAt)) {
      // Remover verificação expirada
      pendingVerifications.splice(pendingIndex, 1);
      savePendingVerifications(pendingVerifications);
      throw new Error('Código de verificação expirado. Solicite um novo código.');
    }
    
    // Criar usuário
    const users = getUsers();
    const newUser = {
      id: Date.now().toString(),
      ...pendingData.userData,
      password: password, // Em produção, seria hasheada
      createdAt: new Date().toISOString(),
      isActive: true
    };
    
    users.push(newUser);
    saveUsers(users);
    
    // Remover verificação pendente
    pendingVerifications.splice(pendingIndex, 1);
    savePendingVerifications(pendingVerifications);
    
    // Retornar dados do usuário (sem senha)
    const { password: _, ...userWithoutPassword } = newUser;
    
    return {
      success: true,
      message: 'Conta criada com sucesso! Você já pode fazer login.',
      user: userWithoutPassword
    };
  },

  // Login
  async login(loginData) {
    await delay(1000); // Simular delay de rede
    
    const { cpf, password } = loginData;
    
    if (!cpf || !password) {
      throw new Error('CPF e senha são obrigatórios');
    }
    
    const cleanedCpf = cpf.replace(/\D/g, ''); // Limpa o CPF recebido
    
    const users = getUsers();
    const user = users.find(u => 
      u.cpf === cleanedCpf && // Compara com o CPF limpo
      u.password === password && 
      u.isActive
    );
    
    if (!user) {
      throw new Error('CPF ou senha incorretos');
    }
    
    // Retornar dados do usuário (sem senha)
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      success: true,
      message: 'Login realizado com sucesso',
      user: userWithoutPassword
    };
  },

  // Reenviar código de verificação
  async resendVerificationCode(cpf) {
    await delay(1000); // Simular delay de rede
    
    const pendingVerifications = getPendingVerifications();
    const pendingIndex = pendingVerifications.findIndex(pending => 
      pending.userData.cpf === cpf.replace(/\D/g, '')
    );
    
    if (pendingIndex === -1) {
      throw new Error('Nenhuma verificação pendente encontrada para este CPF');
    }
    
    // Gerar novo código
    const newCode = generateVerificationCode();
    pendingVerifications[pendingIndex].verificationCode = newCode;
    pendingVerifications[pendingIndex].expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    
    savePendingVerifications(pendingVerifications);
    
    const verificationMethod = pendingVerifications[pendingIndex].verificationMethod;
    
    // Simular envio do código
    console.log(`Novo código de verificação enviado via ${verificationMethod}:`, newCode);
    
    return {
      success: true,
      message: `Novo código enviado para ${verificationMethod === 'email' ? 'seu e-mail' : 'seu WhatsApp'}.`
    };
  },

  // Verificar se usuário existe
  async checkUserExists(cpf, email) {
    await delay(500); // Simular delay de rede
    
    const users = getUsers();
    const existingUser = users.find(user => 
      user.cpf === cpf.replace(/\D/g, '') || user.email === email
    );
    
    return {
      exists: !!existingUser,
      user: existingUser ? { cpf: existingUser.cpf, email: existingUser.email } : null
    };
  },

  // Criar usuário de teste se não existir
  async createTestUser() {
    const testCpf = '11111111111';
    const testEmail = 'teste@example.com';
    const testPassword = 'password';
    const testNome = 'Usuário Teste';
    const testTelefone = '61987654321';

    const users = getUsers();
    const existingTestUser = users.find(user => user.cpf === testCpf);

    if (!existingTestUser) {
      const newUser = {
        id: 'test-user-id',
        nome: testNome,
        cpf: testCpf,
        email: testEmail,
        telefone: testTelefone,
        emailNotifications: true,
        whatsappNotifications: true,
        isWhatsapp: true,
        password: testPassword, // Em produção, seria hasheada
        createdAt: new Date().toISOString(),
        isActive: true
      };
      users.push(newUser);
      saveUsers(users);
      console.log('Usuário de teste criado:', newUser);
    }
    return { cpf: testCpf, password: testPassword };
  }
};

export default authService;