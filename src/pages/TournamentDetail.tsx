import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Trophy, 
  Clock, 
  DollarSign,
  Phone,
  Mail,
  Globe,
  FileText,
  HelpCircle,
  Play,
  Award,
  Target,
  Zap,
  ArrowLeft,
  Share2,
  Heart,
  User,
  Building2,
  Plus,
  X,
  Search
} from 'lucide-react';

interface TournamentData {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationFee: number;
  maxParticipants: number;
  participantsCount: number;
  status: string;
  mainClub: string;
  city: string;
  state: string;
  categories: string[];
  courts: Array<{ id: string; name: string }>;
  bannerImage?: string;
  profileImage?: string;
  sponsors: Array<{ name: string; image: string }>;
  streamingLinks: Array<{ courtName: string; link: string }>;
  dailySchedules: Array<{ date: string; startTime: string; endTime: string }>;
}

interface Participant {
  id: string;
  name: string;
  partner: string;
  category: string;
  avatar: string;
}

interface Group {
  id: string;
  category: string;
  groupName: string;
  teams: Array<{ player1: string; player2: string; avatar: string }>;
}

interface Match {
  id: string;
  date: string;
  time: string;
  court: string;
  team1: string;
  team2: string;
  category: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  score?: string;
}

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  onConfirm: (quantity: number, category: string) => void;
}

const AIModal: React.FC<AIModalProps> = ({ isOpen, onClose, categories, onConfirm }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedCategory) {
      onConfirm(quantity, selectedCategory);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Adicionar Duplas com AI</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantidade de Duplas
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end space-x-2 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedCategory}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TournamentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [tournament, setTournament] = useState<TournamentData | null>(null);
  const [activeTab, setActiveTab] = useState('informacoes');
  const [activeInfoTab, setActiveInfoTab] = useState('gerais');
  const [loading, setLoading] = useState(true);
  const [showAIModal, setShowAIModal] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('all');
  const [selectedCourt, setSelectedCourt] = useState('all');

  useEffect(() => {
    // Check if there's a tab parameter in the URL
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  useEffect(() => {
    // Load tournament data from localStorage
    const clubTournaments = JSON.parse(localStorage.getItem('clubTournaments') || '[]');
    const foundTournament = clubTournaments.find((t: any) => t.id === id);
    
    if (foundTournament) {
      // Ensure registrationFee is a number
      const processedTournament = {
        ...foundTournament,
        registrationFee: parseFloat(foundTournament.registrationFee) || 0,
        maxParticipants: parseInt(foundTournament.maxParticipants) || 0,
        participantsCount: parseInt(foundTournament.participantsCount) || 0
      };
      setTournament(processedTournament);
    }

    // Load participants from localStorage
    const savedParticipants = localStorage.getItem(`tournament_${id}_participants`);
    if (savedParticipants) {
      setParticipants(JSON.parse(savedParticipants));
    }

    // Load groups from localStorage
    const savedGroups = localStorage.getItem(`tournament_${id}_groups`);
    if (savedGroups) {
      setGroups(JSON.parse(savedGroups));
    }

    // Load matches from localStorage
    const savedMatches = localStorage.getItem(`tournament_${id}_matches`);
    if (savedMatches) {
      setMatches(JSON.parse(savedMatches));
    }

    setLoading(false);
  }, [id]);

  const generateRandomNames = () => {
    const firstNames = [
      'João', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Julia', 'Rafael', 'Camila',
      'Lucas', 'Fernanda', 'Bruno', 'Beatriz', 'Diego', 'Larissa', 'Thiago', 'Mariana',
      'Gabriel', 'Isabela', 'Felipe', 'Carolina', 'Rodrigo', 'Natália', 'André', 'Patrícia'
    ];
    
    const lastNames = [
      'Silva', 'Santos', 'Costa', 'Lima', 'Rocha', 'Dias', 'Alves', 'Souza',
      'Oliveira', 'Pereira', 'Ferreira', 'Barbosa', 'Ribeiro', 'Martins', 'Carvalho', 'Gomes'
    ];

    const avatars = [
      'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
      'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
      'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg',
      'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg',
      'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
      'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg'
    ];

    const getRandomName = () => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      return `${firstName} ${lastName}`;
    };

    const getRandomAvatar = () => {
      return avatars[Math.floor(Math.random() * avatars.length)];
    };

    return { getRandomName, getRandomAvatar };
  };

  const handleAIConfirm = (quantity: number, category: string) => {
    const { getRandomName, getRandomAvatar } = generateRandomNames();
    const newParticipants: Participant[] = [];

    for (let i = 0; i < quantity; i++) {
      const player1 = getRandomName();
      const player2 = getRandomName();
      
      newParticipants.push({
        id: `ai_${Date.now()}_${i}`,
        name: player1,
        partner: player2,
        category: category,
        avatar: getRandomAvatar()
      });
    }

    const updatedParticipants = [...participants, ...newParticipants];
    setParticipants(updatedParticipants);
    
    // Save to localStorage
    localStorage.setItem(`tournament_${id}_participants`, JSON.stringify(updatedParticipants));
  };

  const generateGroups = (category?: string) => {
    const categoriesToGenerate = category ? [category] : tournament?.categories || [];
    const newGroups: Group[] = [];

    categoriesToGenerate.forEach(cat => {
      const categoryParticipants = participants.filter(p => p.category === cat);
      const teamsPerGroup = 4;
      const numberOfGroups = Math.ceil(categoryParticipants.length / teamsPerGroup);

      for (let i = 0; i < numberOfGroups; i++) {
        const groupTeams = categoryParticipants
          .slice(i * teamsPerGroup, (i + 1) * teamsPerGroup)
          .map(p => ({
            player1: p.name,
            player2: p.partner,
            avatar: p.avatar
          }));

        if (groupTeams.length > 0) {
          newGroups.push({
            id: `group_${cat}_${i + 1}`,
            category: cat,
            groupName: `Grupo ${String.fromCharCode(65 + i)}`,
            teams: groupTeams
          });
        }
      }
    });

    const updatedGroups = category 
      ? [...groups.filter(g => g.category !== category), ...newGroups]
      : newGroups;
    
    setGroups(updatedGroups);
    localStorage.setItem(`tournament_${id}_groups`, JSON.stringify(updatedGroups));
  };

  const generateMatches = () => {
    if (!tournament) return;

    const newMatches: Match[] = [];
    const courts = tournament.courts;
    const schedules = tournament.dailySchedules;

    groups.forEach(group => {
      const teams = group.teams;
      let matchIndex = 0;

      // Generate round-robin matches for each group
      for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
          const scheduleIndex = matchIndex % schedules.length;
          const courtIndex = matchIndex % courts.length;
          const timeSlots = ['08:00', '09:30', '11:00', '14:00', '15:30', '17:00'];
          const timeIndex = matchIndex % timeSlots.length;

          newMatches.push({
            id: `match_${group.id}_${i}_${j}`,
            date: schedules[scheduleIndex]?.date || tournament.startDate,
            time: timeSlots[timeIndex],
            court: courts[courtIndex]?.name || 'Quadra 1',
            team1: `${teams[i].player1} / ${teams[i].player2}`,
            team2: `${teams[j].player1} / ${teams[j].player2}`,
            category: group.category,
            status: 'scheduled'
          });

          matchIndex++;
        }
      }
    });

    setMatches(newMatches);
    localStorage.setItem(`tournament_${id}_matches`, JSON.stringify(newMatches));
  };

  const mainTabs = [
    { id: 'informacoes', label: 'Informações', icon: FileText },
    { id: 'inscritos', label: 'Inscritos', icon: Users },
    { id: 'grupos', label: 'Grupos', icon: Target },
    { id: 'jogos', label: 'Jogos', icon: Trophy },
    { id: 'ao-vivo', label: 'Ao Vivo', icon: Play },
    { id: 'resultados', label: 'Resultados', icon: Award }
  ];

  const infoTabs = [
    { id: 'gerais', label: 'Gerais' },
    { id: 'contato', label: 'Contato' },
    { id: 'localizacao', label: 'Localização' },
    { id: 'regras', label: 'Regras' },
    { id: 'faq', label: 'FAQ' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-light">
        <Navbar />
        <div className="pt-16 flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-light">
        <Navbar />
        <div className="pt-16 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-dark-800 mb-4">Torneio não encontrado</h1>
            <Link to="/tournaments" className="text-primary-600 hover:text-primary-700">
              Voltar para torneios
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const renderInfoContent = () => {
    switch (activeInfoTab) {
      case 'gerais':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-dark-800 mb-4 flex items-center">
                  <Calendar size={20} className="mr-2 text-primary-600" />
                  Datas do Torneio
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-dark-600">Início:</span>
                    <span className="font-semibold">{new Date(tournament.startDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-600">Fim:</span>
                    <span className="font-semibold">{new Date(tournament.endDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-600">Duração:</span>
                    <span className="font-semibold">
                      {Math.ceil((new Date(tournament.endDate).getTime() - new Date(tournament.startDate).getTime()) / (1000 * 60 * 60 * 24))} dias
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-dark-800 mb-4 flex items-center">
                  <DollarSign size={20} className="mr-2 text-accent-500" />
                  Informações de Inscrição
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-dark-600">Taxa:</span>
                    <span className="font-semibold text-accent-600">R$ {tournament.registrationFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-600">Vagas:</span>
                    <span className="font-semibold">{tournament.maxParticipants}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-600">Inscritos:</span>
                    <span className="font-semibold text-primary-600">{tournament.participantsCount}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-dark-800 mb-4">Descrição</h3>
              <p className="text-dark-600 leading-relaxed">
                {tournament.description || 'Descrição não disponível.'}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-dark-800 mb-4">Categorias</h3>
              <div className="flex flex-wrap gap-2">
                {tournament.categories.map((category, index) => (
                  <span key={index} className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {category}
                  </span>
                ))}
              </div>
            </div>

            {tournament.sponsors && tournament.sponsors.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-dark-800 mb-4">Patrocinadores</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {tournament.sponsors.map((sponsor, index) => (
                    <div key={index} className="text-center">
                      <img
                        src={sponsor.image}
                        alt={sponsor.name}
                        className="h-16 object-contain mx-auto mb-2"
                      />
                      <p className="text-sm font-medium text-dark-700">{sponsor.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'contato':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-dark-800 mb-6 flex items-center">
              <Building2 size={20} className="mr-2 text-primary-600" />
              Informações de Contato
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Building2 size={18} className="text-dark-500 mr-3" />
                <div>
                  <span className="text-dark-600">Clube organizador:</span>
                  <span className="font-semibold ml-2">{tournament.mainClub}</span>
                </div>
              </div>
              <div className="flex items-center">
                <Phone size={18} className="text-dark-500 mr-3" />
                <div>
                  <span className="text-dark-600">Telefone:</span>
                  <span className="font-semibold ml-2">(11) 9999-9999</span>
                </div>
              </div>
              <div className="flex items-center">
                <Mail size={18} className="text-dark-500 mr-3" />
                <div>
                  <span className="text-dark-600">E-mail:</span>
                  <span className="font-semibold ml-2">contato@{tournament.mainClub.toLowerCase().replace(/\s+/g, '')}.com</span>
                </div>
              </div>
              <div className="flex items-center">
                <Globe size={18} className="text-dark-500 mr-3" />
                <div>
                  <span className="text-dark-600">Website:</span>
                  <span className="font-semibold ml-2">www.{tournament.mainClub.toLowerCase().replace(/\s+/g, '')}.com</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'localizacao':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-dark-800 mb-6 flex items-center">
              <MapPin size={20} className="mr-2 text-primary-600" />
              Localização
            </h3>
            <div className="space-y-4">
              <div>
                <span className="text-dark-600">Cidade:</span>
                <span className="font-semibold ml-2">{tournament.city}, {tournament.state}</span>
              </div>
              <div>
                <span className="text-dark-600">Endereço:</span>
                <span className="font-semibold ml-2">Rua do Padel, 123 - Centro</span>
              </div>
              <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                <p className="text-dark-500">Mapa será carregado aqui</p>
              </div>
            </div>
          </div>
        );

      case 'regras':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-dark-800 mb-6 flex items-center">
              <FileText size={20} className="mr-2 text-primary-600" />
              Regras do Torneio
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-dark-800 mb-2">1. Formato do Torneio</h4>
                <p className="text-dark-600">Sistema de eliminação simples com melhor de 3 sets.</p>
              </div>
              <div>
                <h4 className="font-semibold text-dark-800 mb-2">2. Pontuação</h4>
                <p className="text-dark-600">Jogos até 6 games, com tie-break em 6-6. Set decisivo até 10 pontos.</p>
              </div>
              <div>
                <h4 className="font-semibold text-dark-800 mb-2">3. Equipamentos</h4>
                <p className="text-dark-600">Raquetes homologadas pela FIP. Bolas oficiais fornecidas pela organização.</p>
              </div>
              <div>
                <h4 className="font-semibold text-dark-800 mb-2">4. Comportamento</h4>
                <p className="text-dark-600">Fair play obrigatório. Desrespeito resultará em desqualificação.</p>
              </div>
            </div>
          </div>
        );

      case 'faq':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-dark-800 mb-6 flex items-center">
              <HelpCircle size={20} className="mr-2 text-primary-600" />
              Perguntas Frequentes
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-dark-800 mb-2">Posso cancelar minha inscrição?</h4>
                <p className="text-dark-600">Sim, até 48 horas antes do início do torneio com reembolso de 80%.</p>
              </div>
              <div>
                <h4 className="font-semibold text-dark-800 mb-2">E se chover?</h4>
                <p className="text-dark-600">Temos quadras cobertas disponíveis. O torneio não será cancelado.</p>
              </div>
              <div>
                <h4 className="font-semibold text-dark-800 mb-2">Posso trocar de parceiro?</h4>
                <p className="text-dark-600">Mudanças de parceiro são permitidas até 24 horas antes do torneio.</p>
              </div>
              <div>
                <h4 className="font-semibold text-dark-800 mb-2">Há estacionamento?</h4>
                <p className="text-dark-600">Sim, estacionamento gratuito para todos os participantes.</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'informacoes':
        return (
          <div>
            <div className="flex flex-wrap gap-2 mb-6 bg-white rounded-lg p-2 shadow-sm border border-gray-100">
              {infoTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveInfoTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeInfoTab === tab.id
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'text-dark-600 hover:bg-primary-50 hover:text-primary-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {renderInfoContent()}
          </div>
        );

      case 'inscritos':
        const participantsByCategory = participants.reduce((acc, participant) => {
          if (!acc[participant.category]) {
            acc[participant.category] = [];
          }
          acc[participant.category].push(participant);
          return acc;
        }, {} as Record<string, Participant[]>);

        const filteredParticipants = participants.filter(participant => {
          const matchesCategory = selectedCategory === 'all' || participant.category === selectedCategory;
          const matchesSearch = searchTerm === '' || 
            participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            participant.partner.toLowerCase().includes(searchTerm.toLowerCase());
          return matchesCategory && matchesSearch;
        });

        const filteredByCategory = filteredParticipants.reduce((acc, participant) => {
          if (!acc[participant.category]) {
            acc[participant.category] = [];
          }
          acc[participant.category].push(participant);
          return acc;
        }, {} as Record<string, Participant[]>);

        return (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-bold text-dark-800">Participantes Inscritos</h3>
                  <p className="text-dark-600">{participants.length} duplas inscritas</p>
                </div>
                <button
                  onClick={() => setShowAIModal(true)}
                  className="bg-gradient-to-r from-accent-500 to-accent-400 text-dark-900 px-4 py-2 rounded-lg hover:from-accent-400 hover:to-accent-300 transition-all duration-300 flex items-center font-semibold"
                >
                  <Plus size={16} className="mr-2" />
                  Dupla c/ AI
                </button>
              </div>

              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar por nome do atleta..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-dark-600 hover:bg-primary-50 hover:text-primary-700'
                  }`}
                >
                  Todas ({participants.length})
                </button>
                {tournament.categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-dark-600 hover:bg-primary-50 hover:text-primary-700'
                    }`}
                  >
                    {category} ({participantsByCategory[category]?.length || 0})
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {Object.keys(filteredByCategory).length === 0 ? (
                <div className="text-center py-12">
                  <Users size={64} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-dark-500">
                    {searchTerm ? 'Nenhum atleta encontrado com esse nome' : 'Nenhuma dupla inscrita ainda'}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(filteredByCategory).map(([category, categoryParticipants]) => (
                    <div key={category}>
                      <h4 className="text-lg font-semibold text-dark-800 mb-3 flex items-center">
                        <Trophy size={18} className="mr-2 text-primary-600" />
                        {category} ({categoryParticipants.length} duplas)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {categoryParticipants.map(participant => (
                          <div key={participant.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                            <img
                              src={participant.avatar}
                              alt={participant.name}
                              className="w-12 h-12 rounded-full object-cover mr-4"
                            />
                            <div>
                              <h5 className="font-semibold text-dark-800">
                                {participant.name} / {participant.partner}
                              </h5>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'grupos':
        const groupsByCategory = groups.reduce((acc, group) => {
          if (!acc[group.category]) {
            acc[group.category] = [];
          }
          acc[group.category].push(group);
          return acc;
        }, {} as Record<string, Group[]>);

        const filteredGroups = groups.filter(group => {
          const matchesCategory = selectedCategory === 'all' || group.category === selectedCategory;
          const matchesSearch = searchTerm === '' || 
            group.teams.some(team => 
              team.player1.toLowerCase().includes(searchTerm.toLowerCase()) ||
              team.player2.toLowerCase().includes(searchTerm.toLowerCase())
            );
          return matchesCategory && matchesSearch;
        });

        const filteredGroupsByCategory = filteredGroups.reduce((acc, group) => {
          if (!acc[group.category]) {
            acc[group.category] = [];
          }
          acc[group.category].push(group);
          return acc;
        }, {} as Record<string, Group[]>);

        return (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-dark-800">Grupos e Chaveamento</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => generateGroups(selectedCategory === 'all' ? undefined : selectedCategory)}
                    className="bg-gradient-to-r from-primary-900 to-primary-700 text-white px-4 py-2 rounded-lg hover:from-primary-800 hover:to-primary-600 transition-all duration-300 flex items-center font-semibold"
                  >
                    <Target size={16} className="mr-2" />
                    {selectedCategory === 'all' ? 'Gerar Todas' : 'Gerar Categoria'}
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar por nome do atleta..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-dark-600 hover:bg-primary-50 hover:text-primary-700'
                  }`}
                >
                  Todas ({groups.length})
                </button>
                {tournament.categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-dark-600 hover:bg-primary-50 hover:text-primary-700'
                    }`}
                  >
                    {category} ({groupsByCategory[category]?.length || 0})
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {Object.keys(filteredGroupsByCategory).length === 0 ? (
                <div className="text-center py-12">
                  <Target size={64} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-dark-500">
                    {searchTerm ? 'Nenhum grupo encontrado' : 'Os grupos serão definidos após gerar o chaveamento'}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(filteredGroupsByCategory).map(([category, categoryGroups]) => (
                    <div key={category}>
                      <h4 className="text-lg font-semibold text-dark-800 mb-3 flex items-center">
                        <Trophy size={18} className="mr-2 text-primary-600" />
                        {category}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categoryGroups.map(group => (
                          <div key={group.id} className="bg-gray-50 rounded-lg p-4">
                            <h5 className="font-semibold text-dark-800 mb-3">{group.groupName}</h5>
                            <div className="space-y-2">
                              {group.teams.map((team, index) => (
                                <div key={index} className="flex items-center">
                                  <img
                                    src={team.avatar}
                                    alt={team.player1}
                                    className="w-8 h-8 rounded-full object-cover mr-3"
                                  />
                                  <span className="text-sm text-dark-700">
                                    {team.player1} / {team.player2}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'jogos':
        const matchesByDate = matches.reduce((acc, match) => {
          if (!acc[match.date]) {
            acc[match.date] = [];
          }
          acc[match.date].push(match);
          return acc;
        }, {} as Record<string, Match[]>);

        const matchesByCourt = matches.reduce((acc, match) => {
          if (!acc[match.court]) {
            acc[match.court] = [];
          }
          acc[match.court].push(match);
          return acc;
        }, {} as Record<string, Match[]>);

        const filteredMatches = matches.filter(match => {
          const matchesCategory = selectedCategory === 'all' || match.category === selectedCategory;
          const matchesDate = selectedDate === 'all' || match.date === selectedDate;
          const matchesCourt = selectedCourt === 'all' || match.court === selectedCourt;
          const matchesSearch = searchTerm === '' || 
            match.team1.toLowerCase().includes(searchTerm.toLowerCase()) ||
            match.team2.toLowerCase().includes(searchTerm.toLowerCase());
          return matchesCategory && matchesDate && matchesCourt && matchesSearch;
        });

        const uniqueDates = [...new Set(matches.map(m => m.date))];
        const uniqueCourts = [...new Set(matches.map(m => m.court))];

        return (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-dark-800">Programação de Jogos</h3>
                <button
                  onClick={generateMatches}
                  className="bg-gradient-to-r from-primary-900 to-primary-700 text-white px-4 py-2 rounded-lg hover:from-primary-800 hover:to-primary-600 transition-all duration-300 flex items-center font-semibold"
                >
                  <Trophy size={16} className="mr-2" />
                  Gerar Jogos
                </button>
              </div>

              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar por nome do atleta..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="space-y-4">
                {/* Category Tabs */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categorias</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedCategory === 'all'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-dark-600 hover:bg-primary-50 hover:text-primary-700'
                      }`}
                    >
                      Todas
                    </button>
                    {tournament.categories.map(category => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          selectedCategory === category
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-dark-600 hover:bg-primary-50 hover:text-primary-700'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Tabs */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Datas</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedDate('all')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedDate === 'all'
                          ? 'bg-accent-600 text-white'
                          : 'bg-gray-100 text-dark-600 hover:bg-accent-50 hover:text-accent-700'
                      }`}
                    >
                      Todas
                    </button>
                    {uniqueDates.map(date => (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          selectedDate === date
                            ? 'bg-accent-600 text-white'
                            : 'bg-gray-100 text-dark-600 hover:bg-accent-50 hover:text-accent-700'
                        }`}
                      >
                        {new Date(date).toLocaleDateString('pt-BR')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Court Tabs */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quadras</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedCourt('all')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedCourt === 'all'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-dark-600 hover:bg-primary-50 hover:text-primary-700'
                      }`}
                    >
                      Todas
                    </button>
                    {uniqueCourts.map(court => (
                      <button
                        key={court}
                        onClick={() => setSelectedCourt(court)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          selectedCourt === court
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-dark-600 hover:bg-primary-50 hover:text-primary-700'
                        }`}
                      >
                        {court}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              {filteredMatches.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy size={64} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-dark-500">
                    {searchTerm ? 'Nenhuma partida encontrada' : 'As partidas serão geradas após criar os grupos'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredMatches.map(match => (
                    <div key={match.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <Clock size={16} className="text-primary-600 mx-auto mb-1" />
                          <span className="text-sm font-semibold">{match.time}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-dark-800">{match.team1} vs {match.team2}</h4>
                          <p className="text-sm text-dark-600">
                            {match.court} • {match.category} • {new Date(match.date).toLocaleDateString('pt-BR')}
                          </p>
                          {match.score && (
                            <p className="text-sm text-primary-600 font-semibold">{match.score}</p>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        match.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                        match.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {match.status === 'scheduled' ? 'Agendado' :
                         match.status === 'in-progress' ? 'Em Andamento' : 'Finalizado'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'ao-vivo':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-dark-800 mb-4 flex items-center">
              <Play size={20} className="mr-2 text-accent-500" />
              Transmissões Ao Vivo
            </h3>
            {tournament.streamingLinks && tournament.streamingLinks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tournament.streamingLinks.map((stream, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-dark-800 mb-2">{stream.courtName}</h4>
                    <a
                      href={stream.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-accent-500 text-dark-900 px-4 py-2 rounded-lg hover:bg-accent-400 transition-colors font-semibold"
                    >
                      <Play size={16} className="mr-2" />
                      Assistir Ao Vivo
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Play size={64} className="text-gray-300 mx-auto mb-4" />
                <p className="text-dark-500">Nenhuma transmissão ao vivo disponível no momento</p>
              </div>
            )}
          </div>
        );

      case 'resultados':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-dark-800 mb-4 flex items-center">
              <Award size={20} className="mr-2 text-accent-500" />
              Resultados
            </h3>
            <div className="text-center py-12">
              <Award size={64} className="text-gray-300 mx-auto mb-4" />
              <p className="text-dark-500">Os resultados serão publicados após o término das partidas</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      
      <div className="pt-16">
        {/* Hero Section */}
        <div className="relative">
          {tournament.bannerImage ? (
            <div className="h-80 bg-cover bg-center relative" style={{ backgroundImage: `url(${tournament.bannerImage})` }}>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 to-dark-900/60"></div>
            </div>
          ) : (
            <div className="h-80 bg-gradient-to-br from-primary-900 via-primary-800 to-dark-900"></div>
          )}
          
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full">
              <div className="flex items-center mb-4">
                <Link to="/tournaments" className="text-white hover:text-accent-500 transition-colors mr-4">
                  <ArrowLeft size={24} />
                </Link>
                <div className="flex items-center space-x-4">
                  <button className="text-white hover:text-accent-500 transition-colors">
                    <Heart size={24} />
                  </button>
                  <button className="text-white hover:text-accent-500 transition-colors">
                    <Share2 size={24} />
                  </button>
                </div>
              </div>
              
              <div className="flex items-end space-x-6">
                {tournament.profileImage && (
                  <img
                    src={tournament.profileImage}
                    alt={tournament.name}
                    className="w-24 h-24 rounded-xl object-cover border-4 border-white shadow-lg"
                  />
                )}
                <div className="flex-1">
                  <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
                    {tournament.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-white">
                    <div className="flex items-center">
                      <Building2 size={18} className="mr-2" />
                      <span>{tournament.mainClub}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin size={18} className="mr-2" />
                      <span>{tournament.city}, {tournament.state}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={18} className="mr-2" />
                      <span>{new Date(tournament.startDate).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <button className="bg-gradient-to-r from-accent-500 to-accent-400 text-dark-900 px-8 py-3 rounded-xl font-bold text-lg hover:from-accent-400 hover:to-accent-300 transition-all duration-300 shadow-xl">
                    <Zap size={20} className="inline mr-2" />
                    Inscrever-se
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8 overflow-x-auto">
              {mainTabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-dark-500 hover:text-dark-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderTabContent()}
        </div>
      </div>

      <AIModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        categories={tournament?.categories || []}
        onConfirm={handleAIConfirm}
      />
    </div>
  );
};

export default TournamentDetail;