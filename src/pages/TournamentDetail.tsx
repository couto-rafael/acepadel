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
  X,
  Crown,
  Medal,
  Video
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

interface Match {
  id: string;
  team1: string;
  team2: string;
  score: string;
  court: string;
  date: string;
  time: string;
  category: string;
  group: string;
  status: 'scheduled' | 'completed';
}

interface AIParticipantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  onConfirm: (quantity: number, category: string) => void;
}

interface ScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: Match | null;
  onSave: (matchId: string, score: string) => void;
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

const ScoreModal: React.FC<ScoreModalProps> = ({ isOpen, onClose, match, onSave }) => {
  const [set1Team1, setSet1Team1] = useState('');
  const [set1Team2, setSet1Team2] = useState('');
  const [set2Team1, setSet2Team1] = useState('');
  const [set2Team2, setSet2Team2] = useState('');
  const [set3Team1, setSet3Team1] = useState('');
  const [set3Team2, setSet3Team2] = useState('');

  if (!isOpen || !match) return null;

  const handleSave = () => {
    const sets = [];
    if (set1Team1 && set1Team2) sets.push(`${set1Team1}-${set1Team2}`);
    if (set2Team1 && set2Team2) sets.push(`${set2Team1}-${set2Team2}`);
    if (set3Team1 && set3Team2) sets.push(`${set3Team1}-${set3Team2}`);
    
    const score = sets.join(', ');
    onSave(match.id, score);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-dark-800">Inserir Placar</h3>
          <button onClick={onClose} className="text-dark-400 hover:text-dark-600">
            <X size={20} />
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-dark-600">{match.team1} vs {match.team2}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-dark-700 mb-2">1º Set</label>
            <div className="flex space-x-2">
              <input
                type="number"
                min="0"
                max="7"
                value={set1Team1}
                onChange={(e) => setSet1Team1(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="0"
              />
              <span className="flex items-center">x</span>
              <input
                type="number"
                min="0"
                max="7"
                value={set1Team2}
                onChange={(e) => setSet1Team2(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark-700 mb-2">2º Set</label>
            <div className="flex space-x-2">
              <input
                type="number"
                min="0"
                max="7"
                value={set2Team1}
                onChange={(e) => setSet2Team1(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="0"
              />
              <span className="flex items-center">x</span>
              <input
                type="number"
                min="0"
                max="7"
                value={set2Team2}
                onChange={(e) => setSet2Team2(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark-700 mb-2">3º Set (opcional)</label>
            <div className="flex space-x-2">
              <input
                type="number"
                min="0"
                max="7"
                value={set3Team1}
                onChange={(e) => setSet3Team1(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="0"
              />
              <span className="flex items-center">x</span>
              <input
                type="number"
                min="0"
                max="7"
                value={set3Team2}
                onChange={(e) => setSet3Team2(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="0"
              />
            </div>
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
            onClick={handleSave}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Salvar
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
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
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
    courts: ['Quadra 1', 'Quadra 2', 'Quadra 3', 'Quadra 4'],
    dates: ['11/07/2025', '12/07/2025', '13/07/2025'],
    createdBy: 'clube@teste.com' // Mock club email
  };

  // Get real tournament data from localStorage
  const clubTournaments = JSON.parse(localStorage.getItem('clubTournaments') || '[]');
  const realTournamentData = clubTournaments.find((t: any) => t.id === id);
  const hasParticipantLimit = realTournamentData?.hasParticipantLimit && realTournamentData?.maxParticipants;

  // Check if current user is the tournament creator
  const isCreator = user && profile?.user_type === 'club' && profile.email === tournament.createdBy;
  const isAthlete = user && profile?.user_type === 'athlete';

  // Initialize mock matches
  useEffect(() => {
    setMatches([
      {
        id: 'MATCH001',
        team1: 'João Silva / Pedro Santos',
        team2: 'Carlos Lima / Rafael Dias',
        score: '6-4, 6-3',
        court: 'Quadra 1',
        date: '11/07/2025',
        time: '09:00',
        category: 'Open Masculina',
        group: 'Chave A',
        status: 'completed'
      },
      {
        id: 'MATCH002',
        team1: 'Maria Costa / Ana Lima',
        team2: 'Julia Rocha / Camila Souza',
        score: '',
        court: 'Quadra 2',
        date: '11/07/2025',
        time: '10:30',
        category: 'Open Feminina',
        group: 'Chave B',
        status: 'scheduled'
      },
      {
        id: 'MATCH003',
        team1: 'Bruno Alves / Diego Santos',
        team2: 'Lucas Ferreira / Thiago Costa',
        score: '4-6, 6-7',
        court: 'Quadra 3',
        date: '12/07/2025',
        time: '14:00',
        category: '2ª Masculina',
        group: 'Chave A',
        status: 'completed'
      }
    ]);
  }, []);

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
        const groupMatches = [];
        for (let j = 0; j < teams.length; j++) {
          for (let k = j + 1; k < teams.length; k++) {
            groupMatches.push({
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
          matches: groupMatches
        });
      }
    });

    if (category) {
      setGroups(prev => [...prev.filter(g => !g.name.startsWith(category)), ...newGroups]);
    } else {
      setGroups(newGroups);
    }
  };

  const handleEditMatch = (match: Match) => {
    setSelectedMatch(match);
    setShowScoreModal(true);
  };

  const handleSaveScore = (matchId: string, score: string) => {
    setMatches(prev => prev.map(match => 
      match.id === matchId 
        ? { ...match, score, status: 'completed' as const }
        : match
    ));
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
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {groups
            .filter(group => selectedCategory === 'all' || group.name.includes(selectedCategory))
            .map(group => (
              <div key={group.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-primary-600 text-white px-4 py-3">
                  <h3 className="text-lg font-bold">{group.name}</h3>
                </div>
                
                {/* Group standings table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Dupla</th>
                        <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase">V</th>
                        <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase">S.Sets</th>
                        <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase">S.Games</th>
                        <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase">G.Favor</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {group.teams.map((team, index) => (
                        <tr key={index} className={
                          index === 0 ? 'bg-accent-50' : 
                          index === 1 ? 'bg-green-50' : 
                          index === 2 ? 'bg-red-50' : ''
                        }>
                          <td className="px-3 py-2">
                            <div className="flex items-center">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mr-2 ${
                                index === 0 ? 'bg-accent-500 text-dark-900' : 
                                index === 1 ? 'bg-green-500 text-white' :
                                index === 2 ? 'bg-red-500 text-white' :
                                'bg-gray-200 text-gray-600'
                              }`}>
                                {index + 1}
                              </div>
                              <span className="text-xs font-medium text-dark-900 truncate">{team.name}</span>
                            </div>
                          </td>
                          <td className="px-2 py-2 text-center text-sm font-semibold text-dark-900">{team.wins}</td>
                          <td className="px-2 py-2 text-center text-sm text-dark-900">{team.setBalance > 0 ? '+' : ''}{team.setBalance}</td>
                          <td className="px-2 py-2 text-center text-sm text-dark-900">{team.gameBalance > 0 ? '+' : ''}{team.gameBalance}</td>
                          <td className="px-2 py-2 text-center text-sm text-dark-900">{team.gamesWon}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Group matches */}
                <div className="px-4 py-3 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-dark-800 mb-2">Jogos</h4>
                  <div className="space-y-2">
                    {group.matches.map(match => (
                      <div key={match.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs">
                        <div className="flex-1">
                          <div className="font-medium text-dark-900 truncate">
                            {match.team1.split(' / ')[0]} / {match.team1.split(' / ')[1]} vs {match.team2.split(' / ')[0]} / {match.team2.split(' / ')[1]}
                          </div>
                          <div className="text-dark-500">
                            {match.date} • {match.time} • {match.court}
                          </div>
                        </div>
                        <div className="text-right ml-2">
                          {match.status === 'completed' ? (
                            <span className="font-semibold text-dark-900">{match.score}</span>
                          ) : (
                            <span className="text-primary-600 font-medium">Agendado</span>
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
      <div className="space-y-3">
        {matches
          .filter(match => {
            const matchesDate = selectedDate === 'all' || match.date === selectedDate;
            const matchesCourt = selectedCourt === 'all' || match.court === selectedCourt;
            const matchesSearch = searchTerm === '' || 
              match.team1.toLowerCase().includes(searchTerm.toLowerCase()) ||
              match.team2.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesDate && matchesCourt && matchesSearch;
          })
          .map(match => (
            <div key={match.id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {match.id}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    match.status === 'completed' 
                      ? 'bg-accent-100 text-accent-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {match.status === 'completed' ? 'Finalizado' : 'Agendado'}
                  </div>
                </div>
                {isCreator && (
                  <button
                    onClick={() => handleEditMatch(match)}
                    className="p-2 text-dark-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                )}
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1 text-center">
                  <div className="font-bold text-dark-900">
                    {match.team1}
                  </div>
                </div>
                <div className="mx-6">
                  {match.status === 'completed' ? (
                    <div className="text-center">
                      <div className="text-xl font-bold text-dark-900">{match.score}</div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-xl font-bold text-primary-600">vs</div>
                    </div>
                  )}
                </div>
                <div className="flex-1 text-center">
                  <div className="font-bold text-dark-900">
                    {match.team2}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm text-dark-600">
                <div className="flex items-center">
                  <span className="font-medium mr-2">{match.court}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">{match.date}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">{match.time}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">{match.category}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">{match.group}</span>
                </div>
              </div>
            </div>
          ))}
        
        {/* Empty state if no matches found */}
        {matches.filter(match => {
          const matchesDate = selectedDate === 'all' || match.date === selectedDate;
          const matchesCourt = selectedCourt === 'all' || match.court === selectedCourt;
          const matchesSearch = searchTerm === '' || 
            match.team1.toLowerCase().includes(searchTerm.toLowerCase()) ||
            match.team2.toLowerCase().includes(searchTerm.toLowerCase());
          return matchesDate && matchesCourt && matchesSearch;
        }).length === 0 && (
          <div className="text-center py-12">
            <Play size={64} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-dark-900 mb-2">Nenhum jogo encontrado</h3>
            <p className="text-dark-500">
              Tente ajustar os filtros ou aguarde a programação dos jogos.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderLiveTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-dark-800">Transmissão Ao Vivo</h2>
        <p className="text-dark-600">Assista aos jogos em tempo real</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournament.courts.map((court, index) => {
          const isLive = index < 2; // Mock: first 2 courts are live
          const currentMatch = matches.find(m => m.court === court && m.status === 'scheduled');
          
          return (
            <div key={court} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="relative">
                <div className="bg-gradient-to-br from-primary-900 to-primary-700 h-32 flex items-center justify-center">
                  <Video size={48} className="text-white opacity-50" />
                </div>
                {isLive && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                    AO VIVO
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-bold text-dark-800 mb-2">{court}</h3>
                
                {currentMatch ? (
                  <div className="mb-4">
                    <div className="text-sm text-dark-600 mb-1">Agora:</div>
                    <div className="font-semibold text-dark-900 text-sm">
                      {currentMatch.team1} vs {currentMatch.team2}
                    </div>
                    <div className="text-xs text-dark-500">
                      {currentMatch.category} • {currentMatch.time}
                    </div>
                  </div>
                ) : (
                  <div className="mb-4">
                    <div className="text-sm text-dark-500">Próximo jogo em breve</div>
                  </div>
                )}
                
                <button 
                  className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center ${
                    isLive 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!isLive}
                >
                  <Play size={18} className="mr-2" />
                  {isLive ? 'Assistir Ao Vivo' : 'Transmissão Indisponível'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderResultsTab = () => {
    // Mock results data
    const results = [
      {
        category: 'Open Masculina',
        champion: { team: 'João Silva / Pedro Santos', score: '6-4, 6-3' },
        runnerUp: { team: 'Carlos Lima / Rafael Dias', score: '4-6, 3-6' }
      },
      {
        category: 'Open Feminina',
        champion: { team: 'Maria Costa / Ana Lima', score: '6-2, 6-1' },
        runnerUp: { team: 'Julia Rocha / Camila Souza', score: '2-6, 1-6' }
      },
      {
        category: '2ª Masculina',
        champion: { team: 'Bruno Alves / Diego Santos', score: '7-5, 6-4' },
        runnerUp: { team: 'Lucas Ferreira / Thiago Costa', score: '5-7, 4-6' }
      }
    ];

    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-dark-800">Resultados</h2>
            <p className="text-dark-600">Campeões e vice-campeões por categoria</p>
          </div>
          
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por nome do atleta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {results
            .filter(result => 
              searchTerm === '' ||
              result.champion.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
              result.runnerUp.team.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((result, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-primary-900 to-primary-700 text-white px-6 py-4">
                  <h3 className="text-lg font-bold">{result.category}</h3>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Champion */}
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-3">
                      <Crown size={32} className="text-yellow-500 mr-2" />
                      <span className="text-lg font-bold text-yellow-600">CAMPEÃO</span>
                    </div>
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                      <h4 className="text-xl font-bold text-dark-900 mb-2">
                        {result.champion.team}
                      </h4>
                      <div className="text-lg font-semibold text-yellow-700">
                        Final: {result.champion.score}
                      </div>
                    </div>
                  </div>

                  {/* Runner-up */}
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-3">
                      <Medal size={24} className="text-gray-400 mr-2" />
                      <span className="text-md font-semibold text-gray-600">VICE-CAMPEÃO</span>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <h4 className="text-lg font-semibold text-dark-800 mb-1">
                        {result.runnerUp.team}
                      </h4>
                      <div className="text-sm text-gray-600">
                        Final: {result.runnerUp.score}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {results.filter(result => 
          searchTerm === '' ||
          result.champion.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
          result.runnerUp.team.toLowerCase().includes(searchTerm.toLowerCase())
        ).length === 0 && (
          <div className="text-center py-12">
            <Award size={64} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-dark-900 mb-2">Nenhum resultado encontrado</h3>
            <p className="text-dark-500">
              Tente ajustar o termo de busca.
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderInfoTab = () => (
    <div className="space-y-4">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              {hasParticipantLimit && (
                <>
                  <div className="flex justify-between">
                    <span className="text-dark-600">Vagas:</span>
                    <span className="font-semibold text-dark-900">{realTournamentData.maxParticipants}</span>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-dark-600">Ocupação</span>
                      <span className="text-dark-600">
                        {Math.round((participants.length / realTournamentData.maxParticipants) * 100)}% ocupado
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-accent-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((participants.length / realTournamentData.maxParticipants) * 100, 100)}%` }}
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
        <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-dark-900 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
                  {tournament.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-white">
                  <div className="flex items-center">
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
              
              <div className="mt-4 lg:mt-0">
                {isCreator ? (
                  <button className="bg-accent-500 text-dark-900 px-4 py-2 rounded-lg font-semibold hover:bg-accent-400 transition-all duration-300 shadow-lg flex items-center">
                    <Edit2 size={18} className="mr-2" />
                    Editar
                  </button>
                ) : isAthlete ? (
                  <button className="bg-accent-500 text-dark-900 px-4 py-2 rounded-lg font-semibold hover:bg-accent-400 transition-all duration-300 shadow-lg flex items-center">
                    <Zap size={18} className="mr-2" />
                    Inscrever-se
                  </button>
                ) : !user ? (
                  <button className="bg-accent-500 text-dark-900 px-4 py-2 rounded-lg font-semibold hover:bg-accent-400 transition-all duration-300 shadow-lg flex items-center">
                    <Zap size={18} className="mr-2" />
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
                    className={`flex items-center py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'info' && renderInfoTab()}
          {activeTab === 'inscritos' && renderParticipantsTab()}
          {activeTab === 'grupos' && renderGroupsTab()}
          {activeTab === 'jogos' && renderMatchesTab()}
          {activeTab === 'ao-vivo' && renderLiveTab()}
          {activeTab === 'resultados' && renderResultsTab()}
        </div>
      </div>

      <AIParticipantsModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        categories={tournament.categories}
        onConfirm={generateAIParticipants}
      />

      <ScoreModal
        isOpen={showScoreModal}
        onClose={() => setShowScoreModal(false)}
        match={selectedMatch}
        onSave={handleSaveScore}
      />
    </div>
  );
};

export default TournamentDetail;