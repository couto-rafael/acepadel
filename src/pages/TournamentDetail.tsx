import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
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
  UserCheck,
  Award,
  Play,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import StatusBadge from '../components/StatusBadge';

const TournamentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'informacoes');
  const [tournament, setTournament] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
    { id: 'informacoes', label: 'Informações', icon: Info },
    { id: 'inscritos', label: 'Inscritos', icon: UserCheck },
    { id: 'grupos', label: 'Grupos', icon: Users },
    { id: 'jogos', label: 'Jogos', icon: Trophy },
    { id: 'resultados', label: 'Resultados', icon: Award },
    { id: 'ao-vivo', label: 'Ao Vivo', icon: Play }
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
            <h1 className="text-2xl font-bold text-dark-900 mb-4">Torneio não encontrado</h1>
            <Link to="/tournaments" className="text-primary-600 hover:text-primary-700">
              Voltar para torneios
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'informacoes':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-dark-900 mb-4">Informações Gerais</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className="text-primary-600 mr-3" size={20} />
                    <div>
                      <p className="text-sm text-dark-600">Data</p>
                      <p className="font-semibold text-dark-900">
                        {new Date(tournament.startDate).toLocaleDateString('pt-BR')} - {new Date(tournament.endDate).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="text-primary-600 mr-3" size={20} />
                    <div>
                      <p className="text-sm text-dark-600">Local</p>
                      <p className="font-semibold text-dark-900">{tournament.mainClub}</p>
                      <p className="text-sm text-dark-600">{tournament.city}, {tournament.state}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <DollarSign className="text-primary-600 mr-3" size={20} />
                    <div>
                      <p className="text-sm text-dark-600">Taxa de Inscrição</p>
                      <p className="font-semibold text-dark-900">R$ {tournament.registrationFee?.toFixed(2) || '0,00'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Users className="text-primary-600 mr-3" size={20} />
                    <div>
                      <p className="text-sm text-dark-600">Participantes</p>
                      <p className="font-semibold text-dark-900">
                        {tournament.participantsCount || 0}
                        {tournament.hasParticipantLimit && tournament.maxParticipants ? ` / ${tournament.maxParticipants}` : ''}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Trophy className="text-primary-600 mr-3" size={20} />
                    <div>
                      <p className="text-sm text-dark-600">Categorias</p>
                      <p className="font-semibold text-dark-900">{tournament.categories?.length || 0} categorias</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="text-primary-600 mr-3" size={20} />
                    <div>
                      <p className="text-sm text-dark-600">Status</p>
                      <StatusBadge status={tournament.status || 'scheduled'} />
                    </div>
                  </div>
                </div>
              </div>
              
              {tournament.description && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-dark-900 mb-2">Descrição</h3>
                  <p className="text-dark-700 leading-relaxed">{tournament.description}</p>
                </div>
              )}
              
              {tournament.categories && tournament.categories.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-dark-900 mb-3">Categorias</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {tournament.categories.map((category: string, index: number) => (
                      <span key={index} className="bg-primary-100 text-primary-700 px-3 py-2 rounded-lg text-sm font-medium text-center">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
        
      case 'inscritos':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-dark-900 mb-4">Participantes Inscritos</h2>
            <div className="text-center py-12">
              <Users className="mx-auto text-gray-300 mb-4" size={64} />
              <h3 className="text-lg font-medium text-dark-900 mb-2">Nenhum participante inscrito ainda</h3>
              <p className="text-dark-500">As inscrições serão exibidas aqui quando disponíveis.</p>
            </div>
          </div>
        );
        
      case 'grupos':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-dark-900 mb-4">Grupos</h2>
            <div className="text-center py-12">
              <Users className="mx-auto text-gray-300 mb-4" size={64} />
              <h3 className="text-lg font-medium text-dark-900 mb-2">Grupos não definidos</h3>
              <p className="text-dark-500">Os grupos serão criados após o fechamento das inscrições.</p>
            </div>
          </div>
        );
        
      case 'jogos':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-dark-900 mb-4">Jogos</h2>
            <div className="text-center py-12">
              <Trophy className="mx-auto text-gray-300 mb-4" size={64} />
              <h3 className="text-lg font-medium text-dark-900 mb-2">Nenhum jogo agendado</h3>
              <p className="text-dark-500">Os jogos aparecerão aqui quando o torneio começar.</p>
            </div>
          </div>
        );
        
      case 'resultados':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-dark-900 mb-4">Resultados</h2>
            <div className="text-center py-12">
              <Award className="mx-auto text-gray-300 mb-4" size={64} />
              <h3 className="text-lg font-medium text-dark-900 mb-2">Nenhum resultado disponível</h3>
              <p className="text-dark-500">Os resultados serão exibidos conforme os jogos forem concluídos.</p>
            </div>
          </div>
        );
        
      case 'ao-vivo':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-dark-900 mb-4">Transmissão Ao Vivo</h2>
            <div className="text-center py-12">
              <Play className="mx-auto text-gray-300 mb-4" size={64} />
              <h3 className="text-lg font-medium text-dark-900 mb-2">Nenhuma transmissão ativa</h3>
              <p className="text-dark-500">As transmissões ao vivo aparecerão aqui durante os jogos.</p>
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
        {/* Tournament Header */}
        <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-dark-900 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-black text-white mb-4">
                {tournament.name}
              </h1>
              <div className="flex items-center justify-center space-x-6 text-gray-200">
                <div className="flex items-center">
                  <Calendar size={18} className="mr-2" />
                  <span>{new Date(tournament.startDate).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center">
                  <MapPin size={18} className="mr-2" />
                  <span>{tournament.city}, {tournament.state}</span>
                </div>
                <div className="flex items-center">
                  <Users size={18} className="mr-2" />
                  <span>{tournament.participantsCount || 0} inscritos</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
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

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default TournamentDetail;