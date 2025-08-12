import React, { useState } from 'react';
import { Menu, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './LoginModal';
import { BubbleLogo } from './Hero';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;

  // If user is logged in, don't show this navbar - use DashboardHeader instead
  if (user) {
    return null;
  }

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleLogoClick = () => {
    // Always go to home page when clicking logo
    navigate('/');
  };
  
  return (
    <>
      <nav className="bg-white shadow-lg fixed w-full z-[100] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button 
                onClick={handleLogoClick}
                className="flex items-center font-black text-xl text-primary-900 hover:text-accent-500 transition-colors"
              >
                <div className="relative mr-3">
                  <BubbleLogo size={32} className="text-accent-500" />
                </div>
                <span className="bg-gradient-to-r from-primary-900 to-accent-500 bg-clip-text text-transparent">
                  Bubble
                </span>
              </button>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className={`${isActive('/') ? 'text-primary-900 font-semibold' : 'text-dark-600'} hover:text-primary-900 font-medium transition-colors`}
              >
                Home
              </Link>
              <Link 
                to="/tournaments" 
                className={`${isActive('/tournaments') ? 'text-primary-900 font-semibold' : 'text-dark-600'} hover:text-primary-900 font-medium transition-colors`}
              >
                Torneios
              </Link>
              <a href="#" className="text-dark-600 hover:text-primary-900 font-medium transition-colors">Clubes</a>
              <Link 
                to="/contact" 
                className={`${isActive('/contact') ? 'text-primary-900 font-semibold' : 'text-dark-600'} hover:text-primary-900 font-medium transition-colors`}
              >
                Contato
              </Link>
              
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center text-dark-600 hover:text-primary-900 transition-colors"
                  >
                    <User size={24} />
                  </button>
                  
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 border border-gray-100 animate-fade-in">
                      <Link
                        to={profile?.user_type === 'club' ? '/club-dashboard' : '/dashboard'}
                        className="block px-4 py-2 text-sm text-dark-700 hover:bg-accent-50 hover:text-primary-900 transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to={profile?.user_type === 'club' ? '/club-profile' : '/profile'}
                        className="block px-4 py-2 text-sm text-dark-700 hover:bg-accent-50 hover:text-primary-900 transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Perfil
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-dark-700 hover:bg-accent-50 hover:text-primary-900 transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Configurações
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-dark-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        Sair
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="bg-gradient-to-r from-primary-900 to-primary-700 text-white px-6 py-2 rounded-lg hover:from-primary-800 hover:to-primary-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Entrar
                </button>
              )}
            </div>
            
            {/* Mobile Navigation Toggle */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-dark-600 hover:text-primary-900 focus:outline-none transition-colors"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden bg-white pt-2 pb-4 px-4 shadow-inner border-t border-gray-100 animate-slide-up">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className={`${isActive('/') ? 'text-primary-900 font-semibold' : 'text-dark-600'} hover:text-primary-900 font-medium transition-colors`}
              >
                Home
              </Link>
              <Link 
                to="/tournaments" 
                className={`${isActive('/tournaments') ? 'text-primary-900 font-semibold' : 'text-dark-600'} hover:text-primary-900 font-medium transition-colors`}
              >
                Torneios
              </Link>
              <a href="#" className="text-dark-600 hover:text-primary-900 font-medium transition-colors">Clubes</a>
              <Link 
                to="/contact" 
                className={`${isActive('/contact') ? 'text-primary-900 font-semibold' : 'text-dark-600'} hover:text-primary-900 font-medium transition-colors`}
              >
                Contato
              </Link>
              
              {user ? (
                <>
                  <Link
                    to={profile?.user_type === 'club' ? '/club-dashboard' : '/dashboard'}
                    className="text-dark-600 hover:text-primary-900 font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to={profile?.user_type === 'club' ? '/club-profile' : '/profile'}
                    className="text-dark-600 hover:text-primary-900 font-medium transition-colors"
                  >
                    Perfil
                  </Link>
                  <Link
                    to="/settings"
                    className="text-dark-600 hover:text-primary-900 font-medium transition-colors"
                  >
                    Configurações
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-dark-600 hover:text-red-600 font-medium text-left transition-colors"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="bg-gradient-to-r from-primary-900 to-primary-700 text-white py-3 rounded-lg hover:from-primary-800 hover:to-primary-600 transition-all duration-300 w-full font-semibold"
                >
                  Entrar
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};

export default Navbar;