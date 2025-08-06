import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/DashboardHeader';
import { Plus, Calendar, Users, Trophy, Edit2, Trash2, Eye, Search, Filter } from 'lucide-react';

interface Tournament {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  registrationFee: number;
  categories: string[];
  courts: string[];
  participantsCount: number;
  status: 'open' | 'in-progress' | 'completed' | 'scheduled';
  maxParticipants: number;
}

const MyTournaments: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [filter, setFilter] = useState<'all' | 'open' | 'in-progress' | 'completed' | 'scheduled'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Load tournaments from localStorage
    const savedTournaments = localStorage.getItem('clubTournaments');
    if (savedTournaments) {
      const parsedTournaments = JSON.parse(savedTournaments).map((tournament: any) => ({
        ...tournament,
        registrationFee: parseFloat(tournament.registrationFee) || 0,
        participantsCount: parseInt(tournament.participantsCount) || 0,
        maxParticipants: parseInt(tournament.maxParticipants) || 0
      }));
      setTournaments(parsedTournaments);
    }
  }, []);

  const filteredTournaments = tournaments.filter(tournament => {
    const matchesStatus = filter === 'all' || tournament.status === filter;
    const matchesSearch = searchTerm === '' || 
      tournament.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = dateFilter === '' || 
      tournament.startDate.includes(dateFilter);
    
    return matchesStatus && matchesSearch && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-accent-100 text-accent-800';
      case 'in-progress':
        return 'bg-primary-100 text-primary-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return 'Inscrições Abertas';
      case 'in-progress':
        return 'Em Andamento';
      case 'completed':
        return 'Concluído';
      case 'scheduled':
        return 'Agendado';
      default:
        return 'Desconhecido';
    }
  };

  const handleEditTournament = (tournamentId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigate to edit tournament page
    navigate(`/edit-tournament/${tournamentId}`);
  };

  const handleDeleteTournament = (tournamentId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Tem certeza que deseja excluir este torneio?')) {
      const updatedTournaments = tournaments.filter(t => t.id !== tournamentId);
      setTournaments(updatedTournaments);
      localStorage.setItem('clubTournaments', JSON.stringify(updatedTournaments));
    }
  };

  return (
    <div className="min-h-screen bg-light">
      <DashboardHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-dark-900">Meus Torneios</h1>
            <p className="text-dark-600 mt-2">Gerencie todos os seus torneios</p>
          </div>
          <Link
            to="/create-tournament"
            className="bg-gradient-to-r from-primary-900 to-primary-700 text-white px-6 py-3 rounded-lg hover:from-primary-800 hover:to-primary-600 transition-all duration-300 flex items-center shadow-lg"
          >
            <Plus size={20} className="mr-2" />
            Criar Torneio
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6 border border-gray-100 overflow-hidden">
          {/* Search and Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por nome do torneio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div className="md:w-48">
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Filtrar por data"
                />
              </div>
              {(searchTerm || dateFilter) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setDateFilter('');
                  }}
                  className="px-4 py-3 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>
          
          {/* Status Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'all', label: 'Todos', count: tournaments.length },
                { key: 'open', label: 'Inscrições Abertas', count: tournaments.filter(t => t.status === 'open').length },
                { key: 'scheduled', label: 'Agendados', count: tournaments.filter(t => t.status === 'scheduled').length },
                { key: 'in-progress', label: 'Em Andamento', count: tournaments.filter(t => t.status === 'in-progress').length },
                { key: 'completed', label: 'Concluídos', count: tournaments.filter(t => t.status === 'completed').length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.key
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-dark-500 hover:text-dark-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tournaments List */}
        {filteredTournaments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
            <Trophy className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-lg font-medium text-dark-900 mb-2">
              {searchTerm || dateFilter 
                ? 'Nenhum torneio encontrado' 
                : filter === 'all' 
                  ? 'Nenhum torneio criado' 
                  : `Nenhum torneio ${getStatusText(filter).toLowerCase()}`}
            </h3>
            <p className="text-dark-500 mb-6">
              {searchTerm || dateFilter
                ? 'Tente ajustar os filtros de busca.'
                : filter === 'all' 
                  ? 'Comece criando seu primeiro torneio.' 
                  : `Você não tem torneios ${getStatusText(filter).toLowerCase()}.`}
            </p>
            {filter === 'all' && !searchTerm && !dateFilter && (
              <Link
                to="/create-tournament"
                className="inline-flex items-center bg-gradient-to-r from-primary-900 to-primary-700 text-white px-6 py-3 rounded-lg hover:from-primary-800 hover:to-primary-600 transition-all duration-300 shadow-lg"
              >
                <Plus className="mr-2" size={20} />
                Criar Torneio
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map((tournament) => (
              <Link 
                key={tournament.id} 
                to={`/tournament/${tournament.id}`}
                className="block"
              >
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100 cursor-pointer transform hover:-translate-y-1">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-dark-900 line-clamp-2">
                        {tournament.name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tournament.status)}`}>
                        {getStatusText(tournament.status)}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-dark-600">
                        <Calendar size={16} className="mr-2 text-primary-600" />
                        {new Date(tournament.startDate).toLocaleDateString('pt-BR')} - {new Date(tournament.endDate).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center text-sm text-dark-600">
                        <Users size={16} className="mr-2 text-primary-600" />
                        {tournament.participantsCount} / {tournament.maxParticipants} participantes
                      </div>
                      <div className="flex items-center text-sm text-dark-600">
                        <Trophy size={16} className="mr-2 text-primary-600" />
                        R$ {tournament.registrationFee.toFixed(2)}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-dark-600 mb-1">Categorias:</p>
                      <div className="flex flex-wrap gap-1">
                        {tournament.categories.slice(0, 2).map((category, index) => (
                          <span key={index} className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs">
                            {category}
                          </span>
                        ))}
                        {tournament.categories.length > 2 && (
                          <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs">
                            +{tournament.categories.length - 2}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex space-x-1">
                        <button 
                          className="p-2 text-dark-600 hover:text-primary-600 hover:bg-primary-50 rounded"
                          title="Visualizar torneio"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigate(`/tournament/${tournament.id}`);
                          }}
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="p-2 text-dark-600 hover:text-accent-600 hover:bg-accent-50 rounded"
                          onClick={(e) => handleEditTournament(tournament.id, e)}
                          title="Editar torneio"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          className="p-2 text-dark-600 hover:text-red-600 hover:bg-red-50 rounded"
                          onClick={(e) => handleDeleteTournament(tournament.id, e)}
                          title="Deletar torneio"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-accent-600 h-2 rounded-full"
                            style={{ 
                              width: tournament.hasParticipantLimit && tournament.maxParticipants 
                                ? `${Math.min((tournament.participantsCount / tournament.maxParticipants) * 100, 100)}%`
                                : '0%'
                            }}
                          ></div>
                        </div>
                        {tournament.hasParticipantLimit && tournament.maxParticipants && (
                          <p className="text-xs text-dark-500 mt-1">
                            {Math.round((tournament.participantsCount / tournament.maxParticipants) * 100)}% ocupado
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTournaments;