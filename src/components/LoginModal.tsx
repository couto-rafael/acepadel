import React, { useState, useEffect, useRef } from 'react';
import { X, Mail, Lock, Eye, EyeOff, User, Building2, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signIn, signUp } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'athlete' | 'club' | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Club specific fields
  const [clubData, setClubData] = useState({
    clubName: '',
    cnpj: '',
    phone: ''
  });

  // Athlete specific fields
  const [athleteData, setAthleteData] = useState({
    firstName: '',
    lastName: '',
    phone: ''
  });

  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatCNPJ = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18);
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d)(\d{4})/, '$1 $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 17);
  };

  const validateEmail = (email: string): boolean => {
    // More comprehensive email validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    // Check basic format
    if (!emailRegex.test(email)) {
      return false;
    }
    
    // Additional checks
    const parts = email.split('@');
    if (parts.length !== 2) return false;
    
    const [localPart, domain] = parts;
    
    // Check local part length (before @)
    if (localPart.length === 0 || localPart.length > 64) return false;
    
    // Check domain part
    if (domain.length === 0 || domain.length > 253) return false;
    
    // Check for consecutive dots
    if (email.includes('..')) return false;
    
    // Check if starts or ends with dot
    if (localPart.startsWith('.') || localPart.endsWith('.')) return false;
    
    // Check domain has at least one dot
    if (!domain.includes('.')) return false;
    
    // Check domain doesn't start or end with hyphen
    const domainParts = domain.split('.');
    for (const part of domainParts) {
      if (part.startsWith('-') || part.endsWith('-') || part.length === 0) return false;
    }
    
    return true;
  };

  const sanitizeEmail = (email: string): string => {
    // Remove any invisible characters and normalize
    return email
      .trim()
      .toLowerCase()
      .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width characters
      .replace(/\s+/g, ''); // Remove any whitespace
  };

  const handleClubDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cnpj') {
      formattedValue = formatCNPJ(value);
    } else if (name === 'phone') {
      formattedValue = formatPhone(value);
    }

    setClubData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handleAthleteDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'phone') {
      formattedValue = formatPhone(value);
    }

    setAthleteData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handleUserTypeSelect = (type: 'athlete' | 'club') => {
    setUserType(type);
    setShowForm(true);
  };

  const getErrorMessage = (error: any): string => {
    if (error?.message) {
      // Handle specific Supabase error messages
      if (error.message.includes('Invalid login credentials')) {
        return 'Email ou senha incorretos. Verifique suas credenciais e tente novamente.';
      }
      if (error.message.includes('email_address_invalid') || error.message.includes('Email address') && error.message.includes('invalid')) {
        return 'O formato do email não é válido. Verifique se o email está correto e tente novamente. Exemplo: usuario@exemplo.com';
      }
      if (error.message.includes('User already registered')) {
        return 'Este email já está cadastrado. Tente fazer login ou use outro email.';
      }
      if (error.message.includes('Password should be at least')) {
        return 'A senha deve ter pelo menos 6 caracteres.';
      }
      if (error.message.includes('Email not confirmed')) {
        return 'Email não confirmado. Verifique sua caixa de entrada e confirme seu email.';
      }
      if (error.message.includes('invalid_credentials')) {
        return 'Credenciais inválidas. Verifique seu email e senha e tente novamente.';
      }
      return error.message;
    }
    
    // Handle error objects with code property (Supabase specific)
    if (error?.code) {
      if (error.code === 'email_address_invalid') {
        return 'O formato do email não é válido. Verifique se o email está correto e tente novamente. Exemplo: usuario@exemplo.com';
      }
      if (error.code === 'invalid_credentials') {
        return 'Credenciais inválidas. Verifique seu email e senha e tente novamente.';
      }
      if (error.code === 'user_already_exists') {
        return 'Este email já está cadastrado. Tente fazer login ou use outro email.';
      }
      if (error.code === 'weak_password') {
        return 'A senha deve ter pelo menos 6 caracteres.';
      }
    }
    
    return 'Ocorreu um erro inesperado. Tente novamente.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Sanitize and validate email
      const sanitizedEmail = sanitizeEmail(email);
      const trimmedPassword = password.trim();
      const trimmedConfirmPassword = confirmPassword.trim();

      // Validate email format with enhanced validation
      if (!validateEmail(sanitizedEmail)) {
        throw new Error('Por favor, insira um email válido. Exemplo: usuario@exemplo.com');
      }

      // Additional email format checks
      if (sanitizedEmail.length < 5) {
        throw new Error('Email muito curto. Por favor, insira um email válido.');
      }

      if (sanitizedEmail.length > 254) {
        throw new Error('Email muito longo. Por favor, insira um email válido.');
      }

      // Validate password length
      if (trimmedPassword.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres.');
      }

      if (trimmedPassword.length > 72) {
        throw new Error('A senha não pode ter mais de 72 caracteres.');
      }

      if (!isLogin && trimmedPassword !== trimmedConfirmPassword) {
        throw new Error('As senhas não coincidem');
      }

      if (isLogin) {
        // Login
        console.log('Attempting login with email:', sanitizedEmail);
        const { error } = await signIn(sanitizedEmail, trimmedPassword);
        if (error) {
          console.error('Login error:', error);
          throw error;
        }
        
        await refreshProfile();
        onClose();
        
        // Navigation will be handled by App.tsx based on user type
      } else {
        // Registration - additional validation for signup
        if (!userType) {
          throw new Error('Por favor, selecione o tipo de conta.');
        }

        // Validate required fields based on user type
        if (userType === 'club') {
          if (!clubData.clubName.trim()) {
            throw new Error('Nome do clube é obrigatório.');
          }
          if (!clubData.cnpj.replace(/\D/g, '')) {
            throw new Error('CNPJ é obrigatório.');
          }
          if (clubData.cnpj.replace(/\D/g, '').length !== 14) {
            throw new Error('CNPJ deve ter 14 dígitos.');
          }
          if (!clubData.phone.replace(/\D/g, '')) {
            throw new Error('Telefone é obrigatório.');
          }
        } else {
          if (!athleteData.firstName.trim()) {
            throw new Error('Nome é obrigatório.');
          }
          if (!athleteData.lastName.trim()) {
            throw new Error('Sobrenome é obrigatório.');
          }
          if (!athleteData.phone.replace(/\D/g, '')) {
            throw new Error('Telefone é obrigatório.');
          }
        }

        const userData = {
          user_type: userType,
          email: sanitizedEmail,
          ...(userType === 'club' ? {
            club_name: clubData.clubName.trim(),
            cnpj: clubData.cnpj.replace(/\D/g, ''),
            phone: clubData.phone.replace(/\D/g, '')
          } : {
            first_name: athleteData.firstName.trim(),
            last_name: athleteData.lastName.trim(),
            phone: athleteData.phone.replace(/\D/g, '')
          })
        };

        console.log('Attempting signup with email:', sanitizedEmail);
        const { error } = await signUp(sanitizedEmail, trimmedPassword, userData);
        if (error) {
          console.error('Signup error:', error);
          throw error;
        }

        alert('Conta criada com sucesso! Verifique seu email para confirmar a conta.');
        onClose();
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setClubData({
      clubName: '',
      cnpj: '',
      phone: ''
    });
    setAthleteData({
      firstName: '',
      lastName: '',
      phone: ''
    });
    setUserType(null);
    setShowForm(false);
    setError('');
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const handleBackToUserType = () => {
    setShowForm(false);
    setUserType(null);
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div 
        ref={modalRef} 
        className={`bg-white rounded-2xl p-8 w-full max-w-md relative shadow-2xl border border-gray-100 animate-fade-in ${
          isLogin ? 'max-h-[90vh] overflow-y-auto' : 'max-h-[95vh] overflow-y-auto'
        }`}
        style={{ marginTop: isLogin ? 'auto' : '2rem', marginBottom: isLogin ? 'auto' : '2rem' }}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-dark-400 hover:text-dark-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex items-center justify-center mb-6">
          <div className="relative mr-3">
            <Zap size={32} className="text-accent-500" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary-900 rounded-full animate-pulse"></div>
          </div>
          <span className="text-2xl font-black bg-gradient-to-r from-primary-900 to-accent-500 bg-clip-text text-transparent">
            AcePadel
          </span>
        </div>

        <h2 className="text-2xl font-bold text-dark-800 mb-6 text-center">
          {isLogin ? 'Entrar na plataforma' : 'Criar sua conta'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {!isLogin && !showForm && (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-dark-700 mb-4 text-center">
              Escolha o tipo de conta
            </label>
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => handleUserTypeSelect('athlete')}
                className="w-full flex items-center justify-center p-6 border-2 border-gray-200 rounded-xl transition-all hover:border-primary-300 hover:bg-primary-50 group"
              >
                <User size={48} className="mr-4 text-primary-600 group-hover:text-primary-700" />
                <div className="text-left">
                  <span className="block text-xl font-bold text-dark-800 group-hover:text-primary-900">Atleta</span>
                  <span className="block text-sm text-dark-500">
                    Para jogadores individuais
                  </span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleUserTypeSelect('club')}
                className="w-full flex items-center justify-center p-6 border-2 border-gray-200 rounded-xl transition-all hover:border-primary-300 hover:bg-primary-50 group"
              >
                <Building2 size={48} className="mr-4 text-primary-600 group-hover:text-primary-700" />
                <div className="text-left">
                  <span className="block text-xl font-bold text-dark-800 group-hover:text-primary-900">Clube</span>
                  <span className="block text-sm text-dark-500">
                    Para clubes e organizadores
                  </span>
                </div>
              </button>
            </div>
          </div>
        )}

        {(isLogin || showForm) && (
          <>
            {!isLogin && showForm && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={handleBackToUserType}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    ← Voltar
                  </button>
                  <div className="flex items-center">
                    {userType === 'athlete' ? (
                      <>
                        <User size={20} className="text-primary-600 mr-2" />
                        <span className="text-sm font-semibold text-primary-700">Conta de Atleta</span>
                      </>
                    ) : (
                      <>
                        <Building2 size={20} className="text-primary-600 mr-2" />
                        <span className="text-sm font-semibold text-primary-700">Conta de Clube</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && showForm && userType === 'club' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-dark-700 mb-1">
                      Nome do Clube
                    </label>
                    <input
                      type="text"
                      name="clubName"
                      value={clubData.clubName}
                      onChange={handleClubDataChange}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      placeholder="Nome do seu clube"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark-700 mb-1">
                      CNPJ
                    </label>
                    <input
                      type="text"
                      name="cnpj"
                      value={clubData.cnpj}
                      onChange={handleClubDataChange}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      placeholder="00.000.000/0000-00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark-700 mb-1">
                      Telefone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={clubData.phone}
                      onChange={handleClubDataChange}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      placeholder="(00) 0 0000-0000"
                      required
                    />
                  </div>
                </>
              )}

              {!isLogin && showForm && userType === 'athlete' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-dark-700 mb-1">
                      Nome
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={athleteData.firstName}
                      onChange={handleAthleteDataChange}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      placeholder="Seu nome"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark-700 mb-1">
                      Sobrenome
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={athleteData.lastName}
                      onChange={handleAthleteDataChange}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      placeholder="Seu sobrenome"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark-700 mb-1">
                      Telefone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={athleteData.phone}
                      onChange={handleAthleteDataChange}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      placeholder="(00) 0 0000-0000"
                      required
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-semibold text-dark-700 mb-1">
                  {!isLogin && showForm && userType === 'club' ? 'E-mail do Clube' : 'Email'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-dark-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    placeholder={!isLogin && showForm && userType === 'club' ? 'contato@clube.com' : 'seu@email.com'}
                    required
                    autoComplete="email"
                    spellCheck="false"
                  />
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Use um email válido como: usuario@exemplo.com
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark-700 mb-1">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-dark-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    placeholder="••••••••"
                    required
                    minLength={6}
                    maxLength={72}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-dark-400 hover:text-dark-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Mínimo de 6 caracteres
                </div>
              </div>

              {!isLogin && showForm && (
                <div>
                  <label className="block text-sm font-semibold text-dark-700 mb-1">
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-dark-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      placeholder="••••••••"
                      required
                      minLength={6}
                      maxLength={72}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-dark-400 hover:text-dark-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary-900 to-primary-700 text-white py-3 px-4 rounded-lg hover:from-primary-800 hover:to-primary-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? 'Carregando...' : (
                  isLogin ? 'Entrar' : `Criar Conta ${userType === 'club' ? 'do Clube' : 'de Atleta'}`
                )}
              </button>
            </form>
          </>
        )}

        {(isLogin || (!isLogin && !showForm)) && (
          <div className="mt-6 text-center space-y-2">
            <button
              onClick={handleToggleMode}
              className="text-primary-600 hover:text-primary-700 text-sm font-semibold transition-colors"
            >
              {isLogin
                ? 'Não tem uma conta? Cadastre-se'
                : 'Já tem uma conta? Entre'}
            </button>
            
            {isLogin && (
              <div>
                <a 
                  href="#" 
                  className="text-primary-600 hover:text-primary-700 text-sm font-semibold block transition-colors"
                >
                  Esqueceu sua senha?
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;