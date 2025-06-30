import React, { useState, useEffect } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import { Plus, Calendar, Users, Trophy, Edit2, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

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

  useEffect(() => {
    // Load tournaments from localStorage
    const savedTournaments = localStorage.getItem('clubTournaments');
    if (savedTournaments) {
      setTournaments(JSON.parse(savedTournaments));
    }
  }, []);

  const filteredTournaments = tournaments.filter(tournament => 
    filter === 'all' || tournament.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
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

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meus Torneios</h1>
            <p className="text-gray-600 mt-2">Gerencie todos os seus torneios</p>
          </div>
          <Link
            to="/create-tournament"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Criar Torneio
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
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
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Trophy className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'Nenhum torneio criado' : `Nenhum torneio ${getStatusText(filter).toLowerCase()}`}
            </h3>
            <p className="text-gray-500 mb-6">
              {filter === 'all' 
                ? 'Comece criando seu primeiro torneio.' 
                : `Você não tem torneios ${getStatusText(filter).toLowerCase()}.`}
            </p>
            {filter === 'all' && (
              <Link
                to="/create-tournament"
                className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
              >
                <Plus className="mr-2" size={20} />
                Criar Torneio
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map((tournament) => (
              <div key={tournament.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {tournament.name}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tournament.status)}`}>
                      {getStatusText(tournament.status)}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={16} className="mr-2" />
                      {new Date(tournament.startDate).toLocaleDateString('pt-BR')} - {new Date(tournament.endDate).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users size={16} className="mr-2" />
                      {tournament.participantsCount} / {tournament.maxParticipants} participantes
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Trophy size={16} className="mr-2" />
                      R$ {tournament.registrationFee.toFixed(2)}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Categorias:</p>
                    <div className="flex flex-wrap gap-1">
                      {tournament.categories.slice(0, 2).map((category, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {category}
                        </span>
                      ))}
                      {tournament.categories.length > 2 && (
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          +{tournament.categories.length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="text-right">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ 
                            width: `${Math.min((tournament.participantsCount / tournament.maxParticipants) * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {Math.round((tournament.participantsCount / tournament.maxParticipants) * 100)}% ocupado
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTournaments;