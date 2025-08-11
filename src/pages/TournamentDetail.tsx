import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/DashboardHeader';
import Navbar from '../components/Navbar';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Trophy, 
  DollarSign,
  Phone,
  Mail,
  Instagram,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Edit2,
  Play,
  Crown,
  Medal,
  Award,
  Info,
  HelpCircle,
  Navigation,
  Building2,
  Zap,
  Star,
  CheckCircle,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ScoreEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: any;
  onSave: (matchId: string, team1Score: number[], team2Score: number[], winner: number) => void;
}

const ScoreEditModal: React.FC<ScoreEditModalProps> = ({ isOpen, onClose, match, onSave }) => {
  const [team1Sets, setTeam1Sets] = useState<number[]>([0, 0, 0]);
  const [team2Sets, setTeam2Sets] = useState<number[]>([0, 0, 0]);

  useEffect(() => {
    if (match && isOpen) {
      setTeam1Sets(match.team1Score || [0, 0, 0]);
      setTeam2Sets(match.team2Score || [0, 0, 0]);
    }
  }, [match, isOpen]);

  if (!isOpen || !match) return null;

  const handleSave = () => {
    const team1Total = team1Sets.reduce((a, b) => a + b, 0);
    const team2Total = team2Sets.reduce((a, b) => a + b, 0);
    const winner = team1Total > team2Total ? 1 : 2;
    
    onSave(match.id, team1Sets, team2Sets, winner);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">Editar Placar</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <p className="font-medium text-gray-900">{match.team1}</p>
            <p className="text-sm text-gray-600">vs</p>
            <p className="font-medium text-gray-900">{match.team2}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {match.team1}
              </label>
              {[0, 1, 2].map(setIndex => (
                <input
                  key={setIndex}
                  type="number"
                  min="0"
                  max="7"
                  value={team1Sets[setIndex]}
                  onChange={(e) => {
                    const newSets = [...team1Sets];
                    newSets[setIndex] = parseInt(e.target.value) || 0;
                    setTeam1Sets(newSets);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                  placeholder={`Set ${setIndex + 1}`}
                />
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {match.team2}
              </label>
              {[0, 1, 2].map(setIndex => (
                <input
                  key={setIndex}
                  type="number"
                  min="0"
                  max="7"
                  value={team2Sets[setIndex]}
                  onChange={(e) => {
                    const newSets = [...team2Sets];
                    newSets[setIndex] = parseInt(e.target.value) || 0;
                    setTeam2Sets(newSets);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                  placeholder={`Set ${setIndex + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TournamentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [tournament, setTournament] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('informacoes');
  const [activeSubTab, setActiveSubTab] = useState('gerais');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);

  // Check if current user is the tournament creator
  const isCreator = user && profile?.user_type === 'club' && tournament?.club_id === user.id;

  useEffect(() => {
    const loadTournament = () => {
      const clubTournaments = JSON.parse(localStorage.getItem('clubTournaments') || '[]');
      const foundTournament = clubTournaments.find((t: any) => t.id === id);
      
      if (foundTournament) {
        setTournament(foundTournament);
      }
      setLoading(false);
    };

    loadTournament();
  }, [id]);

  const handleEditScore = (match: any) => {
    setSelectedMatch(match);
    setEditModalOpen(true);
  };

  const handleSaveScore = (matchId: string, team1Score: number[], team2Score: number[], winner: number) => {
    // Update match score logic here
    console.log('Saving score:', { matchId, team1Score, team2Score, winner });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Torneio não encontrado</h2>
          <button
            onClick={() => navigate('/tournaments')}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
          >
            Voltar aos Torneios
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'informacoes', name: 'Informações', icon: Info },
    { id: 'inscritos', name: 'Inscritos', icon: Users },
    { id: 'grupos', name: 'Grupos', icon: Trophy },
    { id: 'jogos', name: 'Jogos', icon: Calendar },
    { id: 'agenda', name: 'Agenda', icon: Clock },
    { id: 'resultados', name: 'Resultados', icon: Medal },
    { id: 'ao-vivo', name: 'Ao Vivo', icon: Play }
  ];

  const subTabs = [
    { id: 'gerais', name: 'Gerais' },
    { id: 'contato', name: 'Contato' },
    { id: 'localizacao', name: 'Localização' },
    { id: 'regras', name: 'Regras' },
    { id: 'faq', name: 'FAQ' }
  ];

  const mockGroups = [
    {
      name: 'Grupo A',
      teams: [
        { name: 'João Silva / Pedro Santos', wins: 2, gamesFor: 24, gamesAgainst: 18, position: 1 },
        { name: 'Maria Costa / Ana Lima', wins: 1, gamesFor: 20, gamesAgainst: 22, position: 2 },
        { name: 'Carlos Dias / Rafael Alves', wins: 0, gamesFor: 16, gamesAgainst: 20, position: 3 }
      ],
      matches: [
        { id: '1', team1: 'João Silva / Pedro Santos', team2: 'Maria Costa / Ana Lima', score: '6-4, 6-3', status: 'completed', team1Score: [6, 6], team2Score: [4, 3] },
        { id: '2', team1: 'João Silva / Pedro Santos', team2: 'Carlos Dias / Rafael Alves', score: 'vs', status: 'scheduled', team1Score: [], team2Score: [] },
        { id: '3', team1: 'Maria Costa / Ana Lima', team2: 'Carlos Dias / Rafael Alves', score: 'vs', status: 'scheduled', team1Score: [], team2Score: [] }
      ]
    }
  ];

  const mockMatches = [
    { id: 'MATCH001', team1: 'João Silva / Pedro Santos', team2: 'Carlos Lima / Rafael Dias', score: '6-4, 6-3', status: 'Finalizado', court: 'Quadra 1', date: '11/07/2025', time: '09:00', category: 'Open Masculina', group: 'Grupo A' },
    { id: 'MATCH002', team1: 'Maria Costa / Ana Lima', team2: 'Julia Rocha / Camila Souza', score: 'vs', status: 'Agendado', court: 'Quadra 2', date: '11/07/2025', time: '10:30', category: 'Open Feminina', group: 'Grupo B' }
  ];

  const mockCourts = [
    { id: '1', name: 'Quadra Central', status: 'Ao Vivo', match: 'João Silva / Pedro vs Maria Costa / Ana', streamUrl: 'https://youtube.com/live/123' },
    { id: '2', name: 'Quadra 2', status: 'Próximo', match: 'Carlos Lima / Rafael vs Julia Rocha / Camila', streamUrl: null },
    { id: '3', name: 'Quadra 3', status: 'Livre', match: null, streamUrl: null }
  ];

  const mockChampions = [
    { category: 'Open Masculina', champion: 'João Silva / Pedro Santos', runnerUp: 'Carlos Lima / Rafael Dias', finalScore: '6-4, 6-3' },
    { category: 'Open Feminina', champion: 'Maria Costa / Ana Lima', runnerUp: 'Julia Rocha / Camila Souza', finalScore: '7-5, 6-4' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'informacoes':
        return renderInformacoes();
      case 'inscritos':
        return renderInscritos();
      case 'grupos':
        return renderGrupos();
      case 'jogos':
        return renderJogos();
      case 'agenda':
        return renderAgenda();
      case 'resultados':
        return renderResultados();
      case 'ao-vivo':
        return renderAoVivo();
      default:
        return renderInformacoes();
    }
  };

  const renderInformacoes = () => {
    switch (activeSubTab) {
      case 'gerais':
        return (
          <div className="space-y-8">
            {/* Descrição do Torneio */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <Info className="text-purple-600 mr-3" size={24} />
                <h3 className="text-xl font-bold text-gray-900">Descrição do Torneio</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {tournament.description || 'Torneio de padel com as melhores duplas da região. Venha participar desta competição emocionante e mostre suas habilidades nas quadras!'}
              </p>
            </div>

            {/* Datas Importantes */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <Calendar className="text-purple-600 mr-3" size={24} />
                <h3 className="text-xl font-bold text-gray-900">Datas Importantes</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                  <CheckCircle className="text-green-600 mr-3" size={20} />
                  <div>
                    <p className="font-semibold text-gray-900">Início das Inscrições</p>
                    <p className="text-gray-600">{new Date(tournament.startDate).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                  <Clock className="text-orange-600 mr-3" size={20} />
                  <div>
                    <p className="font-semibold text-gray-900">Fim das Inscrições</p>
                    <p className="text-gray-600">{new Date(tournament.endDate).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                  <Trophy className="text-purple-600 mr-3" size={20} />
                  <div>
                    <p className="font-semibold text-gray-900">Data do Torneio</p>
                    <p className="text-gray-600">{new Date(tournament.startDate).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                  <Edit2 className="text-blue-600 mr-3" size={20} />
                  <div>
                    <p className="font-semibold text-gray-900">Prazo de Alteração</p>
                    <p className="text-gray-600">Até 24h antes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Taxas de Inscrição */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <DollarSign className="text-green-600 mr-3" size={24} />
                <h3 className="text-xl font-bold text-gray-900">Taxas de Inscrição</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Categoria</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Valor</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tournament.categories?.map((category: string, index: number) => (
                      <tr key={index} className="border-t border-gray-200">
                        <td className="px-4 py-3 font-medium text-gray-900">{category}</td>
                        <td className="px-4 py-3 text-green-600 font-bold">R$ {tournament.registrationFee?.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                            Disponível
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Local do Evento */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <MapPin className="text-red-600 mr-3" size={24} />
                <h3 className="text-xl font-bold text-gray-900">Local do Evento</h3>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-700 mb-4">
                    <strong>{tournament.mainClub}</strong><br />
                    Rua das Quadras, 123<br />
                    São Paulo - SP, 01234-567
                  </p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                    <Navigation className="mr-2" size={16} />
                    Como Chegar
                  </button>
                </div>
                <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
                  <p className="text-gray-600">Mapa do Google Maps</p>
                </div>
              </div>
            </div>

            {/* Organizador */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <Building2 className="text-purple-600 mr-3" size={24} />
                <h3 className="text-xl font-bold text-gray-900">Organizador</h3>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <Building2 className="text-purple-600" size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">{tournament.mainClub}</h4>
                  <p className="text-gray-600">Clube de Padel</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200">
                    <Instagram size={20} />
                  </button>
                  <button className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200">
                    <Phone size={20} />
                  </button>
                  <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                    <Mail size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'contato':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Informações de Contato</h3>
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Phone className="text-green-600 mr-4" size={24} />
                <div>
                  <p className="font-semibold text-gray-900">Telefone</p>
                  <p className="text-gray-600">(11) 9999-9999</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Mail className="text-blue-600 mr-4" size={24} />
                <div>
                  <p className="font-semibold text-gray-900">E-mail</p>
                  <p className="text-gray-600">contato@clube.com</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Instagram className="text-pink-600 mr-4" size={24} />
                <div>
                  <p className="font-semibold text-gray-900">Instagram</p>
                  <p className="text-gray-600">@clubepadel</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'localizacao':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Localização</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Endereço</h4>
                <p className="text-gray-700">
                  Rua das Quadras, 123<br />
                  Bairro Esportivo<br />
                  São Paulo - SP, 01234-567
                </p>
              </div>
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                <p className="text-gray-600">Mapa Interativo do Google Maps</p>
              </div>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center">
                <Navigation className="mr-2" size={20} />
                Abrir no Google Maps
              </button>
            </div>
          </div>
        );
      case 'regras':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Regras do Torneio</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Formato</h4>
                <p className="text-gray-700">Fase de grupos seguida de mata-mata</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Pontuação</h4>
                <p className="text-gray-700">Melhor de 3 sets, com tie-break no terceiro set</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Equipamentos</h4>
                <p className="text-gray-700">Raquetes e bolas fornecidas pelo clube</p>
              </div>
            </div>
          </div>
        );
      case 'faq':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Perguntas Frequentes</h3>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Como me inscrevo?</h4>
                <p className="text-gray-700">Clique no botão "Inscreva-se" e preencha o formulário.</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Posso cancelar minha inscrição?</h4>
                <p className="text-gray-700">Sim, até 48 horas antes do início do torneio.</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Preciso levar equipamentos?</h4>
                <p className="text-gray-700">Não, raquetes e bolas são fornecidas pelo clube.</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderInscritos = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Lista de Inscritos</h3>
      <div className="space-y-4">
        {tournament.categories?.map((category: string, index: number) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">{category}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center p-2 bg-gray-50 rounded">
                <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                <span>João Silva / Pedro Santos</span>
              </div>
              <div className="flex items-center p-2 bg-gray-50 rounded">
                <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                <span>Maria Costa / Ana Lima</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGrupos = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockGroups.map((group, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4">
              <h3 className="text-lg font-bold">{group.name}</h3>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 font-semibold text-gray-700">Dupla</th>
                      <th className="text-center py-2 font-semibold text-gray-700">V</th>
                      <th className="text-center py-2 font-semibold text-gray-700">S.Games</th>
                      <th className="text-center py-2 font-semibold text-gray-700">G.Pro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.teams.map((team, teamIndex) => (
                      <tr key={teamIndex} className={`${
                        team.position === 1 ? 'bg-green-50' : 
                        team.position === 2 ? 'bg-green-25' : 
                        'bg-red-25'
                      }`}>
                        <td className="py-2">
                          <div className="flex items-center">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mr-2 ${
                              team.position === 1 ? 'bg-green-500 text-white' : 
                              team.position === 2 ? 'bg-green-400 text-white' : 
                              'bg-red-400 text-white'
                            }`}>
                              {team.position}
                            </span>
                            <span className="text-xs font-medium">{team.name}</span>
                          </div>
                        </td>
                        <td className="text-center py-2 font-semibold">{team.wins}</td>
                        <td className="text-center py-2 text-blue-600 font-semibold">
                          +{team.gamesFor - team.gamesAgainst}
                        </td>
                        <td className="text-center py-2 font-semibold">{team.gamesFor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">Jogos</h4>
                <div className="space-y-2">
                  {group.matches.map((match, matchIndex) => (
                    <div key={matchIndex} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="text-xs font-medium text-gray-900 mb-1">
                              {match.team1}
                            </div>
                            <div className="text-xs font-medium text-gray-900">
                              {match.team2}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="text-center">
                              <div className="text-sm font-bold text-purple-600">
                                {match.status === 'completed' ? match.score : 'vs'}
                              </div>
                            </div>
                            {isCreator && (
                              <button
                                onClick={() => handleEditScore(match)}
                                className="p-1 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded"
                                title="Editar placar"
                              >
                                <Edit2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          12/07/2025 • 10:30 • Quadra 2
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderJogos = () => (
    <div className="space-y-4">
      {mockMatches.map((match, index) => (
        <div key={index} className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                match.status === 'Finalizado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {match.id}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                match.status === 'Finalizado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {match.status}
              </span>
            </div>
            {isCreator && (
              <button
                onClick={() => handleEditScore(match)}
                className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
                title="Editar placar"
              >
                <Edit2 size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="text-center flex-1">
              <div className="font-semibold text-gray-900">{match.team1}</div>
            </div>
            <div className="mx-4 text-center">
              <div className="text-lg font-bold text-purple-600">
                {match.score}
              </div>
            </div>
            <div className="text-center flex-1">
              <div className="font-semibold text-gray-900">{match.team2}</div>
            </div>
          </div>

          <div className="text-sm text-gray-600 text-left">
            {match.court} • {match.date} • {match.time} • {match.category} • {match.group}
          </div>
        </div>
      ))}
    </div>
  );

  const renderAgenda = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Agenda do Torneio</h3>
      <div className="space-y-4">
        <div className="border-l-4 border-purple-600 pl-4 py-2">
          <h4 className="font-semibold text-gray-900">11/07/2025 - Dia 1</h4>
          <p className="text-gray-600">Fase de grupos - Manhã</p>
          <p className="text-sm text-gray-500">08:00 - 12:00</p>
        </div>
        <div className="border-l-4 border-purple-600 pl-4 py-2">
          <h4 className="font-semibold text-gray-900">11/07/2025 - Dia 1</h4>
          <p className="text-gray-600">Fase de grupos - Tarde</p>
          <p className="text-sm text-gray-500">14:00 - 18:00</p>
        </div>
        <div className="border-l-4 border-green-600 pl-4 py-2">
          <h4 className="font-semibold text-gray-900">12/07/2025 - Dia 2</h4>
          <p className="text-gray-600">Finais</p>
          <p className="text-sm text-gray-500">09:00 - 16:00</p>
        </div>
      </div>
    </div>
  );

  const renderResultados = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Campeões</h2>
        <p className="text-gray-600">Resultados finais do torneio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockChampions.map((result, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4">
              <h3 className="text-lg font-bold">{result.category}</h3>
            </div>
            
            <div className="p-6">
              {/* Campeão */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-3">
                  <Crown className="text-yellow-500 mr-2" size={32} />
                  <span className="text-2xl">🏆</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-1">CAMPEÕES</h4>
                <p className="text-lg font-semibold text-purple-600">{result.champion}</p>
              </div>

              {/* Placar da Final */}
              <div className="text-center mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Placar da Final</p>
                <p className="text-xl font-bold text-gray-900">{result.finalScore}</p>
              </div>

              {/* Vice-campeão */}
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Medal className="text-gray-400 mr-2" size={24} />
                  <span className="text-lg">🥈</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-700 mb-1">Vice-campeões</h4>
                <p className="text-gray-600">{result.runnerUp}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAoVivo = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Transmissões Ao Vivo</h2>
        <p className="text-gray-600">Acompanhe os jogos em tempo real</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCourts.map((court, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 h-32 flex items-center justify-center">
                <Play className="text-white" size={48} />
              </div>
              {court.status === 'Ao Vivo' && (
                <div className="absolute top-2 right-2">
                  <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                    AO VIVO
                  </span>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{court.name}</h3>
              
              {court.match ? (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Jogo atual:</p>
                  <p className="font-medium text-gray-900">{court.match}</p>
                </div>
              ) : (
                <p className="text-gray-500 mb-4">Nenhum jogo agendado</p>
              )}

              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  court.status === 'Ao Vivo' ? 'bg-red-100 text-red-800' :
                  court.status === 'Próximo' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {court.status}
                </span>
                
                {court.streamUrl && (
                  <button className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 flex items-center text-sm">
                    <Play className="mr-1" size={14} />
                    Assistir
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {user ? <DashboardHeader /> : <Navbar />}
      
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-transparent"></div>
        
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="text-white mb-6 md:mb-0">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{tournament.name}</h1>
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6 text-lg">
                  <div className="flex items-center">
                    <MapPin className="mr-2" size={20} />
                    <span>{tournament.mainClub}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-2" size={20} />
                    <span>{new Date(tournament.startDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {isCreator && (
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center">
                    <Edit2 className="mr-2" size={16} />
                    Editar
                  </button>
                )}
                <button className="bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-3 rounded-lg hover:from-green-500 hover:to-green-400 font-bold text-lg shadow-lg">
                  <Zap className="mr-2" size={20} />
                  Inscreva-se
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon className="mr-2" size={16} />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sub Navigation for Informações */}
      {activeTab === 'informacoes' && (
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex overflow-x-auto">
              {subTabs.map((subTab) => (
                <button
                  key={subTab.id}
                  onClick={() => setActiveSubTab(subTab.id)}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeSubTab === subTab.id
                      ? 'border-purple-600 text-purple-600 bg-white'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {subTab.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Area */}
          <div className="flex-1">
            {renderContent()}
          </div>

          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 sticky top-32">
              {/* Club Info */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Building2 className="text-purple-600" size={24} />
                </div>
                <h3 className="font-bold text-gray-900">{tournament.mainClub}</h3>
                <p className="text-gray-600 text-sm">Organizador</p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{tournament.categories?.length || 0}</div>
                  <div className="text-xs text-gray-600">Categorias</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">R$ {tournament.registrationFee?.toFixed(2)}</div>
                  <div className="text-xs text-gray-600">Inscrição</div>
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="space-y-3 mb-6">
                <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center">
                  <Phone className="mr-2" size={16} />
                  WhatsApp
                </button>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center">
                  <Mail className="mr-2" size={16} />
                  E-mail
                </button>
                <button className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 flex items-center justify-center">
                  <Instagram className="mr-2" size={16} />
                  Instagram
                </button>
              </div>

              {/* Mini Map */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Localização</h4>
                <div className="bg-gray-200 rounded-lg h-32 flex items-center justify-center">
                  <MapPin className="text-gray-500" size={24} />
                </div>
              </div>

              {/* Mini Calendar */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Data do Evento</h4>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {new Date(tournament.startDate).getDate()}
                  </div>
                  <div className="text-sm text-purple-600">
                    {new Date(tournament.startDate).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Score Edit Modal */}
      <ScoreEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        match={selectedMatch}
        onSave={handleSaveScore}
      />
    </div>
  );
};

export default TournamentDetail;