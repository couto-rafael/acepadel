/*
  # Página de Relatórios do Clube
  
  Esta página permite que clubes visualizem, analisem e exportem dados dos seus torneios.
  
  ## Funcionalidades:
  1. Filtros por torneio e data
  2. Tabela completa com dados dos torneios
  3. Gráficos de inscritos por categoria e crescimento
  4. Exportação CSV/PDF
  5. Relatório completo por torneio
*/

import React, { useState, useEffect } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import { 
  BarChart3, 
  Download, 
  Filter, 
  Calendar,
  Users,
  Trophy,
  Target,
  TrendingUp,
  FileText,
  PieChart,
  Activity
} from 'lucide-react';

interface TournamentReport {
  id: string;
  name: string;
  categories: string[];
  participants: number;
  teams: number;
  totalGames: number;
  completedGames: number;
  gamesWithScore: number;
  startDate: string;
  endDate: string;
  status: string;
  type: 'regular' | 'super8';
}

const ClubReports: React.FC = () => {
  const [tournaments, setTournaments] = useState<TournamentReport[]>([]);
  const [filteredTournaments, setFilteredTournaments] = useState<TournamentReport[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    // Load tournaments from localStorage
    const clubTournaments = JSON.parse(localStorage.getItem('clubTournaments') || '[]');
    
    const reportsData: TournamentReport[] = clubTournaments.map((tournament: any) => ({
      id: tournament.id,
      name: tournament.name,
      categories: tournament.categories || [],
      participants: tournament.participantsCount || 0,
      teams: Math.floor((tournament.participantsCount || 0) / 2),
      totalGames: (tournament.categories?.length || 0) * 6, // Estimativa
      completedGames: Math.floor(((tournament.categories?.length || 0) * 6) * 0.7), // 70% completed
      gamesWithScore: Math.floor(((tournament.categories?.length || 0) * 6) * 0.6), // 60% with score
      startDate: tournament.startDate,
      endDate: tournament.endDate,
      status: tournament.status,
      type: tournament.tournamentType || 'regular'
    }));
    
    setTournaments(reportsData);
    setFilteredTournaments(reportsData);
  }, []);

  useEffect(() => {
    let filtered = [...tournaments];
    
    // Filter by tournament
    if (selectedTournament !== 'all') {
      filtered = filtered.filter(t => t.id === selectedTournament);
    }
    
    // Filter by date
    if (dateFilter === 'custom' && startDate && endDate) {
      filtered = filtered.filter(t => {
        const tournamentStart = new Date(t.startDate);
        return tournamentStart >= new Date(startDate) && tournamentStart <= new Date(endDate);
      });
    } else if (dateFilter === 'last30') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      filtered = filtered.filter(t => new Date(t.startDate) >= thirtyDaysAgo);
    } else if (dateFilter === 'last90') {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      filtered = filtered.filter(t => new Date(t.startDate) >= ninetyDaysAgo);
    }
    
    setFilteredTournaments(filtered);
  }, [tournaments, selectedTournament, dateFilter, startDate, endDate]);

  const totalStats = {
    tournaments: filteredTournaments.length,
    participants: filteredTournaments.reduce((sum, t) => sum + t.participants, 0),
    teams: filteredTournaments.reduce((sum, t) => sum + t.teams, 0),
    games: filteredTournaments.reduce((sum, t) => sum + t.totalGames, 0),
    completedGames: filteredTournaments.reduce((sum, t) => sum + t.completedGames, 0),
    gamesWithScore: filteredTournaments.reduce((sum, t) => sum + t.gamesWithScore, 0)
  };

  const completionRate = totalStats.games > 0 ? Math.round((totalStats.completedGames / totalStats.games) * 100) : 0;
  const scoreRate = totalStats.games > 0 ? Math.round((totalStats.gamesWithScore / totalStats.games) * 100) : 0;

  // Mock data for charts
  const categoryData = [
    { name: 'Open Masculina', value: 45, color: '#4A148C' },
    { name: 'Open Feminina', value: 38, color: '#00FF9D' },
    { name: '2ª Masculina', value: 32, color: '#7C3AED' },
    { name: '2ª Feminina', value: 28, color: '#34D399' },
    { name: 'Mista A', value: 25, color: '#A855F7' }
  ];

  const monthlyGrowth = [
    { month: 'Jan', inscricoes: 45 },
    { month: 'Fev', inscricoes: 52 },
    { month: 'Mar', inscricoes: 61 },
    { month: 'Abr', inscricoes: 58 },
    { month: 'Mai', inscricoes: 67 },
    { month: 'Jun', inscricoes: 73 }
  ];

  const handleExportCSV = () => {
    const csvContent = [
      ['Nome do Torneio', 'Tipo', 'Categorias', 'Participantes', 'Duplas', 'Jogos Totais', 'Jogos Realizados', 'Jogos com Placar', 'Data Início', 'Status'],
      ...filteredTournaments.map(t => [
        t.name,
        t.type === 'super8' ? 'Super 8' : 'Regular',
        t.categories.join('; '),
        t.participants,
        t.teams,
        t.totalGames,
        t.completedGames,
        t.gamesWithScore,
        new Date(t.startDate).toLocaleDateString('pt-BR'),
        t.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'relatorio-torneios.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    // Mock PDF export
    alert('Funcionalidade de exportação PDF será implementada em breve!');
  };

  return (
    <div className="min-h-screen bg-light">
      <DashboardHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-900 mb-2">Relatórios</h1>
          <p className="text-dark-600">Analise o desempenho dos seus torneios e exporte dados</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex items-center mb-4">
            <Filter className="mr-2 text-primary-600" size={20} />
            <h2 className="text-lg font-semibold text-dark-900">Filtros</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-2">Torneio</label>
              <select
                value={selectedTournament}
                onChange={(e) => setSelectedTournament(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Todos os Torneios</option>
                {tournaments.map(tournament => (
                  <option key={tournament.id} value={tournament.id}>
                    {tournament.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-2">Período</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Todos os Períodos</option>
                <option value="last30">Últimos 30 dias</option>
                <option value="last90">Últimos 90 dias</option>
                <option value="custom">Período Personalizado</option>
              </select>
            </div>
            
            {dateFilter === 'custom' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-2">Data Início</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-2">Data Fim</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="text-primary-600" size={24} />
              <span className="text-2xl font-bold text-dark-900">{totalStats.tournaments}</span>
            </div>
            <p className="text-sm text-dark-600">Torneios</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <Users className="text-blue-600" size={24} />
              <span className="text-2xl font-bold text-dark-900">{totalStats.participants}</span>
            </div>
            <p className="text-sm text-dark-600">Participantes</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <Users className="text-accent-600" size={24} />
              <span className="text-2xl font-bold text-dark-900">{totalStats.teams}</span>
            </div>
            <p className="text-sm text-dark-600">Duplas</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <Target className="text-green-600" size={24} />
              <span className="text-2xl font-bold text-dark-900">{totalStats.games}</span>
            </div>
            <p className="text-sm text-dark-600">Jogos Totais</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <Activity className="text-purple-600" size={24} />
              <span className="text-2xl font-bold text-dark-900">{completionRate}%</span>
            </div>
            <p className="text-sm text-dark-600">Jogos Realizados</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="text-orange-600" size={24} />
              <span className="text-2xl font-bold text-dark-900">{scoreRate}%</span>
            </div>
            <p className="text-sm text-dark-600">Jogos com Placar</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Inscritos por Categoria */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-dark-900 flex items-center">
                <PieChart className="mr-2 text-primary-600" size={20} />
                Inscritos por Categoria
              </h3>
            </div>
            
            <div className="space-y-4">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm text-dark-700">{category.name}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                      <div
                        className="h-2 rounded-full"
                        style={{ 
                          width: `${(category.value / 73) * 100}%`,
                          backgroundColor: category.color 
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-dark-900">{category.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Crescimento de Inscrições */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-dark-900 flex items-center">
                <TrendingUp className="mr-2 text-accent-600" size={20} />
                Crescimento de Inscrições
              </h3>
            </div>
            
            <div className="space-y-4">
              {monthlyGrowth.map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-dark-700 w-12">{month.month}</span>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-accent-500 to-accent-400 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${(month.inscricoes / 73) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-medium text-dark-900 w-8">{month.inscricoes}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-dark-900 flex items-center">
                <BarChart3 className="mr-2 text-primary-600" size={20} />
                Dados dos Torneios
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={handleExportCSV}
                  className="flex items-center px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
                >
                  <Download className="mr-2" size={16} />
                  CSV
                </button>
                <button
                  onClick={handleExportPDF}
                  className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <FileText className="mr-2" size={16} />
                  PDF
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome do Torneio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categorias
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participantes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duplas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jogos Realizados
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jogos com Placar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTournaments.map((tournament) => (
                  <tr key={tournament.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{tournament.name}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(tournament.startDate).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        tournament.type === 'super8' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {tournament.type === 'super8' ? 'Super 8' : 'Regular'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{tournament.categories.length} categorias</div>
                      <div className="text-sm text-gray-500">
                        {tournament.categories.slice(0, 2).join(', ')}
                        {tournament.categories.length > 2 && '...'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tournament.participants}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tournament.teams}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {tournament.completedGames}/{tournament.totalGames}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-accent-600 h-2 rounded-full"
                          style={{ 
                            width: `${tournament.totalGames > 0 ? (tournament.completedGames / tournament.totalGames) * 100 : 0}%` 
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {tournament.gamesWithScore}/{tournament.totalGames}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ 
                            width: `${tournament.totalGames > 0 ? (tournament.gamesWithScore / tournament.totalGames) * 100 : 0}%` 
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        tournament.status === 'completed' ? 'bg-green-100 text-green-800' :
                        tournament.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        tournament.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {tournament.status === 'completed' ? 'Concluído' :
                         tournament.status === 'in-progress' ? 'Em Andamento' :
                         tournament.status === 'open' ? 'Aberto' : 'Agendado'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredTournaments.length === 0 && (
            <div className="text-center py-12">
              <BarChart3 className="mx-auto text-gray-300 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum dado encontrado</h3>
              <p className="text-gray-500">Ajuste os filtros ou crie novos torneios para ver os relatórios.</p>
            </div>
          )}
        </div>

        {/* Generate Complete Report */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-dark-900 mb-4 flex items-center">
            <FileText className="mr-2 text-primary-600" size={20} />
            Relatório Completo por Torneio
          </h3>
          
          <div className="flex items-center space-x-4">
            <select className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">Selecione um torneio...</option>
              {tournaments.map(tournament => (
                <option key={tournament.id} value={tournament.id}>
                  {tournament.name}
                </option>
              ))}
            </select>
            <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center">
              <Download className="mr-2" size={16} />
              Gerar Relatório
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubReports;