import React, { useState } from 'react';
import { User, Mail, Phone, Shield, Eye, EyeOff, Check, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import LoginForm from './LoginForm';

const AuthFlow = ({ onAuthSuccess, onClose }) => {
  const [currentStep, setCurrentStep] = useState('choice'); // 'choice', 'register', 'verification', 'login'
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    emailNotifications: false,
    whatsappNotifications: false,
    isWhatsapp: false,
    verificationMethod: 'email',
    verificationCode: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Função para formatar CPF
  const formatCPF = (value) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  // Função para formatar telefone
  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  // Validação de CPF
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

  // Validação de email
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Manipulador de mudanças nos inputs
  const handleInputChange = (field, value) => {
    let formattedValue = value;
    
    if (field === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (field === 'telefone') {
      formattedValue = formatPhone(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: formattedValue
    }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Validação do formulário de registro
  const validateRegisterForm = () => {
    const newErrors = {};
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    
    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }
    
    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    } else if (formData.telefone.replace(/\D/g, '').length < 10) {
      newErrors.telefone = 'Telefone inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validação do formulário de verificação
  const validateVerificationForm = () => {
    const newErrors = {};
    
    if (!formData.verificationCode.trim()) {
      newErrors.verificationCode = 'Código de verificação é obrigatório';
    } else if (formData.verificationCode.length !== 6) {
      newErrors.verificationCode = 'Código deve ter 6 dígitos';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submissão do formulário de registro
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateRegisterForm()) return;
    
    setIsLoading(true);
    
    try {
      // Importar o serviço de autenticação
      const { authService } = await import('../services/authService');
      
      // Enviar dados para registro
      const result = await authService.register(formData);
      
      if (result.success) {
        setCurrentStep('verification');
      }
    } catch (error) {
      console.error('Erro ao enviar código:', error);
      setErrors({ general: error.message || 'Erro ao enviar código de verificação. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Submissão do formulário de verificação
  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateVerificationForm()) return;
    
    setIsLoading(true);
    
    try {
      // Importar o serviço de autenticação
      const { authService } = await import('../services/authService');
      
      // Verificar código e criar conta
      const result = await authService.verifyAndCreateAccount({
        cpf: formData.cpf,
        verificationCode: formData.verificationCode,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });
      
      if (result.success) {
        // Sucesso na autenticação
        onAuthSuccess(result.user);
      }
    } catch (error) {
      console.error('Erro na verificação:', error);
      setErrors({ general: error.message || 'Código inválido. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Reenviar código
  const handleResendCode = async () => {
    setIsLoading(true);
    
    try {
      // Importar o serviço de autenticação
      const { authService } = await import('../services/authService');
      
      // Reenviar código
      const result = await authService.resendVerificationCode(formData.cpf);
      
      if (result.success) {
        // Mostrar mensagem de sucesso (você pode adicionar um toast aqui)
        console.log('Código reenviado com sucesso');
      }
    } catch (error) {
      console.error('Erro ao reenviar código:', error);
      setErrors({ general: error.message || 'Erro ao reenviar código. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizar formulário de registro
  const renderRegisterForm = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gdf-gradient">
          Cadastro do Consumidor
        </CardTitle>
        <CardDescription>
          Preencha seus dados para fazer uma denúncia
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          {errors.general && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {errors.general}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="nome"
                type="text"
                placeholder="Digite seu nome completo"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                className={`pl-10 ${errors.nome ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.nome && <p className="text-sm text-red-600">{errors.nome}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <div className="relative">
              <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="cpf"
                type="text"
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={(e) => handleInputChange('cpf', e.target.value)}
                maxLength={14}
                className={`pl-10 ${errors.cpf ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.cpf && <p className="text-sm text-red-600">{errors.cpf}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
            
            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
                id="emailNotifications"
                checked={formData.emailNotifications}
                onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
              />
              <Label htmlFor="emailNotifications" className="text-sm text-gray-600">
                Aceito receber informações e notícias por e-mail
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="telefone"
                type="text"
                placeholder="(00) 00000-0000"
                value={formData.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                maxLength={15}
                className={`pl-10 ${errors.telefone ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.telefone && <p className="text-sm text-red-600">{errors.telefone}</p>}
            
            <div className="space-y-2 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isWhatsapp"
                  checked={formData.isWhatsapp}
                  onCheckedChange={(checked) => handleInputChange('isWhatsapp', checked)}
                />
                <Label htmlFor="isWhatsapp" className="text-sm text-gray-600">
                  Este telefone é WhatsApp
                </Label>
              </div>
              
              {formData.isWhatsapp && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="whatsappNotifications"
                    checked={formData.whatsappNotifications}
                    onCheckedChange={(checked) => handleInputChange('whatsappNotifications', checked)}
                  />
                  <Label htmlFor="whatsappNotifications" className="text-sm text-gray-600">
                    Aceito receber informativos e notícias por WhatsApp
                  </Label>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Como deseja receber o código de confirmação?</Label>
            <RadioGroup
              value={formData.verificationMethod}
              onValueChange={(value) => handleInputChange('verificationMethod', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="email-method" />
                <Label htmlFor="email-method">Por e-mail</Label>
              </div>
              {formData.isWhatsapp && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="whatsapp" id="whatsapp-method" />
                  <Label htmlFor="whatsapp-method">Por WhatsApp</Label>
                </div>
              )}
            </RadioGroup>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep('choice')}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Enviando...' : 'Continuar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  // Renderizar formulário de verificação
  const renderVerificationForm = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gdf-gradient">
          Verificação e Senha
        </CardTitle>
        <CardDescription>
          Digite o código enviado por {formData.verificationMethod === 'email' ? 'e-mail' : 'WhatsApp'} e crie sua senha
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerificationSubmit} className="space-y-4">
          {errors.general && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {errors.general}
            </div>
          )}

          <div className="space-y-2">
            <Label>CPF (Login)</Label>
            <Input
              type="text"
              value={formData.cpf}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="verificationCode">Código de Verificação</Label>
            <Input
              id="verificationCode"
              type="text"
              placeholder="000000"
              value={formData.verificationCode}
              onChange={(e) => handleInputChange('verificationCode', e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              className={`text-center text-lg tracking-widest ${errors.verificationCode ? 'border-red-500' : ''}`}
            />
            {errors.verificationCode && <p className="text-sm text-red-600">{errors.verificationCode}</p>}
            
            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={handleResendCode}
                disabled={isLoading}
                className="text-sm"
              >
                Reenviar código
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Criar Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`pr-10 ${errors.password ? 'border-red-500' : ''}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Digite a senha novamente"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep('register')}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isLoading ? 'Verificando...' : 'Finalizar Cadastro'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  // Renderizar tela de escolha inicial
  const renderChoiceScreen = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gdf-gradient">
          Acesso ao Sistema
        </CardTitle>
        <CardDescription>
          Escolha uma opção para continuar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={() => setCurrentStep('login')}
          className="w-full bg-blue-600 hover:bg-blue-700 h-12"
        >
          <User className="w-5 h-5 mr-2" />
          Já tenho uma conta - Fazer Login
        </Button>
        
        <Button
          onClick={() => setCurrentStep('register')}
          variant="outline"
          className="w-full h-12"
        >
          <Shield className="w-5 h-5 mr-2" />
          Primeira vez - Criar Conta
        </Button>
        
        <Button
          onClick={onClose}
          variant="ghost"
          className="w-full"
        >
          Cancelar
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md">
        {currentStep === 'choice' && renderChoiceScreen()}
        {currentStep === 'login' && (
          <LoginForm
            onLoginSuccess={onAuthSuccess}
            onSwitchToRegister={() => setCurrentStep('register')}
            onClose={() => setCurrentStep('choice')}
          />
        )}
        {currentStep === 'register' && renderRegisterForm()}
        {currentStep === 'verification' && renderVerificationForm()}
      </div>
    </div>
  );
};

export default AuthFlow;
