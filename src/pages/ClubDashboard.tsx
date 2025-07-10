import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardHeader from '../components/DashboardHeader';
import { Users, Trophy, Calendar, Plus, ArrowRight, AlertCircle } from 'lucide-react';

const ClubDashboard: React.FC = () => {
  const [clubData, setClubData] = useState<any>(null);
  const [showProfileAlert, setShowProfileAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    const isAuthenticated = localStorage.getItem('auth');
    
    // Redirect if not authenticated or not a club
    if (!isAuthenticated || userType !== 'club') {
      navigate('/');
      return;
    }

    // Load club data
    const savedClubData = localStorage.getItem('clubData');
    if (savedClubData) {
      const parsedData = JSON.parse(savedClubData);
      setClubData(parsedData);
      
      // Check if profile is incomplete
      const isIncomplete = !parsedData.fantasyName || !parsedData.description || !parsedData.city;
      setShowProfileAlert(isIncomplete);
    } else {
      setShowProfileAlert(true);
    }
  }, [navigate]);

  // Mock data for tournaments
  const clubTournaments = JSON.parse(localStorage.getItem('clubTournaments') || '[]');
  const totalParticipants = clubTournaments.reduce((sum: number, tournament: any) => sum + (tournament.participantsCount || 0), 0);
  const scheduledTournaments = clubTournaments.filter((t: any) => t.status === 'open' || t.status === 'scheduled').length;
  
  const nextTournament = clubTournaments
    .filter((t: any) => new Date(t.startDate) > new Date())
    .sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0];

  const stats = [
    {
      title: 'Total de Participantes',
      value: totalParticipants,
      icon: Users,
      color: 'bg-accent-500',
      action: 'Ver todos',
      actionIcon: ArrowRight
    },
    {
      title: 'Torneios Agendados',
      value: scheduledTournaments,
      icon: Trophy,
      color: 'bg-accent-500',
      action: 'Criar Novo Torneio',
      actionIcon: ArrowRight,
      actionLink: '/create-tournament'
    },
    {
      title: 'Próximo Torneio',
      value: nextTournament ? nextTournament.name : 'Nenhum agendado',
      subtitle: nextTournament ? new Date(nextTournament.startDate).toLocaleDateString('pt-BR') : '',
      icon: Calendar,
      color: 'bg-accent-500',
      action: 'Ver calendário',
      actionIcon: ArrowRight
    }
  ];

  return (
    <div className="min-h-screen bg-light">
      <DashboardHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        {/* Profile Completion Alert */}
        {showProfileAlert && (
          <div className="mb-8 bg-accent-50 border border-accent-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="text-accent-600 mt-0.5 mr-3" size={20} />
              <div className="flex-1">
                <h3 className="text-accent-800 font-medium mb-1">Complete seu perfil</h3>
                <p className="text-accent-700 text-sm mb-3">
                  Para aproveitar todas as funcionalidades, complete seu cadastro com as informações do seu clube.
                </p>
                <Link
                  to="/settings"
                  className="inline-flex items-center text-accent-800 hover:text-accent-900 font-medium text-sm"
                >
                  Completar perfil →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Main Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-900">Visão Geral</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <div className={`${stat.color} p-3 rounded-lg mr-4`}>
                  <stat.icon className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-dark-600 text-sm font-medium">{stat.title}</h3>
                  <p className="text-2xl font-bold text-dark-900">{stat.value}</p>
                  {stat.subtitle && (
                    <p className="text-sm text-dark-500">{stat.subtitle}</p>
                  )}
                </div>
              </div>
              
              <Link
                to={stat.actionLink || '#'}
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                {stat.action}
                <stat.actionIcon className="ml-1" size={16} />
              </Link>
            </div>
          ))}
        </div>

        {/* Tournaments Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-dark-900">Seus Torneios</h2>
              <Link
                to="/my-tournaments"
                className="inline-flex items-center bg-accent-100 text-accent-700 px-3 py-1 rounded-md hover:bg-accent-200 transition-colors text-sm font-medium"
              >
                Ver todos
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            {clubTournaments.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="mx-auto text-gray-300 mb-4" size={64} />
                <h3 className="text-lg font-medium text-dark-900 mb-2">Nenhum torneio criado</h3>
                <p className="text-dark-500 mb-6">Comece criando seu primeiro torneio.</p>
                <Link
                  to="/create-tournament"
                  className="inline-flex items-center bg-gradient-to-r from-primary-900 to-primary-700 text-white px-6 py-3 rounded-lg hover:from-primary-800 hover:to-primary-600 transition-all duration-300 font-medium shadow-lg"
                >
                  <Plus className="mr-2" size={20} />
                  Criar Torneio
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {clubTournaments.slice(0, 3).map((tournament: any) => (
                  <div key={tournament.id} className="border border-gray-200 rounded-lg p-4 hover:bg-accent-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-dark-900">{tournament.name}</h3>
                        <p className="text-sm text-dark-600">
                          {new Date(tournament.startDate).toLocaleDateString('pt-BR')} - {new Date(tournament.endDate).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-sm text-dark-500">
                          {tournament.participantsCount || 0} participantes
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tournament.status === 'open' 
                            ? 'bg-accent-100 text-accent-800' 
                            : tournament.status === 'in-progress'
                            ? 'bg-primary-100 text-primary-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {tournament.status === 'open' ? 'Inscrições Abertas' : 
                           tournament.status === 'in-progress' ? 'Em Andamento' : 'Concluído'}
                        </span>
                        <button className="text-primary-600 hover:text-primary-700">
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {clubTournaments.length > 3 && (
                  <div className="text-center pt-4">
                    <Link
                      to="/my-tournaments"
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      Ver mais {clubTournaments.length - 3} torneios
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDashboard;