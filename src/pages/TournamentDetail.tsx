import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DashboardHeader from '../components/DashboardHeader';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Trophy, 
  DollarSign, 
  Clock, 
  Phone, 
  Mail, 
  Globe, 
  Instagram,
  MessageSquare,
  Share2,
  Heart,
  Star,
  Award,
  Info,
  FileText,
  HelpCircle,
  Building2,
  User,
  BadgeCheck
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Tournament {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationFee: number;
  categories: string[];
  courts: Array<{ id: string; name: string }>;
  participantsCount: number;
  maxParticipants: number;
  status: string;
  mainClub: string;
  subClub?: string;
  hasSubClub: boolean;
  city: string;
  state: string;
  profileImage?: string;
  bannerImage?: string;
  sponsors: Array<{ id: string; name: string; image: string }>;
  streamingLinks: Array<{ courtId: string; courtName: string; link: string }>;
  dailySchedules: Array<{
    date: string;
    startTime: string;
    endTime: string;
  }>;
}

const TournamentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'gerais');
  const [activeInfoTab, setActiveInfoTab] = useState('contato');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // Load tournament from localStorage
      const clubTournaments = JSON.parse(localStorage.getItem('clubTournaments') || '[]');
      const foundTournament = clubTournaments.find((t: any) => t.id === id);
      
      if (foundTournament) {
        setTournament(foundTournament);
      }
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-light">
        {user ? <DashboardHeader /> : <Navbar />}
        <div className="pt-16 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <Trophy className="mx-auto text-gray-300 mb-4" size={64} />
            <h2 className="text-2xl font-bold text-dark-900 mb-2">Torneio não encontrado</h2>
            <p className="text-dark-600 mb-6">O torneio que você está procurando não existe ou foi removido.</p>
            <Link
              to="/tournaments"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Ver Todos os Torneios
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'gerais', name: 'Gerais', icon: Info },
    { id: 'inscritos', name: 'Inscritos', icon: Users },
    { id: 'chaveamento', name: 'Chaveamento', icon: Trophy },
    { id: 'informacoes', name: 'Informações', icon: FileText }
  ];

  const infoSubTabs = [
    { id: 'contato', name: 'Contato', icon: Phone },
    { id: 'localizacao', name: 'Localização', icon: MapPin },
    { id: 'regras', name: 'Regras', icon: FileText },
    { id: 'faq', name: 'FAQ', icon: HelpCircle }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

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

  const renderOrganizerColumn = () => (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 sticky top-24">
        <h3 className="text-lg font-bold text-dark-900 mb-4 flex items-center">
          <Building2 className="mr-2 text-primary-600" size={20} />
          Organizador
        </h3>
        
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Building2 size={32} className="text-primary-600" />
          </div>
          <div className="flex items-center justify-center mb-1">
            <h4 className="font-bold text-dark-900">{tournament.mainClub}</h4>
            <BadgeCheck size={16} className="text-primary-500 ml-1" />
          </div>
          <p className="text-sm text-dark-600">{tournament.city}, {tournament.state}</p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-dark-600">Torneios Realizados</span>
            <span className="font-semibold text-dark-900">15</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-dark-600">Avaliação</span>
            <div className="flex items-center">
              <Star size={14} className="text-yellow-500 mr-1" />
              <span className="font-semibold text-dark-900">4.8</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-dark-600">Quadras</span>
            <span className="font-semibold text-dark-900">{tournament.courts.length}</span>
          </div>
        </div>

        <div className="space-y-2">
          <button className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center">
            <MessageSquare size={16} className="mr-2" />
            Entrar em Contato
          </button>
          <button className="w-full border border-primary-600 text-primary-600 py-2 rounded-lg hover:bg-primary-50 transition-colors flex items-center justify-center">
            <User size={16} className="mr-2" />
            Ver Perfil
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h5 className="font-semibold text-dark-900 mb-3">Redes Sociais</h5>
          <div className="flex justify-center space-x-4">
            <a href="#" className="text-dark-600 hover:text-pink-600 transition-colors">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-dark-600 hover:text-primary-600 transition-colors">
              <Globe size={20} />
            </a>
            <a href="#" className="text-dark-600 hover:text-accent-600 transition-colors">
              <Share2 size={20} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'gerais':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-6">
                {tournament.bannerImage && (
                  <img
                    src={tournament.bannerImage}
                    alt="Banner do torneio"
                    className="w-full h-48 object-cover rounded-lg mb-6"
                  />
                )}
                
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-dark-900 mb-2">{tournament.name}</h1>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(tournament.status)}`}>
                      {getStatusText(tournament.status)}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-dark-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Heart size={20} />
                    </button>
                    <button className="p-2 text-dark-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="flex items-center">
                    <Calendar className="text-primary-600 mr-3" size={20} />
                    <div>
                      <p className="text-sm text-dark-600">Data</p>
                      <p className="font-semibold text-dark-900">
                        {formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="text-primary-600 mr-3" size={20} />
                    <div>
                      <p className="text-sm text-dark-600">Local</p>
                      <p className="font-semibold text-dark-900">{tournament.city}, {tournament.state}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <DollarSign className="text-primary-600 mr-3" size={20} />
                    <div>
                      <p className="text-sm text-dark-600">Inscrição</p>
                      <p className="font-semibold text-dark-900">R$ {tournament.registrationFee.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="text-primary-600 mr-3" size={20} />
                    <div>
                      <p className="text-sm text-dark-600">Participantes</p>
                      <p className="font-semibold text-dark-900">
                        {tournament.participantsCount} / {tournament.maxParticipants}
                      </p>
                    </div>
                  </div>
                </div>

                {tournament.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-dark-900 mb-3">Sobre o Torneio</h3>
                    <p className="text-dark-700 leading-relaxed">{tournament.description}</p>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-dark-900 mb-3">Categorias</h3>
                  <div className="flex flex-wrap gap-2">
                    {tournament.categories.map((category, index) => (
                      <span
                        key={index}
                        className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>

                {tournament.sponsors && tournament.sponsors.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-dark-900 mb-3">Patrocinadores</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {tournament.sponsors.map((sponsor) => (
                        <div key={sponsor.id} className="bg-gray-50 p-4 rounded-lg text-center">
                          <img
                            src={sponsor.image}
                            alt={sponsor.name}
                            className="h-12 object-contain mx-auto mb-2"
                          />
                          <p className="text-sm font-medium text-dark-900">{sponsor.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {renderOrganizerColumn()}
          </div>
        );

      case 'inscritos':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-2xl font-bold text-dark-900 mb-6">Participantes Inscritos</h2>
                <div className="text-center py-12">
                  <Users className="mx-auto text-gray-300 mb-4" size={64} />
                  <h3 className="text-lg font-medium text-dark-900 mb-2">Nenhum participante inscrito</h3>
                  <p className="text-dark-500">As inscrições ainda não foram abertas ou ninguém se inscreveu ainda.</p>
                </div>
              </div>
            </div>
            
            {renderOrganizerColumn()}
          </div>
        );

      case 'chaveamento':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-2xl font-bold text-dark-900 mb-6">Chaveamento</h2>
                <div className="text-center py-12">
                  <Trophy className="mx-auto text-gray-300 mb-4" size={64} />
                  <h3 className="text-lg font-medium text-dark-900 mb-2">Chaveamento não disponível</h3>
                  <p className="text-dark-500">O chaveamento será gerado após o fechamento das inscrições.</p>
                </div>
              </div>
            </div>
            
            {renderOrganizerColumn()}
          </div>
        );

      case 'informacoes':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Sub-tabs */}
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6">
                    {infoSubTabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveInfoTab(tab.id)}
                          className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                            activeInfoTab === tab.id
                              ? 'border-primary-600 text-primary-600'
                              : 'border-transparent text-dark-500 hover:text-dark-700 hover:border-gray-300'
                          }`}
                        >
                          <Icon size={16} className="mr-2" />
                          {tab.name}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Sub-tab content */}
                <div className="p-6">
                  {activeInfoTab === 'contato' && (
                    <div>
                      <h3 className="text-xl font-bold text-dark-900 mb-4">Informações de Contato</h3>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <Building2 className="text-primary-600 mr-3" size={20} />
                          <div>
                            <p className="text-sm text-dark-600">Clube</p>
                            <p className="font-semibold text-dark-900">{tournament.mainClub}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Phone className="text-primary-600 mr-3" size={20} />
                          <div>
                            <p className="text-sm text-dark-600">Telefone</p>
                            <p className="font-semibold text-dark-900">(11) 9999-9999</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Mail className="text-primary-600 mr-3" size={20} />
                          <div>
                            <p className="text-sm text-dark-600">E-mail</p>
                            <p className="font-semibold text-dark-900">contato@{tournament.mainClub.toLowerCase().replace(/\s+/g, '')}.com</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Instagram className="text-primary-600 mr-3" size={20} />
                          <div>
                            <p className="text-sm text-dark-600">Instagram</p>
                            <p className="font-semibold text-dark-900">@{tournament.mainClub.toLowerCase().replace(/\s+/g, '')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeInfoTab === 'localizacao' && (
                    <div>
                      <h3 className="text-xl font-bold text-dark-900 mb-4">Localização</h3>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <MapPin className="text-primary-600 mr-3" size={20} />
                          <div>
                            <p className="text-sm text-dark-600">Endereço</p>
                            <p className="font-semibold text-dark-900">
                              Rua das Quadras, 123 - {tournament.city}, {tournament.state}
                            </p>
                          </div>
                        </div>
                        
                        <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                          <p className="text-dark-500">Mapa será carregado aqui</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-dark-900 mb-2">Quadras Disponíveis</h4>
                            <ul className="space-y-1">
                              {tournament.courts.map((court) => (
                                <li key={court.id} className="text-dark-700">• {court.name}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-dark-900 mb-2">Facilidades</h4>
                            <ul className="space-y-1 text-dark-700">
                              <li>• Estacionamento gratuito</li>
                              <li>• Vestiários</li>
                              <li>• Lanchonete</li>
                              <li>• Wi-Fi gratuito</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeInfoTab === 'regras' && (
                    <div>
                      <h3 className="text-xl font-bold text-dark-900 mb-4">Regras do Torneio</h3>
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold text-dark-900 mb-2">Formato do Torneio</h4>
                          <p className="text-dark-700">
                            O torneio será disputado no formato de eliminação simples, com jogos de melhor de 3 sets.
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-dark-900 mb-2">Regras Gerais</h4>
                          <ul className="space-y-2 text-dark-700">
                            <li>• Jogos de melhor de 3 sets</li>
                            <li>• Set com vantagem (6 games, com vantagem de 2)</li>
                            <li>• Tie-break em 6x6</li>
                            <li>• Tolerância de 15 minutos para atraso</li>
                            <li>• Uso obrigatório de tênis apropriado</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-dark-900 mb-2">Premiação</h4>
                          <ul className="space-y-2 text-dark-700">
                            <li>• 1º lugar: Troféu + R$ 500</li>
                            <li>• 2º lugar: Troféu + R$ 300</li>
                            <li>• 3º lugar: Troféu + R$ 200</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeInfoTab === 'faq' && (
                    <div>
                      <h3 className="text-xl font-bold text-dark-900 mb-4">Perguntas Frequentes</h3>
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold text-dark-900 mb-2">Como faço para me inscrever?</h4>
                          <p className="text-dark-700">
                            Clique no botão "Inscrever-se" na página do torneio e preencha os dados solicitados. 
                            O pagamento pode ser feito via PIX ou cartão de crédito.
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-dark-900 mb-2">Posso cancelar minha inscrição?</h4>
                          <p className="text-dark-700">
                            Sim, você pode cancelar sua inscrição até 48 horas antes do início do torneio. 
                            O valor será reembolsado integralmente.
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-dark-900 mb-2">Preciso levar raquete?</h4>
                          <p className="text-dark-700">
                            Sim, cada participante deve trazer sua própria raquete. Não fornecemos equipamentos.
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-dark-900 mb-2">Há limite de idade?</h4>
                          <p className="text-dark-700">
                            O torneio é aberto para maiores de 16 anos. Menores de idade precisam de autorização dos pais.
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-dark-900 mb-2">E se chover?</h4>
                          <p className="text-dark-700">
                            Temos quadras cobertas disponíveis. Em caso de chuva forte, os jogos podem ser adiados.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {renderOrganizerColumn()}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-light">
      {user ? <DashboardHeader /> : <Navbar />}
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation Tabs */}
          <div className="bg-white rounded-xl shadow-lg mb-8 border border-gray-100 overflow-hidden">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-dark-500 hover:text-dark-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={16} className="mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default TournamentDetail;