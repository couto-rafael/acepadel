import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import DashboardHeader from '../components/DashboardHeader';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Trophy, 
  DollarSign, 
  Info, 
  Play, 
  Award,
  Zap,
  Search,
  Plus,
  Bot,
  Edit2,
  Filter,
  ChevronDown,
  X
} from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  partner?: string;
  category: string;
}

interface Group {
  id: string;
  name: string;
  teams: {
    name: string;
    wins: number;
    losses: number;
    setsWon: number;
    setsLost: number;
    gamesWon: number;
    gamesLost: number;
    setBalance: number;
    gameBalance: number;
  }[];
  matches: {
    id: string;
    team1: string;
    team2: string;
    score: string;
    date: string;
    time: string;
    court: string;
    status: 'scheduled' | 'completed';
  }[];
}

interface AIParticipantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  onConfirm: (quantity: number, category: string) => void;
}

const AIParticipantsModal: React.FC<AIParticipantsModalProps> = ({ isOpen, onClose, categories, onConfirm }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedCategory) {
      onConfirm(quantity, selectedCategory);
      onClose();
      setQuantity(1);
      setSelectedCategory('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-dark-800">Adicionar Duplas com IA</h3>
          <button onClick={onClose} className="text-dark-400 hover:text-dark-600">
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-dark-700 mb-2">
              Quantidade de Duplas
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-dark-700 mb-2">
              Categoria
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Selecione uma categoria</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-dark-600 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedCategory}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

const TournamentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [activeSubTab, setActiveSubTab] = useState('geral');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDate, setSelectedDate] = useState('all');
  const [selectedCourt, setSelectedCourt] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAIModal, setShowAIModal] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showCourtFilter, setShowCourtFilter] = useState(false);

  // Mock tournament data
  const tournament = {
    id: id || '1',
    name: 'Open Padel',
    club: 'Elite Padel',
    location: { city: 'São Paulo', state: 'SP' },
    startDate: '2025-07-11',
    endDate: '2025-07-13',
    registrationFee: 120.00,
    description: 'Torneio aberto para todas as categorias',
    categories: ['Open Masculina', 'Open Feminina', '2ª Masc', '2ª Fem', '3ª Masc', '3ª Fem', '4ª Masc', '4ª Fem', '5ª Masc', '5ª Fem', '6ª Masc', '6ª Fem', '7ª Masc', '7ª Fem', 'Mista A', 'Mista B', 'Mista C', 'Mista D'],
    maxParticipants: 64,
    hasParticipantLimit: true,
    courts: ['Quadra 1', 'Quadra 2', 'Quadra 3', 'Quadra 4'],
    dates: ['11/07/2025', '12/07/2025', '13/07/2025'],
    createdBy: 'clube@teste.com' // Mock club email
  };

  // Check if current user is the tournament creator
  const isCreator = user && profile?.user_type === 'club' && profile.email === tournament.createdBy;
  const isAthlete = user && profile?.user_type === 'athlete';

  // Get categories with registered participants
  const categoriesWithRegistrations = tournament.categories.filter(category => 
    participants.some(p => p.category === category)
  );

  const filteredParticipants = participants.filter(participant => {
    const matchesCategory = selectedCategory === 'all' || participant.category === selectedCategory;
    const matchesSearch = participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (participant.partner && participant.partner.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const generateAIParticipants = (quantity: number, category: string) => {
    const firstNames = ['João', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Lucia', 'Rafael', 'Camila', 'Bruno', 'Julia', 'Diego', 'Fernanda', 'Lucas', 'Beatriz', 'Thiago', 'Mariana', 'Gabriel', 'Larissa', 'Felipe', 'Amanda'];
    const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes', 'Soares', 'Fernandes', 'Vieira', 'Barbosa'];
    
    const newParticipants: Participant[] = [];
    
    for (let i = 0; i < quantity; i++) {
      const player1 = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
      const player2 = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
      
      newParticipants.push({
        id: `ai-${Date.now()}-${i}`,
        name: player1,
        partner: player2,
        category
      });
    }
    
    setParticipants(prev => [...prev, ...newParticipants]);
  };

  const generateGroups = (category?: string) => {
    const categoriesToGenerate = category ? [category] : categoriesWithRegistrations;
    const newGroups: Group[] = [];

    categoriesToGenerate.forEach(cat => {
      const categoryParticipants = participants.filter(p => p.category === cat);
      if (categoryParticipants.length === 0) return;

      // Create groups of 3 teams each
      const groupCount = Math.ceil(categoryParticipants.length / 3);
      
      for (let i = 0; i < groupCount; i++) {
        const groupTeams = categoryParticipants.slice(i * 3, (i + 1) * 3);
        const groupName = `${cat} - Chave ${String.fromCharCode(65 + i)}`;
        
        const teams = groupTeams.map(participant => ({
          name: `${participant.name} / ${participant.partner}`,
          wins: Math.floor(Math.random() * 3),
          losses: Math.floor(Math.random() * 2),
          setsWon: Math.floor(Math.random() * 6) + 1,
          setsLost: Math.floor(Math.random() * 4),
          gamesWon: Math.floor(Math.random() * 30) + 10,
          gamesLost: Math.floor(Math.random() * 25) + 5,
          setBalance: 0,
          gameBalance: 0
        }));

        // Calculate balances
        teams.forEach(team => {
          team.setBalance = team.setsWon - team.setsLost;
          team.gameBalance = team.gamesWon - team.gamesLost;
        });

        // Sort by wins, then by set balance, then by game balance
        teams.sort((a, b) => {
          if (b.wins !== a.wins) return b.wins - a.wins;
          if (b.setBalance !== a.setBalance) return b.setBalance - a.setBalance;
          return b.gameBalance - a.gameBalance;
        });

        // Generate matches between teams in the group
        const matches = [];
        for (let j = 0; j < teams.length; j++) {
          for (let k = j + 1; k < teams.length; k++) {
            matches.push({
              id: `match-${i}-${j}-${k}`,
              team1: teams[j].name,
              team2: teams[k].name,
              score: Math.random() > 0.5 ? '6-4, 6-3' : '4-6, 6-7',
              date: tournament.dates[Math.floor(Math.random() * tournament.dates.length)],
              time: `${9 + Math.floor(Math.random() * 8)}:${Math.random() > 0.5 ? '00' : '30'}`,
              court: tournament.courts[Math.floor(Math.random() * tournament.courts.length)],
              status: Math.random() > 0.3 ? 'completed' : 'scheduled' as 'scheduled' | 'completed'
            });
          }
        }

        newGroups.push({
          id: `group-${cat}-${i}`,
          name: groupName,
          teams,
          matches
        });
      }
    });

    if (category) {
      setGroups(prev => [...prev.filter(g => !g.name.startsWith(category)), ...newGroups]);
    } else {
      setGroups(newGroups);
    }
  };

  const renderParticipantsTab = () => (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-dark-800">Participantes Inscritos</h2>
          <p className="text-dark-600">{participants.length} duplas inscritas</p>
        </div>
        
        {/* Controls row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por nome do atleta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <button
              onClick={() => setShowCategoryFilter(!showCategoryFilter)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter size={18} className="mr-2" />
              Categoria
              <ChevronDown size={16} className="ml-2" />
            </button>
            {showCategoryFilter && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-50 border border-gray-100">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setShowCategoryFilter(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${selectedCategory === 'all' ? 'bg-primary-50 text-primary-700' : 'text-dark-700'}`}
                >
                  Todas as Categorias
                </button>
                {categoriesWithRegistrations.map(category => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowCategoryFilter(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${selectedCategory === category ? 'bg-primary-50 text-primary-700' : 'text-dark-700'}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons - only show for club users */}
          {isCreator && (
            <>
              <button
                onClick={() => setShowAIModal(true)}
                className="flex items-center px-4 py-2 bg-accent-500 text-dark-900 rounded-lg hover:bg-accent-400 transition-colors font-semibold"
              >
                <Bot size={18} className="mr-2" />
                Dupla c/ AI
              </button>
              <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold">
                <Plus size={18} className="mr-2" />
                Adicionar Dupla
              </button>
            </>
          )}
        </div>
      </div>

      {/* Category tabs - only show if there are registered participants */}
      {categoriesWithRegistrations.length > 0 && (
        <div className="border-b border-gray-200">
          <div className="flex space-x-1 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'text-dark-600 hover:bg-gray-100'
              }`}
            >
              Todas ({participants.length})
            </button>
            {categoriesWithRegistrations.map(category => {
              const count = participants.filter(p => p.category === category).length;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary-600 text-white'
                      : 'text-dark-600 hover:bg-gray-100'
                  }`}
                >
                  {category} ({count})
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Participants list */}
      {filteredParticipants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredParticipants.map(participant => (
            <div key={participant.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-dark-800">
                    {participant.name} / {participant.partner}
                  </h3>
                  <p className="text-sm text-primary-600 font-medium">{participant.category}</p>
                </div>
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <Users size={16} className="text-primary-600" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users size={64} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-dark-900 mb-2">
            {participants.length === 0 ? 'Nenhuma dupla inscrita' : 'Nenhuma dupla encontrada'}
          </h3>
          <p className="text-dark-500">
            {participants.length === 0 
              ? 'As inscrições ainda não começaram ou nenhuma dupla se inscreveu.'
              : 'Tente ajustar os filtros de busca.'}
          </p>
        </div>
      )}
    </div>
  );

  const renderGroupsTab = () => (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-dark-800">Grupos</h2>
          <p className="text-dark-600">Chaveamento por categorias</p>
        </div>
        
        {/* Controls row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por nome do atleta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <button
              onClick={() => setShowCategoryFilter(!showCategoryFilter)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter size={18} className="mr-2" />
              Categoria
              <ChevronDown size={16} className="ml-2" />
            </button>
            {showCategoryFilter && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-50 border border-gray-100">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setShowCategoryFilter(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${selectedCategory === 'all' ? 'bg-primary-50 text-primary-700' : 'text-dark-700'}`}
                >
                  Todas as Categorias
                </button>
                {categoriesWithRegistrations.map(category => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowCategoryFilter(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${selectedCategory === category ? 'bg-primary-50 text-primary-700' : 'text-dark-700'}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons - only show for club users */}
          {isCreator && (
            <>
              <button
                onClick={() => generateGroups()}
                className="flex items-center px-4 py-2 bg-accent-500 text-dark-900 rounded-lg hover:bg-accent-400 transition-colors font-semibold"
              >
                <Trophy size={18} className="mr-2" />
                Gerar Todas
              </button>
              <button
                onClick={() => selectedCategory !== 'all' && generateGroups(selectedCategory)}
                disabled={selectedCategory === 'all'}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                <Trophy size={18} className="mr-2" />
                Gerar Categoria
              </button>
            </>
          )}
        </div>
      </div>

      {/* Category tabs */}
      {categoriesWithRegistrations.length > 0 && (
        <div className="border-b border-gray-200">
          <div className="flex space-x-1 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'text-dark-600 hover:bg-gray-100'
              }`}
            >
              Todas
            </button>
            {categoriesWithRegistrations.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'text-dark-600 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Groups display */}
      {groups.length > 0 ? (
        <div className="space-y-8">
          {groups
            .filter(group => selectedCategory === 'all' || group.name.includes(selectedCategory))
            .map(group => (
              <div key={group.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-primary-600 text-white px-6 py-4">
                  <h3 className="text-lg font-bold">{group.name}</h3>
                </div>
                
                {/* Group standings table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dupla</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Vitórias</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo Sets</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo Games</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Games a Favor</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {group.teams.map((team, index) => (
                        <tr key={index} className={index === 0 ? 'bg-accent-50' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${
                                index === 0 ? 'bg-accent-500 text-dark-900' : 'bg-gray-200 text-gray-600'
                              }`}>
                                {index + 1}
                              </div>
                              <span className="text-sm font-medium text-dark-900">{team.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-semibold text-dark-900">{team.wins}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-dark-900">{team.setBalance > 0 ? '+' : ''}{team.setBalance}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-dark-900">{team.gameBalance > 0 ? '+' : ''}{team.gameBalance}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-dark-900">{team.gamesWon}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Group matches */}
                <div className="px-6 py-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-dark-800 mb-3">Jogos</h4>
                  <div className="space-y-2">
                    {group.matches.map(match => (
                      <div key={match.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-dark-900">
                            {match.team1} vs {match.team2}
                          </div>
                          <div className="text-xs text-dark-500">
                            {match.date} • {match.time} • {match.court}
                          </div>
                        </div>
                        <div className="text-right">
                          {match.status === 'completed' ? (
                            <span className="text-sm font-semibold text-dark-900">{match.score}</span>
                          ) : (
                            <span className="text-xs text-primary-600 font-medium">Agendado</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Trophy size={64} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-dark-900 mb-2">Nenhum grupo gerado</h3>
          <p className="text-dark-500">
            {participants.length === 0 
              ? 'É necessário ter duplas inscritas para gerar os grupos.'
              : 'Clique em "Gerar Grupos" para criar o chaveamento.'}
          </p>
        </div>
      )}
    </div>
  );

  const renderMatchesTab = () => (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-dark-800">Jogos</h2>
          <p className="text-dark-600">Programação de partidas</p>
        </div>
        
        {/* Controls row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por nome do atleta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Date Filter */}
          <div className="relative">
            <button
              onClick={() => setShowDateFilter(!showDateFilter)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Calendar size={18} className="mr-2" />
              Data
              <ChevronDown size={16} className="ml-2" />
            </button>
            {showDateFilter && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-50 border border-gray-100">
                <button
                  onClick={() => {
                    setSelectedDate('all');
                    setShowDateFilter(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${selectedDate === 'all' ? 'bg-primary-50 text-primary-700' : 'text-dark-700'}`}
                >
                  Todas as Datas
                </button>
                {tournament.dates.map(date => (
                  <button
                    key={date}
                    onClick={() => {
                      setSelectedDate(date);
                      setShowDateFilter(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${selectedDate === date ? 'bg-primary-50 text-primary-700' : 'text-dark-700'}`}
                  >
                    {date}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Court Filter */}
          <div className="relative">
            <button
              onClick={() => setShowCourtFilter(!showCourtFilter)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Trophy size={18} className="mr-2" />
              Quadra
              <ChevronDown size={16} className="ml-2" />
            </button>
            {showCourtFilter && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-50 border border-gray-100">
                <button
                  onClick={() => {
                    setSelectedCourt('all');
                    setShowCourtFilter(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${selectedCourt === 'all' ? 'bg-primary-50 text-primary-700' : 'text-dark-700'}`}
                >
                  Todas as Quadras
                </button>
                {tournament.courts.map(court => (
                  <button
                    key={court}
                    onClick={() => {
                      setSelectedCourt(court);
                      setShowCourtFilter(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${selectedCourt === court ? 'bg-primary-50 text-primary-700' : 'text-dark-700'}`}
                  >
                    {court}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action button - only show for club users */}
          {isCreator && (
            <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold">
              <Play size={18} className="mr-2" />
              Gerar Jogos
            </button>
          )}
        </div>
      </div>

      {/* Date tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-1 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedDate('all')}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
              selectedDate === 'all'
                ? 'bg-primary-600 text-white'
                : 'text-dark-600 hover:bg-gray-100'
            }`}
          >
            Todas as Datas
          </button>
          {tournament.dates.map(date => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                selectedDate === date
                  ? 'bg-primary-600 text-white'
                  : 'text-dark-600 hover:bg-gray-100'
              }`}
            >
              {date}
            </button>
          ))}
        </div>
      </div>

      {/* Court tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-1 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCourt('all')}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
              selectedCourt === 'all'
                ? 'bg-accent-600 text-dark-900'
                : 'text-dark-600 hover:bg-gray-100'
            }`}
          >
            Todas as Quadras
          </button>
          {tournament.courts.map(court => (
            <button
              key={court}
              onClick={() => setSelectedCourt(court)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                selectedCourt === court
                  ? 'bg-accent-600 text-dark-900'
                  : 'text-dark-600 hover:bg-gray-100'
              }`}
            >
              {court}
            </button>
          ))}
        </div>
      </div>

      {/* Matches content */}
      <div className="text-center py-12">
        <Play size={64} className="text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-dark-900 mb-2">Nenhum jogo programado</h3>
        <p className="text-dark-500">
          Os jogos serão gerados após a criação dos grupos.
        </p>
      </div>
    </div>
  );

  const renderInfoTab = () => (
    <div className="space-y-6">
      {/* Sub-navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'geral', label: 'Gerais' },
            { id: 'contato', label: 'Contato' },
            { id: 'localizacao', label: 'Localização' },
            { id: 'regras', label: 'Regras' },
            { id: 'faq', label: 'FAQ' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeSubTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-dark-500 hover:text-dark-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeSubTab === 'geral' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              <Calendar className="text-primary-600 mr-3" size={24} />
              <h3 className="text-lg font-bold text-dark-800">Datas do Torneio</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-dark-600">Início:</span>
                <span className="font-semibold text-dark-900">
                  {new Date(tournament.startDate).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-600">Fim:</span>
                <span className="font-semibold text-dark-900">
                  {new Date(tournament.endDate).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              <DollarSign className="text-accent-600 mr-3" size={24} />
              <h3 className="text-lg font-bold text-dark-800">Informações de Inscrição</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-dark-600">Taxa:</span>
                <span className="font-semibold text-accent-600">
                  R$ {tournament.registrationFee.toFixed(2)}
                </span>
              </div>
              {tournament.hasParticipantLimit && tournament.maxParticipants && (
                <>
                  <div className="flex justify-between">
                    <span className="text-dark-600">Vagas:</span>
                    <span className="font-semibold text-dark-900">{tournament.maxParticipants}</span>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-dark-600">Ocupação</span>
                      <span className="text-dark-600">
                        {Math.round((participants.length / tournament.maxParticipants) * 100)}% ocupado
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-accent-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((participants.length / tournament.maxParticipants) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'contato' && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-dark-800 mb-4">Informações de Contato</h3>
          <p className="text-dark-600">Informações de contato serão exibidas aqui.</p>
        </div>
      )}

      {activeSubTab === 'localizacao' && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-dark-800 mb-4">Localização</h3>
          <p className="text-dark-600">Mapa e informações de localização serão exibidas aqui.</p>
        </div>
      )}

      {activeSubTab === 'regras' && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-dark-800 mb-4">Regras do Torneio</h3>
          <p className="text-dark-600">Regras específicas do torneio serão exibidas aqui.</p>
        </div>
      )}

      {activeSubTab === 'faq' && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-dark-800 mb-4">Perguntas Frequentes</h3>
          <p className="text-dark-600">FAQ será exibido aqui.</p>
        </div>
      )}
    </div>
  );

  const tabs = [
    { id: 'info', label: 'Informações', icon: Info },
    { id: 'inscritos', label: 'Inscritos', icon: Users },
    { id: 'grupos', label: 'Grupos', icon: Trophy },
    { id: 'jogos', label: 'Jogos', icon: Play },
    { id: 'ao-vivo', label: 'Ao Vivo', icon: Zap },
    { id: 'resultados', label: 'Resultados', icon: Award }
  ];

  return (
    <div className="min-h-screen bg-light">
      {user ? <DashboardHeader /> : <Navbar />}
      
      <div className="pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-dark-900 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                  {tournament.name}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-white">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-accent-500 rounded mr-3 flex items-center justify-center">
                      <div className="w-3 h-3 bg-dark-900 rounded"></div>
                    </div>
                    <span className="font-medium">{tournament.club}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin size={20} className="mr-2" />
                    <span>{tournament.location.city}, {tournament.location.state}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={20} className="mr-2" />
                    <span>{new Date(tournament.startDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 lg:mt-0">
                {isCreator ? (
                  <button className="bg-accent-500 text-dark-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent-400 transition-all duration-300 shadow-xl flex items-center">
                    <Edit2 size={20} className="mr-2" />
                    Editar
                  </button>
                ) : isAthlete ? (
                  <button className="bg-accent-500 text-dark-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent-400 transition-all duration-300 shadow-xl flex items-center">
                    <Zap size={20} className="mr-2" />
                    Inscrever-se
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs.map(tab => {
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

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'info' && renderInfoTab()}
          {activeTab === 'inscritos' && renderParticipantsTab()}
          {activeTab === 'grupos' && renderGroupsTab()}
          {activeTab === 'jogos' && renderMatchesTab()}
          {activeTab === 'ao-vivo' && (
            <div className="text-center py-12">
              <Zap size={64} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-dark-900 mb-2">Transmissão ao vivo</h3>
              <p className="text-dark-500">A transmissão será disponibilizada durante o torneio.</p>
            </div>
          )}
          {activeTab === 'resultados' && (
            <div className="text-center py-12">
              <Award size={64} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-dark-900 mb-2">Resultados</h3>
              <p className="text-dark-500">Os resultados serão exibidos após o término das partidas.</p>
            </div>
          )}
        </div>
      </div>

      <AIParticipantsModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        categories={tournament.categories}
        onConfirm={generateAIParticipants}
      />
    </div>
  );
};

export default TournamentDetail;