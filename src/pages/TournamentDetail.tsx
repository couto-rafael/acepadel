import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DashboardHeader from '../components/DashboardHeader';
import StatusBadge from '../components/StatusBadge';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Trophy, 
  DollarSign, 
  Clock, 
  Building2,
  Edit2,
  UserPlus,
  Share2,
  Heart,
  Star,
  Award,
  Target,
  Zap
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const TournamentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [tournament, setTournament] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'info');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // Load tournament from localStorage
      const clubTournaments = JSON.parse(localStorage.getItem('clubTournaments') || '[]');
      const foundTournament = clubTournaments.find((t: any) => t.id === id);
      
      if (foundTournament) {
        setTournament(foundTournament);
      }
      setLoading(false);
    }
  }, [id]);

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
            <Trophy className="mx-auto text-gray-300 mb-4" size={64} />
            <h2 className="text-2xl font-bold text-dark-900 mb-2">Torneio não encontrado</h2>
            <p className="text-dark-600">O torneio que você está procurando não existe ou foi removido.</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if current user is the tournament owner
  const isOwner = user && profile && profile.user_type === 'club' && tournament.clubId === profile.id;
  const isAthlete = user && profile && profile.user_type === 'athlete';

  const handleEditTournament = () => {
    navigate(`/edit-tournament/${tournament.id}`);
  };

  const handleRegisterTournament = () => {
    // Handle tournament registration
    alert('Funcionalidade de inscrição será implementada em breve!');
  };

  const tabs = [
    { id: 'info', label: 'Informações', icon: Trophy },
    { id: 'inscritos', label: 'Inscritos', icon: Users },
    { id: 'chaves', label: 'Chaves', icon: Target },
    { id: 'resultados', label: 'Resultados', icon: Award }
  ];

  const mockParticipants = [
    { id: 1, name: 'João Silva', partner: 'Pedro Santos', category: 'Open Masculina', avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg' },
    { id: 2, name: 'Maria Costa', partner: 'Ana Lima', category: 'Open Feminina', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg' },
    { id: 3, name: 'Carlos Oliveira', partner: 'Rafael Dias', category: '2ª Masculina', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg' },
    { id: 4, name: 'Julia Rocha', partner: 'Camila Souza', category: '2ª Feminina', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <div className="space-y-8">
            {/* Tournament Details */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-dark-900 mb-6">Detalhes do Torneio</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className="text-primary-600 mr-3" size={20} />
                    <div>
                      <p className="text-sm text-dark-500">Data de Início</p>
                      <p className="font-semibold text-dark-900">
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
                      <p className="font-semibold text-dark-900">
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
                      <p className="font-semibold text-dark-900">
                        R$ {tournament.registrationFee?.toFixed(2) || '0,00'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Clock className="text-primary-600 mr-3" size={20} />
                    <div>
                      <p className="text-sm text-dark-500">Duração das Partidas</p>
                      <p className="font-semibold text-dark-900">
                        {tournament.matchDuration || '90'} minutos
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <Building2 className="text-primary-600 mr-3" size={20} />
                    <div>
                      <p className="text-sm text-dark-500">Clube Sede</p>
                      <p className="font-semibold text-dark-900">{tournament.mainClub}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Users className="text-primary-600 mr-3" size={20} />
                    <div>
                      <p className="text-sm text-dark-500">Participantes</p>
                      <p className="font-semibold text-dark-900">
                        {tournament.participantsCount || 0}
                        {tournament.hasParticipantLimit && tournament.maxParticipants 
                          ? ` / ${tournament.maxParticipants}` 
                          : ''} inscritos
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Trophy className="text-primary-600 mr-3" size={20} />
                    <div>
                      <p className="text-sm text-dark-500">Categorias</p>
                      <p className="font-semibold text-dark-900">
                        {tournament.categories?.length || 0} categorias
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Target className="text-primary-600 mr-3" size={20} />
                    <div>
                      <p className="text-sm text-dark-500">Quadras</p>
                      <p className="font-semibold text-dark-900">
                        {tournament.courts?.length || 0} quadras
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {tournament.description && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-2xl font-bold text-dark-900 mb-4">Descrição</h2>
                <p className="text-dark-700 leading-relaxed">{tournament.description}</p>
              </div>
            )}

            {/* Categories */}
            {tournament.categories && tournament.categories.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-2xl font-bold text-dark-900 mb-4">Categorias</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {tournament.categories.map((category: string, index: number) => (
                    <div key={index} className="bg-primary-50 border border-primary-200 rounded-lg p-3 text-center">
                      <span className="text-primary-700 font-semibold text-sm">{category}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Courts */}
            {tournament.courts && tournament.courts.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-2xl font-bold text-dark-900 mb-4">Quadras</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {tournament.courts.map((court: any, index: number) => (
                    <div key={index} className="bg-accent-50 border border-accent-200 rounded-lg p-3 text-center">
                      <span className="text-accent-700 font-semibold text-sm">{court.name}</span>
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
              <h2 className="text-2xl font-bold text-dark-900">Participantes Inscritos</h2>
              <p className="text-dark-600 mt-1">{mockParticipants.length} duplas inscritas</p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {mockParticipants.map(participant => (
                  <div key={participant.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <img
                        src={participant.avatar}
                        alt={participant.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-dark-900">
                          {participant.name} & {participant.partner}
                        </h3>
                        <p className="text-sm text-dark-600">{participant.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-accent-100 text-accent-800 px-3 py-1 rounded-full text-sm font-medium">
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
            <div className="text-center py-12">
              <Target className="mx-auto text-gray-300 mb-4" size={64} />
              <h3 className="text-lg font-medium text-dark-900 mb-2">Chaves não disponíveis</h3>
              <p className="text-dark-500">
                As chaves serão geradas quando as inscrições forem encerradas.
              </p>
            </div>
          </div>
        );

      case 'resultados':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="text-center py-12">
              <Award className="mx-auto text-gray-300 mb-4" size={64} />
              <h3 className="text-lg font-medium text-dark-900 mb-2">Resultados não disponíveis</h3>
              <p className="text-dark-500">
                Os resultados aparecerão aqui conforme as partidas forem sendo disputadas.
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
        {/* Tournament Banner */}
        <div className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-dark-900 py-16 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 bg-accent-500 rounded-full animate-bounce-slow"></div>
            <div className="absolute top-32 right-20 w-16 h-16 bg-accent-400 rounded-full animate-pulse-slow"></div>
            <div className="absolute bottom-20 left-1/3 w-12 h-12 bg-accent-300 rounded-full animate-bounce"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <StatusBadge status={tournament.status === 'scheduled' ? 'open' : tournament.status} />
                  <div className="flex items-center ml-4 space-x-2">
                    <button className="text-white hover:text-accent-500 transition-colors">
                      <Heart size={20} />
                    </button>
                    <button className="text-white hover:text-accent-500 transition-colors">
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                  {tournament.name}
                </h1>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-gray-200">
                    <div className="flex items-center">
                      <Building2 size={18} className="mr-2 text-accent-500" />
                      <span className="font-medium">{tournament.mainClub}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin size={18} className="mr-2 text-accent-500" />
                      <span>{tournament.city || 'São Paulo'}/{tournament.state || 'SP'}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={18} className="mr-2 text-accent-500" />
                      <span>
                        {new Date(tournament.startDate).toLocaleDateString('pt-BR')} - {new Date(tournament.endDate).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 mt-4 md:mt-0">
                    {isOwner ? (
                      <button
                        onClick={handleEditTournament}
                        className="bg-gradient-to-r from-accent-500 to-accent-400 text-dark-900 px-6 py-3 rounded-lg hover:from-accent-400 hover:to-accent-300 transition-all duration-300 flex items-center font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <Edit2 size={18} className="mr-2" />
                        Editar
                      </button>
                    ) : isAthlete && tournament.status === 'open' ? (
                      <button
                        onClick={handleRegisterTournament}
                        className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-3 rounded-lg hover:from-primary-500 hover:to-primary-400 transition-all duration-300 flex items-center font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <UserPlus size={18} className="mr-2" />
                        Inscrever-se
                      </button>
                    ) : null}
                  </div>
            </div>
          </div>
        </div>

        {/* Tournament Navigation */}
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-dark-500 hover:text-dark-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={18} className="mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default TournamentDetail;