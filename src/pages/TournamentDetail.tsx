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
  X
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

  const mockMatches = [
    { id: 1, time: '08:00', court: 'Quadra 1', team1: 'João & Maria', team2: 'Pedro & Ana', category: 'Open Masculina', status: 'scheduled' },
    { id: 2, time: '09:30', court: 'Quadra 2', team1: 'Carlos & Julia', team2: 'Rafael & Camila', category: 'Mista A', status: 'in-progress' },
    { id: 3, time: '11:00', court: 'Quadra 1', team1: 'Lucas & Bruno', team2: 'Diego & Felipe', category: 'Open Masculina', status: 'completed' }
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

        return (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
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
            </div>
            <div className="p-6">
              {Object.keys(participantsByCategory).length === 0 ? (
                <div className="text-center py-12">
                  <Users size={64} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-dark-500">Nenhuma dupla inscrita ainda</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(participantsByCategory).map(([category, categoryParticipants]) => (
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
                              <h5 className="font-semibold text-dark-800">{participant.name}</h5>
                              <p className="text-sm text-dark-600">Parceiro: {participant.partner}</p>
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
        return (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-dark-800 mb-4">Grupos e Chaveamento</h3>
            <div className="text-center py-12">
              <Target size={64} className="text-gray-300 mx-auto mb-4" />
              <p className="text-dark-500">Os grupos serão definidos após o encerramento das inscrições</p>
            </div>
          </div>
        );

      case 'jogos':
        return (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-dark-800">Programação de Jogos</h3>
              <p className="text-dark-600">Próximas partidas agendadas</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {mockMatches.map(match => (
                  <div key={match.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <Clock size={16} className="text-primary-600 mx-auto mb-1" />
                        <span className="text-sm font-semibold">{match.time}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-dark-800">{match.team1} vs {match.team2}</h4>
                        <p className="text-sm text-dark-600">{match.court} • {match.category}</p>
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