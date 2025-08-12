import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  User, 
  ChevronDown,
  Users,
  Settings,
  LogOut,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { BubbleLogo } from './Hero';

const DashboardHeader: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDashboardMenuOpen, setIsDashboardMenuOpen] = useState(false);
  const [isTournamentsMenuOpen, setIsTournamentsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  // Check if user is a club
  const isClub = profile?.user_type === 'club';

  const dashboardMenuRef = useRef<HTMLDivElement>(null);
  const tournamentsMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dashboardMenuRef.current && 
        !dashboardMenuRef.current.contains(event.target as Node)
      ) {
        setIsDashboardMenuOpen(false);
      }
      if (
        tournamentsMenuRef.current && 
        !tournamentsMenuRef.current.contains(event.target as Node)
      ) {
        setIsTournamentsMenuOpen(false);
      }
      if (
        profileMenuRef.current && 
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
      if (
        notificationsRef.current && 
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleSettingsClick = () => {
    setIsProfileMenuOpen(false);
    navigate('/settings');
  };

  const handleLogoClick = () => {
    // Go to appropriate dashboard based on user type
    if (isClub) {
      navigate('/club-dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const handleDashboardClick = () => {
    setIsDashboardMenuOpen(false);
    if (isClub) {
      navigate('/club-dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const handleProfileClick = () => {
    setIsProfileMenuOpen(false);
    if (isClub) {
      navigate('/club-profile');
    } else {
      navigate('/profile');
    }
  };

  const mockNotifications = [
    {
      id: 1,
      title: isClub ? 'Nova inscrição recebida' : 'Novo torneio disponível',
      message: isClub ? 'Um atleta se inscreveu no seu torneio' : 'Um novo torneio foi aberto em sua região',
      time: '5 min atrás',
      unread: true
    },
    {
      id: 2,
      title: isClub ? 'Torneio aprovado' : 'Resultado atualizado',
      message: isClub ? 'Seu torneio foi aprovado e está visível' : 'Os resultados do último torneio foram atualizados',
      time: '1 hora atrás',
      unread: true
    },
    {
      id: 3,
      title: isClub ? 'Pagamento processado' : 'Lembrete de inscrição',
      message: isClub ? 'Pagamento de inscrição foi processado' : 'As inscrições para o torneio encerram em 2 dias',
      time: '2 horas atrás',
      unread: true
    }
  ];

  return (
    <header className="bg-white shadow-lg fixed w-full z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button 
              onClick={handleLogoClick}
              className="flex items-center group"
            >
              <div className="relative mr-3">
                <BubbleLogo size={28} className="text-accent-500 group-hover:text-primary-900 transition-colors" />
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-primary-900 to-accent-500 bg-clip-text text-transparent">
                Bubble
              </span>
            </button>

            <div className="hidden md:flex items-center ml-10 space-x-8">
              <div 
                className="relative" 
                ref={dashboardMenuRef}
              >
                <button
                  className="flex items-center text-dark-700 hover:text-primary-900 font-medium transition-colors"
                  onClick={() => setIsDashboardMenuOpen(!isDashboardMenuOpen)}
                >
                  Dashboard
                  <ChevronDown size={16} className="ml-1" />
                </button>
                {isDashboardMenuOpen && (
                  <div 
                    className="absolute mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-50 border border-gray-100 animate-fade-in"
                  >
                    <button 
                      onClick={handleDashboardClick}
                      className="block w-full text-left px-4 py-2 text-sm text-dark-700 hover:bg-accent-50 hover:text-primary-900 transition-colors"
                    >
                      {isClub ? 'Painel do Clube' : 'Feed'}
                    </button>
                    {!isClub && (
                      <Link to="/clubs" className="block px-4 py-2 text-sm text-dark-700 hover:bg-accent-50 hover:text-primary-900 transition-colors">
                        Clubes
                      </Link>
                    )}
                    {isClub && (
                      <Link to="/club-analytics" className="block px-4 py-2 text-sm text-dark-700 hover:bg-accent-50 hover:text-primary-900 transition-colors">
                        Relatórios
                      </Link>
                    )}
                  </div>
                )}
              </div>

              <div 
                className="relative" 
                ref={tournamentsMenuRef}
              >
                <button
                  className="flex items-center text-dark-700 hover:text-primary-900 font-medium transition-colors"
                  onClick={() => setIsTournamentsMenuOpen(!isTournamentsMenuOpen)}
                >
                  Torneios
                  <ChevronDown size={16} className="ml-1" />
                </button>
                {isTournamentsMenuOpen && (
                  <div 
                    className="absolute mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-50 border border-gray-100 animate-fade-in"
                  >
                    {isClub ? (
                      <>
                        <Link to="/create-tournament" className="block px-4 py-2 text-sm text-dark-700 hover:bg-accent-50 hover:text-primary-900 transition-colors">
                          Criar Torneio
                        </Link>
                        <Link to="/my-tournaments" className="block px-4 py-2 text-sm text-dark-700 hover:bg-accent-50 hover:text-primary-900 transition-colors">
                          Meus Torneios
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link to="/tournaments/registered" className="block px-4 py-2 text-sm text-dark-700 hover:bg-accent-50 hover:text-primary-900 transition-colors">
                          Inscritos
                        </Link>
                        <Link to="/tournaments/open" className="block px-4 py-2 text-sm text-dark-700 hover:bg-accent-50 hover:text-primary-900 transition-colors">
                          Abertos
                        </Link>
                        <Link to="/tournaments/closed" className="block px-4 py-2 text-sm text-dark-700 hover:bg-accent-50 hover:text-primary-900 transition-colors">
                          Encerrados
                        </Link>
                        <Link to="/tournaments" className="block px-4 py-2 text-sm text-dark-700 hover:bg-accent-50 hover:text-primary-900 transition-colors">
                          Todos
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {!isClub && (
                <Link to="/last-games" className="text-dark-700 hover:text-primary-900 font-medium transition-colors">
                  Últimos Jogos
                </Link>
              )}

              <Link to="/marketplace" className="text-dark-700 hover:text-primary-900 font-medium transition-colors">
                Marketplace
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center" ref={searchRef}>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-dark-600 hover:text-primary-900 transition-colors"
              >
                <Search size={20} />
              </button>
              {isSearchOpen && (
                <input
                  type="text"
                  placeholder="Pesquisar..."
                  className="ml-2 px-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  autoFocus
                />
              )}
            </div>

            <div className="relative flex items-center" ref={notificationsRef}>
              <button 
                className="text-dark-600 hover:text-primary-900 relative transition-colors"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                <Bell size={20} />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {unreadNotifications}
                  </span>
                )}
              </button>
              
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl py-1 z-50 border border-gray-100 animate-fade-in" style={{ top: '100%' }}>
                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold text-dark-800">Notificações</h3>
                      <button 
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        onClick={() => setUnreadNotifications(0)}
                      >
                        Marcar todas como lidas
                      </button>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {mockNotifications.map(notification => (
                      <div 
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-accent-50 cursor-pointer transition-colors ${
                          notification.unread ? 'bg-accent-25' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-sm font-semibold text-dark-900">
                              {notification.title}
                            </h4>
                            <p className="text-sm text-dark-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-dark-500 mt-1">
                              {notification.time}
                            </p>
                          </div>
                          {notification.unread && (
                            <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-200">
                    <button 
                      onClick={() => {
                        setIsNotificationsOpen(false);
                        // Navigate to notifications page or expand view
                        console.log('Ver todas as notificações');
                      }}
                      className="text-sm text-primary-600 hover:text-primary-700 w-full text-center font-medium"
                    >
                      Ver todas as notificações
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center text-dark-600 hover:text-primary-900 transition-colors"
              >
                {profile?.profile_image_url ? (
                  <img 
                    src={profile.profile_image_url} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover border-2 border-accent-500"
                  />
                ) : (
                  <User size={20} />
                )}
                <ChevronDown size={16} className="ml-1" />
              </button>
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-50 border border-gray-100 animate-fade-in">
                  {!isClub && (
                    <Link to="/find-athletes" className="flex items-center px-4 py-2 text-sm text-dark-700 hover:bg-accent-50 hover:text-primary-900 transition-colors">
                      <Users size={16} className="mr-2" />
                      Encontre Atletas
                    </Link>
                  )}
                  <button
                    onClick={handleProfileClick}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-dark-700 hover:bg-accent-50 hover:text-primary-900 transition-colors"
                  >
                    <User size={16} className="mr-2" />
                    {isClub ? 'Perfil do Clube' : 'Meu Perfil'}
                  </button>
                  <button
                    onClick={handleSettingsClick}
                    className="flex items-center w-full px-4 py-2 text-sm text-dark-700 hover:bg-accent-50 hover:text-primary-900 transition-colors"
                  >
                    <Settings size={16} className="mr-2" />
                    Configurações
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-dark-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <LogOut size={16} className="mr-2" />
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;