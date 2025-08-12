import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DashboardHeader from '../components/DashboardHeader';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Trophy, 
  Clock, 
  DollarSign,
  Phone,
  Mail,
  Instagram,
  MessageCircle,
  Building2,
  Info,
  FileText,
  HelpCircle,
  Zap
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const TournamentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [tournament, setTournament] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'gerais');

  useEffect(() => {
    // Load tournament data from localStorage
    const clubTournaments = JSON.parse(localStorage.getItem('clubTournaments') || '[]');
    const foundTournament = clubTournaments.find((t: any) => t.id === id);
    
    if (foundTournament) {
      setTournament(foundTournament);
    }
  }, [id]);

  if (!tournament) {
    return (
      <div className="min-h-screen bg-light">
        {user ? <DashboardHeader /> : <Navbar />}
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'gerais', name: 'Gerais', icon: Info },
    { id: 'contato', name: 'Contato', icon: MessageCircle },
    { id: 'localizacao', name: 'Localização', icon: MapPin },
    { id: 'regras', name: 'Regras', icon: FileText },
    { id: 'faq', name: 'FAQ', icon: HelpCircle }
  ];

  const renderOrganizerColumn = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building2 size={32} className="text-primary-600" />
        </div>
        <h3 className="text-xl font-bold text-primary-600 mb-1">
          {tournament.mainClub || 'Elite Padel'}
        </h3>
        <p className="text-gray-600 text-sm">Organizador</p>
      </div>

      <div className="space-y-3 mb-6">
        <div className="text-center">
          <p className="text-2xl font-bold text-primary-600">4</p>
          <p className="text-sm text-gray-600">Inscritos</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">R$ 120,00</p>
          <p className="text-sm text-gray-600">Inscrição</p>
        </div>
      </div>

      <div className="space-y-3">
        <button className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center">
          <MessageCircle size={18} className="mr-2" />
          WhatsApp
        </button>
        <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
          <Mail size={18} className="mr-2" />
          E-mail
        </button>
        <button className="w-full bg-pink-600 text-white py-3 px-4 rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center">
          <Instagram size={18} className="mr-2" />
          Instagram
        </button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'gerais':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Descrição do Torneio */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center mb-4">
                  <Info size={24} className="text-primary-600 mr-3" />
                  <h2 className="text-xl font-bold text-dark-800">Descrição do Torneio</h2>
                </div>
                <p className="text-dark-600 leading-relaxed">
                  {tournament.description || 'Descrição não disponível.'}
                </p>
              </div>

              {/* Datas Importantes */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center mb-6">
                  <Calendar size={24} className="text-primary-600 mr-3" />
                  <h2 className="text-xl font-bold text-dark-800">Datas Importantes</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <Calendar size={20} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark-800">Início das Inscrições</h3>
                      <p className="text-dark-600">{new Date(tournament.startDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                      <Clock size={20} className="text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark-800">Fim das Inscrições</h3>
                      <p className="text-dark-600">{new Date(tournament.endDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                      <Trophy size={20} className="text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark-800">Data do Torneio</h3>
                      <p className="text-dark-600">{new Date(tournament.startDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <Clock size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark-800">Prazo de Alteração</h3>
                      <p className="text-dark-600">Até 24h antes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              {renderOrganizerColumn()}
            </div>
          </div>
        );

      case 'contato':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-dark-800 mb-6">Informações de Contato</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <Phone size={20} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark-800">Telefone</h3>
                      <p className="text-dark-600">(11) 9999-9999</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <Mail size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark-800">E-mail</h3>
                      <p className="text-dark-600">contato@clube.com</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mr-4">
                      <Instagram size={20} className="text-pink-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark-800">Instagram</h3>
                      <p className="text-dark-600">@clubepadel</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              {renderOrganizerColumn()}
            </div>
          </div>
        );

      case 'localizacao':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-dark-800 mb-6">Localização</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4 mt-1">
                      <MapPin size={20} className="text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark-800 mb-2">Endereço</h3>
                      <p className="text-dark-600">
                        Rua das Flores, 123<br />
                        Bairro Jardim<br />
                        São Paulo - SP<br />
                        CEP: 01234-567
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-100 rounded-lg p-4">
                    <h4 className="font-semibold text-dark-800 mb-2">Como chegar:</h4>
                    <ul className="text-dark-600 space-y-1">
                      <li>• Metrô: Estação Vila Madalena (Linha 2-Verde)</li>
                      <li>• Ônibus: Linhas 177M, 178P</li>
                      <li>• Estacionamento gratuito disponível</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              {renderOrganizerColumn()}
            </div>
          </div>
        );

      case 'regras':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-dark-800 mb-6">Regras do Torneio</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-dark-800 mb-3">Formato do Torneio</h3>
                    <ul className="text-dark-600 space-y-2">
                      <li>• Torneio no formato eliminatória simples</li>
                      <li>• Partidas em melhor de 3 sets</li>
                      <li>• Tie-break em 6x6</li>
                      <li>• Super tie-break no 3º set (primeiro a 10 pontos)</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-dark-800 mb-3">Inscrições</h3>
                    <ul className="text-dark-600 space-y-2">
                      <li>• Inscrições até 24h antes do início</li>
                      <li>• Pagamento via PIX ou cartão</li>
                      <li>• Cancelamento com reembolso até 48h antes</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-dark-800 mb-3">Equipamentos</h3>
                    <ul className="text-dark-600 space-y-2">
                      <li>• Bolas fornecidas pela organização</li>
                      <li>• Raquetes de responsabilidade dos jogadores</li>
                      <li>• Vestiário disponível</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              {renderOrganizerColumn()}
            </div>
          </div>
        );

      case 'faq':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-dark-800 mb-6">Perguntas Frequentes</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-dark-800 mb-2">Como faço para me inscrever?</h3>
                    <p className="text-dark-600">
                      Clique no botão "Inscrever-se" e preencha os dados solicitados. O pagamento pode ser feito via PIX ou cartão de crédito.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-dark-800 mb-2">Posso cancelar minha inscrição?</h3>
                    <p className="text-dark-600">
                      Sim, cancelamentos com reembolso integral são aceitos até 48 horas antes do início do torneio.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-dark-800 mb-2">Preciso levar raquete?</h3>
                    <p className="text-dark-600">
                      Sim, cada jogador deve trazer sua própria raquete. As bolas são fornecidas pela organização.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-dark-800 mb-2">Há premiação?</h3>
                    <p className="text-dark-600">
                      Sim, troféus para os 3 primeiros colocados de cada categoria, além de brindes para todos os participantes.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-dark-800 mb-2">Posso trocar de parceiro?</h3>
                    <p className="text-dark-600">
                      Alterações na dupla são permitidas até 24 horas antes do início do torneio, mediante disponibilidade.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              {renderOrganizerColumn()}
            </div>
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
        {/* Header */}
        <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-dark-900 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-4">
                  <Zap size={32} className="text-accent-500 mr-3" />
                  <span className="text-accent-500 font-bold text-lg">TORNEIO</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                  {tournament.name}
                </h1>
                <div className="flex items-center text-gray-200">
                  <Building2 size={20} className="mr-2" />
                  <span>{tournament.mainClub || 'Elite Padel'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
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
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default TournamentDetail;