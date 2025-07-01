// Sistema de autenticação fictício para testes
export interface User {
  id: string;
  email: string;
  user_type: 'athlete' | 'club';
}

export interface Profile extends User {
  // Campos para atletas
  first_name?: string;
  last_name?: string;
  nickname?: string;
  birth_date?: string;
  gender?: string;
  location?: string;
  bio?: string;
  sports?: string[];
  rackets?: string[];
  instagram?: string;
  twitter?: string;
  tiktok?: string;
  profile_image_url?: string;
  
  // Campos para clubes
  club_name?: string;
  fantasy_name?: string;
  cnpj?: string;
  phone?: string;
  city?: string;
  state?: string;
  full_address?: string;
  description?: string;
  facilities?: Record<string, boolean>;
}

// Usuários fictícios para teste
const mockUsers: Record<string, { user: User; profile: Profile }> = {
  'atleta@teste.com': {
    user: {
      id: '1',
      email: 'atleta@teste.com',
      user_type: 'athlete'
    },
    profile: {
      id: '1',
      email: 'atleta@teste.com',
      user_type: 'athlete',
      first_name: 'João',
      last_name: 'Silva',
      nickname: 'Joãozinho',
      location: 'São Paulo, SP',
      bio: 'Jogador de padel apaixonado pelo esporte.',
      sports: ['Padel'],
      rackets: ['Nox']
    }
  },
  'clube@teste.com': {
    user: {
      id: '2',
      email: 'clube@teste.com',
      user_type: 'club'
    },
    profile: {
      id: '2',
      email: 'clube@teste.com',
      user_type: 'club',
      club_name: 'Clube Elite Padel',
      fantasy_name: 'Elite Padel',
      cnpj: '12345678000190',
      phone: '11999999999',
      city: 'São Paulo',
      state: 'SP',
      description: 'O melhor clube de padel da região.',
      facilities: {
        parking: true,
        lockers: true,
        bar: true,
        restaurant: false,
        kidsArea: true
      }
    }
  }
};

export const signIn = async (email: string, password: string) => {
  // Simular delay de rede
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const userData = mockUsers[email.toLowerCase()];
  if (!userData) {
    throw new Error('Email ou senha incorretos');
  }
  
  // Salvar no localStorage
  localStorage.setItem('currentUser', JSON.stringify(userData.user));
  localStorage.setItem('currentProfile', JSON.stringify(userData.profile));
  localStorage.setItem('isAuthenticated', 'true');
  
  return { user: userData.user, profile: userData.profile };
};

export const signUp = async (email: string, password: string, userData: any) => {
  // Simular delay de rede
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (mockUsers[email.toLowerCase()]) {
    throw new Error('Este email já está cadastrado');
  }
  
  // Criar novo usuário fictício
  const newUser: User = {
    id: Date.now().toString(),
    email: email.toLowerCase(),
    user_type: userData.user_type
  };
  
  const newProfile: Profile = {
    ...newUser,
    ...userData
  };
  
  // Salvar no localStorage
  localStorage.setItem('currentUser', JSON.stringify(newUser));
  localStorage.setItem('currentProfile', JSON.stringify(newProfile));
  localStorage.setItem('isAuthenticated', 'true');
  
  return { user: newUser, profile: newProfile };
};

export const signOut = async () => {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('currentProfile');
  localStorage.removeItem('isAuthenticated');
};

export const getCurrentUser = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  if (!isAuthenticated) return null;
  
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
};

export const getCurrentProfile = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  if (!isAuthenticated) return null;
  
  const profileStr = localStorage.getItem('currentProfile');
  return profileStr ? JSON.parse(profileStr) : null;
};

export const updateProfile = async (updates: Partial<Profile>) => {
  const currentProfile = getCurrentProfile();
  if (!currentProfile) throw new Error('Usuário não autenticado');
  
  const updatedProfile = { ...currentProfile, ...updates };
  localStorage.setItem('currentProfile', JSON.stringify(updatedProfile));
  
  return updatedProfile;
};