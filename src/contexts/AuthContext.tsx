import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Profile, getCurrentUser, getCurrentProfile, signOut as authSignOut } from '../lib/auth';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = () => {
    const currentUser = getCurrentUser();
    const currentProfile = getCurrentProfile();
    setUser(currentUser);
    setProfile(currentProfile);
  };

  useEffect(() => {
    // Carregar dados do usuário do localStorage
    refreshProfile();
    setLoading(false);

    // Escutar mudanças no localStorage (para sincronizar entre abas)
    const handleStorageChange = () => {
      refreshProfile();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleSignOut = async () => {
    await authSignOut();
    setUser(null);
    setProfile(null);
  };

  const value = {
    user,
    profile,
    loading,
    signOut: handleSignOut,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};