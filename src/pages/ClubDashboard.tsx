import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardHeader from '../components/DashboardHeader';
import { 
  Users, 
  Trophy, 
  Calendar, 
  Plus, 
  ArrowRight, 
  AlertCircle,
  TrendingUp,
  Activity,
  BarChart3,
  FileText,
  Clock,
  Target
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ClubDashboard: React.FC = () => {
  const [clubData, setClubData] = useState<any>(null);
  const [showProfileAlert, setShowProfileAlert] = useState(false);
  const navigate = useNavigate();
  const { profile } = useAuth();

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    const isAuthenticated = localStorage.getItem('auth');
    
    if (!isAuthenticated || userType !== 'club') {
      navigate('/');
      return;
    }

    const savedClubData = localStorage.getItem('clubData');
    if (savedClubData) {
      const parsedData = JSON.parse(savedClubData);
      setClubData(parsedData);
      
      const isIncomplete = !parsedData.fantasyName || !parsedData.description || !parsedData.city;
      setShowProfileAlert(isIncomplete);
    } else {
      setShowProfileAlert(true);
    }
  }, [navigate]);

  // Mock data for tournaments and analytics
  const clubTournaments = JSON.parse(localStorage.getItem('clubTournaments') || '[]');
  const totalParticipants = clubTournaments.reduce((sum: number, tournament: any) => {
    return sum + (tournament.participantsCount || 0);
  }, 0);
  
  const activeTournaments = clubTournaments.filter((t: any) => 
    t.status === 'open' || t.status === 'in-progress'
  ).length;
  
  const totalGames = clubTournaments.reduce((sum: number, tournament: any) => {
    return sum + (tournament.categories?.length * 6 || 0); // Estimativa de jogos por categoria
  }, 0);

  const nextTournaments = clubTournaments
    .filter((t: any) => new Date(t.startDate) > new Date())
    .sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 3);

  const recentActivities = [
    { id: 1, action: 'Novo torneio criado', tournament: 'Copa Verão 2024', time: '2 horas atrás', type: 'create' },
    { id: 2, action: 'Grupo A gerado', tournament: 'Open Padel', time: '5 horas atrás', type: 'group' },
    { id: 3, action: 'Resultado adicionado', tournament: 'Championship Elite', time: '1 dia atrás', type: 'result' },
    { id: 4, action: '5 novas inscrições', tournament: 'Torneio Iniciantes', time: '2 dias atrás', type: 'registration' }
  ];

  const kpis = [
    {
      title: 'Total de Torneios',
      value: clubTournaments.length,
      icon: Trophy,
      color: 'bg-primary-500',
      change: '+2 este mês',
      changeType: 'positive'
    },
    {
      title: 'Torneios Ativos',
      value: activeTournaments,
      icon: Activity,
      color: 'bg-accent-500',
      change: `${activeTournaments} em andamento`,
      changeType: 'neutral'
    },
    {
      title: 'Total de Participantes',
      value: totalParticipants,
      icon: Users,
      color: 'bg-blue-500',
      change: '+15% vs mês anterior',
      changeType: 'positive'
    },
    {
      title: 'Jogos Registrados',
      value: totalGames,
      icon: Target,
      color: 'bg-green-500',
      change: `${Math.round(totalGames * 0.7)} finalizados`,
      changeType: 'neutral'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'create': return Trophy;
      case 'group': return Users;
      case 'result': return Target;
      case 'registration': return Plus;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'create': return 'text-primary-600';
      case 'group': return 'text-blue-600';
      case 'result': return 'text-green-600';
      case 'registration': return 'text-accent-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-light">
      <DashboardHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-20">
        {/* Profile Completion Alert */}
        {showProfileAlert && (
          <div className="mb-6 bg-accent-50 border border-accent-200 rounded-lg p-4">
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

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-dark-900 mb-2">
            Bem-vindo, {profile?.fantasy_name || profile?.club_name || 'Clube'}! 👋
          </h1>
          <p className="text-dark-600">Aqui está um resumo das suas atividades recentes</p>
        </div>

        {/* Quick Actions - Moved above KPIs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-bold text-dark-900 mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/create-tournament"
              className="flex items-center justify-center p-4 bg-gradient-to-r from-primary-900 to-primary-700 text-white rounded-lg hover:from-primary-800 hover:to-primary-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Plus className="mr-2" size={18} />
              <span className="font-semibold">Criar Torneio</span>
            </Link>
            
            <Link
              to="/my-tournaments"
              className="flex items-center justify-center p-4 bg-gradient-to-r from-accent-500 to-accent-400 text-dark-900 rounded-lg hover:from-accent-400 hover:to-accent-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Trophy className="mr-2" size={18} />
              <span className="font-semibold">Ver Torneios</span>
            </Link>
            
            <Link
              to="/club-reports"
              className="flex items-center justify-center p-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <BarChart3 className="mr-2" size={18} />
              <span className="font-semibold">Relatórios</span>
            </Link>
            
            <Link
              to="/club-profile"
              className="flex items-center justify-center p-4 bg-gradient-to-r from-gray-600 to-gray-500 text-white rounded-lg hover:from-gray-500 hover:to-gray-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <FileText className="mr-2" size={18} />
              <span className="font-semibold">Meu Perfil</span>
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {kpis.map((kpi, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className={`${kpi.color} p-3 rounded-lg`}>
                  <kpi.icon className="text-white" size={24} />
                </div>
                <TrendingUp size={16} className={
                  kpi.changeType === 'positive' ? 'text-green-500' : 
                  kpi.changeType === 'negative' ? 'text-red-500' : 'text-gray-400'
                } />
              </div>
              <div>
                <h3 className="text-dark-600 text-sm font-medium mb-1">{kpi.title}</h3>
                <p className="text-3xl font-bold text-dark-900 mb-2">{kpi.value}</p>
                <p className={`text-xs ${
                  kpi.changeType === 'positive' ? 'text-green-600' : 
                  kpi.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {kpi.change}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Próximos Torneios */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-dark-900 flex items-center">
                  <Calendar className="mr-2 text-primary-600" size={20} />
                  Próximos Torneios
                </h2>
                <Link
                  to="/my-tournaments"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                >
                  Ver todos <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
            
            <div className="p-6">
              {nextTournaments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
                  <h3 className="text-lg font-medium text-dark-900 mb-2">Nenhum torneio agendado</h3>
                  <p className="text-dark-500 mb-4">Crie seu próximo torneio para começar.</p>
                  <Link
                    to="/create-tournament"
                    className="inline-flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Plus className="mr-2" size={16} />
                    Criar Torneio
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {nextTournaments.map((tournament: any) => (
                    <div key={tournament.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <h3 className="font-medium text-dark-900">{tournament.name}</h3>
                        <div className="flex items-center text-sm text-dark-600 mt-1">
                          <Calendar size={14} className="mr-1" />
                          {new Date(tournament.startDate).toLocaleDateString('pt-BR')}
                          <span className="mx-2">•</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            tournament.status === 'open' ? 'bg-accent-100 text-accent-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {tournament.status === 'open' ? 'Inscrições Abertas' : 'Agendado'}
                          </span>
                        </div>
                      </div>
                      <Link
                        to={`/tournament/${tournament.id}`}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Atividades Recentes */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-dark-900 flex items-center">
                <Activity className="mr-2 text-accent-600" size={20} />
                Atividades Recentes
              </h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const IconComponent = getActivityIcon(activity.type);
                  return (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg bg-gray-100`}>
                        <IconComponent size={16} className={getActivityColor(activity.type)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-dark-900">{activity.action}</p>
                        <p className="text-sm text-dark-600">{activity.tournament}</p>
                        <p className="text-xs text-dark-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDashboard;