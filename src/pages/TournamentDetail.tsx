import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DashboardHeader from '../components/DashboardHeader';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Trophy, 
  DollarSign, 
  Clock, 
  Share2, 
  Heart,
  Info,
  UserCheck,
  Award,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import StatusBadge from '../components/StatusBadge';
import { Tournament, TournamentStatus } from '../types';

const TournamentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'info';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [tournamentData, setTournamentData] = useState<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      // Get tournament data from localStorage (created by clubs)
      const clubTournaments = JSON.parse(localStorage.getItem('clubTournaments') || '[]');
      const foundTournament = clubTournaments.find((t: any) => t.id === id);
      
      if (foundTournament) {
        // Convert to Tournament format for display
        const convertedTournament: Tournament = {
          id: foundTournament.id,
          name: foundTournament.name,
          club: foundTournament.mainClub || 'Clube',
          location: {
            city: foundTournament.city || 'São Paulo',
            state: foundTournament.state || 'SP'
          },
          date: foundTournament.startDate,
          status: foundTournament.status === 'scheduled' ? 'open' : foundTournament.status,
          participantsCount: foundTournament.participantsCount || 0
        };
        
        setTournament(convertedTournament);
        setTournamentData(foundTournament);
      }
    }
  }, [id]);

  if (!tournament || !tournamentData) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'info', name: 'Informações', icon: Info },
    { id: 'inscritos', name: 'Inscritos', icon: UserCheck },
    { id: 'resultados', name: 'Resultados', icon: Award },
    { id: 'estatisticas', name: 'Estatísticas', icon: BarChart3 }
  ];

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  const canRegister = tournament.status === 'open';

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-dark-900 mb-3">Sobre o Torneio</h3>
              <p className="text-dark-600 leading-relaxed">
                {tournamentData.description || 'Descrição não disponível.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-dark-900 mb-2">Detalhes</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-dark-600">
                    <Calendar size={16} className="mr-2 text-primary-600" />
                    <span>{formatDate(tournament.date)} - {formatDate(tournamentData.endDate)}</span>
                  </div>
                  <div className="flex items-center text-dark-600">
                    <MapPin size={16} className="mr-2 text-primary-600" />
                    <span>{tournament.location.city}, {tournament.location.state}</span>
                  </div>
                  <div className="flex items-center text-dark-600">
                    <DollarSign size={16} className="mr-2 text-primary-600" />
                    <span>R$ {tournamentData.registrationFee?.toFixed(2) || '0,00'}</span>
                  </div>
                  <div className="flex items-center text-dark-600">
                    <Clock size={16} className="mr-2 text-primary-600" />
                    <span>{tournamentData.matchDuration || '90'} min por partida</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-dark-900 mb-2">Categorias</h4>
                <div className="flex flex-wrap gap-2">
                  {tournamentData.categories?.map((category: string, index: number) => (
                    <span key={index} className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {tournamentData.courts && tournamentData.courts.length > 0 && (
              <div>
                <h4 className="font-semibold text-dark-900 mb-2">Quadras</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {tournamentData.courts.map((court: any, index: number) => (
                    <div key={index} className="bg-accent-50 text-accent-700 px-3 py-2 rounded-lg text-sm font-medium text-center">
                      {court.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tournamentData.sponsors && tournamentData.sponsors.length > 0 && (
              <div>
                <h4 className="font-semibold text-dark-900 mb-3">Patrocinadores</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {tournamentData.sponsors.map((sponsor: any) => (
                    <div key={sponsor.id} className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                      <img
                        src={sponsor.image}
                        alt={sponsor.name}
                        className="h-12 object-contain mx-auto mb-2"
                      />
                      <p className="text-sm font-medium text-dark-700">{sponsor.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'inscritos':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-dark-900">
                Participantes Inscritos ({tournament.participantsCount})
              </h3>
              {tournamentData.hasParticipantLimit && (
                <div className="text-sm text-dark-600">
                  {tournament.participantsCount} / {tournamentData.maxParticipants} inscritos
                </div>
              )}
            </div>

            {tournament.participantsCount === 0 ? (
              <div className="text-center py-12">
                <Users className="mx-auto text-gray-300 mb-4" size={48} />
                <h4 className="text-lg font-medium text-dark-900 mb-2">Nenhum inscrito ainda</h4>
                <p className="text-dark-500">Seja o primeiro a se inscrever neste torneio!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mock participants */}
                {Array.from({ length: tournament.participantsCount }, (_, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <Users size={20} className="text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-dark-900">Dupla {i + 1}</h4>
                      <p className="text-sm text-dark-600">Categoria: Open Masculina</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'resultados':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-dark-900">Resultados</h3>
            
            {tournament.status === 'completed' ? (
              <div className="space-y-4">
                <div className="bg-accent-50 border border-accent-200 rounded-lg p-6 text-center">
                  <Trophy className="mx-auto text-accent-600 mb-3" size={48} />
                  <h4 className="text-xl font-bold text-dark-900 mb-2">Campeões</h4>
                  <p className="text-dark-600">Resultados serão exibidos aqui após o término do torneio.</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Award className="mx-auto text-gray-300 mb-4" size={48} />
                <h4 className="text-lg font-medium text-dark-900 mb-2">Resultados não disponíveis</h4>
                <p className="text-dark-500">
                  {tournament.status === 'open' 
                    ? 'Os resultados serão exibidos após o início do torneio.'
                    : 'Torneio em andamento. Resultados serão atualizados em breve.'}
                </p>
              </div>
            )}
          </div>
        );

      case 'estatisticas':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-dark-900">Estatísticas do Torneio</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-primary-50 rounded-lg p-6 text-center">
                <Users className="mx-auto text-primary-600 mb-3" size={32} />
                <div className="text-2xl font-bold text-primary-900">{tournament.participantsCount}</div>
                <div className="text-sm text-primary-700">Participantes</div>
              </div>
              
              <div className="bg-accent-50 rounded-lg p-6 text-center">
                <Trophy className="mx-auto text-accent-600 mb-3" size={32} />
                <div className="text-2xl font-bold text-accent-900">{tournamentData.categories?.length || 0}</div>
                <div className="text-sm text-accent-700">Categorias</div>
              </div>
              
              <div className="bg-dark-50 rounded-lg p-6 text-center">
                <Award className="mx-auto text-dark-600 mb-3" size={32} />
                <div className="text-2xl font-bold text-dark-900">R$ {tournamentData.registrationFee?.toFixed(2) || '0,00'}</div>
                <div className="text-sm text-dark-700">Taxa de Inscrição</div>
              </div>
            </div>

            {tournament.status !== 'open' && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-dark-900 mb-4">Progresso do Torneio</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Jogos Realizados</span>
                    <span className="font-medium">0 / 0</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
              </div>
            )}
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
        <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-dark-900 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <Link 
                    to="/tournaments" 
                    className="text-accent-500 hover:text-accent-400 text-sm font-medium mr-2"
                  >
                    Torneios
                  </Link>
                  <span className="text-gray-400 text-sm">→</span>
                  <span className="text-gray-300 text-sm ml-2">{tournament.name}</span>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-black text-white mb-4">
                  {tournament.name}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <StatusBadge status={tournament.status} />
                  <div className="flex items-center text-gray-200">
                    <MapPin size={16} className="mr-1" />
                    <span>{tournament.location.city}, {tournament.location.state}</span>
                  </div>
                  <div className="flex items-center text-gray-200">
                    <Calendar size={16} className="mr-1" />
                    <span>{formatDate(tournament.date)}</span>
                  </div>
                  <div className="flex items-center text-gray-200">
                    <Users size={16} className="mr-1" />
                    <span>{tournament.participantsCount} inscritos</span>
                  </div>
                </div>
                
                <p className="text-gray-300 text-lg">
                  Organizado por {tournament.club}
                </p>
              </div>
              
              <div className="mt-6 md:mt-0 md:ml-8 flex flex-col sm:flex-row gap-3">
                <button className="flex items-center justify-center px-6 py-3 bg-white text-dark-900 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
                  <Heart size={20} className="mr-2" />
                  Favoritar
                </button>
                <button className="flex items-center justify-center px-6 py-3 bg-transparent border-2 border-accent-500 text-accent-500 rounded-lg hover:bg-accent-500 hover:text-dark-900 transition-colors font-semibold">
                  <Share2 size={20} className="mr-2" />
                  Compartilhar
                </button>
                <button 
                  className={`px-8 py-3 rounded-lg font-bold transition-all ${
                    canRegister 
                      ? 'bg-gradient-to-r from-accent-500 to-accent-400 text-dark-900 hover:from-accent-400 hover:to-accent-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5' 
                      : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  }`}
                  disabled={!canRegister}
                >
                  {canRegister ? 'Inscrever-se' : 'Inscrições Encerradas'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tournament Image */}
        {tournamentData.bannerImage && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <img
                src={tournamentData.bannerImage}
                alt={tournament.name}
                className="w-full h-64 object-cover"
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
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
                      <Icon size={16} className="mr-2" />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>
            
            <div className="p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentDetail;