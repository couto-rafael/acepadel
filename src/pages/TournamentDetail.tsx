import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DashboardHeader from '../components/DashboardHeader';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Trophy, 
  Clock,
  DollarSign,
  Info,
  UserPlus,
  Share2,
  Heart,
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { BubbleLogo } from '../components/Hero';

const TournamentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'info';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [tournament, setTournament] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Load tournament data from localStorage
    const clubTournaments = JSON.parse(localStorage.getItem('clubTournaments') || '[]');
    const foundTournament = clubTournaments.find((t: any) => t.id === id);
    
    if (foundTournament) {
      setTournament(foundTournament);
    }
    setLoading(false);
  }, [id]);

  const tabs = [
    { id: 'info', name: 'Informações', icon: Info },
    { id: 'inscritos', name: 'Inscritos', icon: Users },
    { id: 'chaves', name: 'Chaves', icon: Trophy }
  ];

  const mockParticipants = [
    { id: 1, name: 'João Silva', partner: 'Pedro Santos', category: 'Open Masculina', avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg' },
    { id: 2, name: 'Maria Costa', partner: 'Ana Lima', category: 'Open Feminina', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg' },
    { id: 3, name: 'Carlos Rocha', partner: 'Lucas Dias', category: '2ª Masculina', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg' },
    { id: 4, name: 'Julia Alves', partner: 'Camila Souza', category: '2ª Feminina', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg' },
    { id: 5, name: 'Rafael Mendes', partner: 'Bruno Oliveira', category: 'Open Masculina', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg' },
    { id: 6, name: 'Fernanda Lima', partner: 'Patricia Rocha', category: 'Open Feminina', avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-light">
        {user ? <DashboardHeader /> : <Navbar />}
        <div className="pt-16 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-dark-800 mb-4">Torneio não encontrado</h1>
            <p className="text-dark-600">O torneio que você está procurando não existe ou foi removido.</p>
          </div>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <div className="space-y-8">
            {/* Tournament Info */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-dark-800 mb-6">Informações do Torneio</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className="text-primary-600 mr-3" size={20} />
                    <div>
                      <p className="text-sm text-dark-500">Data de Início</p>
                      <p className="font-semibold text-dark-800">
                        {new Date(tournament.startDate).toLocaleDateString('pt-BR', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="text-primary-600 mr-3" size={20} />
                    <div>
                      <p className="text-sm text-dark-500">Data de Término</p>
                      <p className="font-semibold text-dark-800">
                        {new Date(tournament.endDate).toLocaleDateString('pt-BR', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <DollarSign className="text-primary-600 mr-3" size={20} />
                    <div>
                      <p className="text-sm text-dark-500">Taxa de Inscrição</p>
                      <p className="font-semibold text-dark-800">
                        R$ {parseFloat(tournament.registrationFee || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Users className="text-primary-600 mr-3" size={20} />
                    <div>
                      <p className="text-sm text-dark-500">Participantes</p>
                      <p className="font-semibold text-dark-800">
                        {tournament.participantsCount || 0} inscritos
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Trophy className="text-primary-600 mr-3" size={20} />
                    <div>
                      <p className="text-sm text-dark-500">Categorias</p>
                      <p className="font-semibold text-dark-800">
                        {tournament.categories?.length || 0} categorias
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="text-primary-600 mr-3" size={20} />
                    <div>
                      <p className="text-sm text-dark-500">Local</p>
                      <p className="font-semibold text-dark-800">
                        {tournament.mainClub || 'Clube não informado'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {tournament.description && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-dark-800 mb-3">Descrição</h3>
                  <p className="text-dark-600 leading-relaxed">{tournament.description}</p>
                </div>
              )}
            </div>

            {/* Categories */}
            {tournament.categories && tournament.categories.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-2xl font-bold text-dark-800 mb-6">Categorias</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {tournament.categories.map((category: string, index: number) => (
                    <div
                      key={index}
                      className="bg-primary-50 border border-primary-200 rounded-lg p-3 text-center"
                    >
                      <span className="text-primary-700 font-semibold text-sm">{category}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Courts */}
            {tournament.courts && tournament.courts.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-2xl font-bold text-dark-800 mb-6">Quadras</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tournament.courts.map((court: any, index: number) => (
                    <div
                      key={court.id || index}
                      className="bg-accent-50 border border-accent-200 rounded-lg p-4 text-center"
                    >
                      <span className="text-accent-700 font-semibold">{court.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'inscritos':
        return (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-dark-800">Participantes Inscritos</h2>
              <p className="text-dark-600 mt-2">{mockParticipants.length} duplas inscritas</p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {mockParticipants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={participant.avatar}
                        alt={participant.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-dark-800">
                          {participant.name} & {participant.partner}
                        </h3>
                        <p className="text-sm text-dark-600">{participant.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-accent-100 text-accent-700 px-3 py-1 rounded-full text-sm font-medium">
                        Confirmado
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'chaves':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-dark-800 mb-6">Chaves do Torneio</h2>
            <div className="text-center py-12">
              <Trophy className="mx-auto text-gray-300 mb-4" size={64} />
              <h3 className="text-lg font-medium text-dark-900 mb-2">Chaves em Preparação</h3>
              <p className="text-dark-500">
                As chaves serão geradas após o encerramento das inscrições.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-light">
      {user ? <DashboardHeader /> : <Navbar />}
      
      <div className="pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-dark-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <BubbleLogo size={48} className="text-accent-500 mr-4 animate-pulse" />
                <span className="text-accent-500 font-bold text-lg tracking-wide">TORNEIO</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                {tournament.name}
              </h1>
              <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-8">
                {tournament.mainClub || 'Clube organizador'}
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <button className="bg-gradient-to-r from-accent-500 to-accent-400 text-dark-900 hover:from-accent-400 hover:to-accent-300 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center">
                  <UserPlus size={24} className="mr-2" />
                  Inscrever-se
                </button>
                <div className="flex space-x-4">
                  <button className="bg-white bg-opacity-20 text-white hover:bg-opacity-30 p-3 rounded-xl transition-all duration-300">
                    <Heart size={24} />
                  </button>
                  <button className="bg-white bg-opacity-20 text-white hover:bg-opacity-30 p-3 rounded-xl transition-all duration-300">
                    <Share2 size={24} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-dark-500 hover:text-dark-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={18} className="mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {renderTabContent()}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-dark-900 via-primary-900 to-dark-900 text-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-6">
                <div className="relative mr-3">
                  <BubbleLogo size={32} className="text-accent-500" />
                </div>
                <span className="text-2xl font-black bg-gradient-to-r from-white to-accent-500 bg-clip-text text-transparent">
                  Bubble
                </span>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Conectamos atletas e clubes em torneios incríveis. Participe, jogue e evolua com a comunidade.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-accent-500 transition-colors" aria-label="Facebook">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-accent-500 transition-colors" aria-label="Instagram">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-accent-500 transition-colors" aria-label="YouTube">
                  <span className="sr-only">YouTube</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6 text-accent-500">Links Rápidos</h3>
              <ul className="space-y-3">
                <li><a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
                <li><a href="/tournaments" className="text-gray-300 hover:text-white transition-colors">Torneios</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Rankings</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Clubes</a></li>
                <li><a href="/contact" className="text-gray-300 hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-6 text-accent-500">Contato</h3>
              <p className="text-gray-300 mb-2">contato@bubble.com.br</p>
              <p className="text-gray-300 mb-4">(11) 9999-9999</p>
              <p className="text-gray-300">
                Av. Paulista, 1000 - Bela Vista<br />
                São Paulo - SP, 01310-100
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Bubble. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TournamentDetail;