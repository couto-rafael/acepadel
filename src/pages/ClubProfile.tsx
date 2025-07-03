import React, { useState, useRef, useEffect } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import { 
  Camera, 
  Edit2, 
  MapPin, 
  Trophy, 
  Users, 
  Instagram,
  Share2,
  BadgeCheck,
  Settings,
  Building2,
  Phone,
  Mail,
  Globe,
  CheckCircle
} from 'lucide-react';

const ClubProfile: React.FC = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [clubData, setClubData] = useState({
    fantasyName: 'Clube Elite Padel',
    email: 'contato@clubeelite.com',
    cnpj: '12.345.678/0001-90',
    phone: '(11) 9 9999-9999',
    city: 'São Paulo',
    state: 'SP',
    description: 'O melhor clube de padel da região, com quadras de alta qualidade e estrutura completa para nossos atletas.',
    courts: 8,
    instagram: '@clubeelitepadel',
    twitter: '@clubeelite',
    threads: '@clubeelitepadel'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load profile image from localStorage
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }

    // Load club data from localStorage
    const savedClubData = localStorage.getItem('clubData');
    if (savedClubData) {
      const parsedData = JSON.parse(savedClubData);
      setClubData(prev => ({ ...prev, ...parsedData }));
    }
  }, []);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        localStorage.setItem('profileImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const stats = {
    tournaments: 15,
    participants: 450,
    activeMembers: 120
  };

  const recentTournaments = [
    { id: 1, name: 'Copa Verão 2024', participants: 32, status: 'completed', date: '2024-03-15' },
    { id: 2, name: 'Torneio Iniciantes', participants: 24, status: 'in-progress', date: '2024-03-20' },
    { id: 3, name: 'Championship Elite', participants: 48, status: 'open', date: '2024-04-05' }
  ];

  const facilities = [
    { name: 'Quadras Cobertas', count: 6 },
    { name: 'Quadras Descobertas', count: 2 },
    { name: 'Vestiários', available: true },
    { name: 'Estacionamento', available: true },
    { name: 'Bar/Restaurante', available: true },
    { name: 'Área Kids', available: false }
  ];

  return (
    <div className="min-h-screen bg-light">
      <DashboardHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Club Info */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex flex-col items-center">
                <div 
                  className="relative w-32 h-32 bg-gray-200 rounded-full overflow-hidden cursor-pointer group"
                  onClick={handleImageClick}
                >
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="Club Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <Building2 size={40} className="text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={24} className="text-white" />
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>

                <div className="text-center mt-4">
                  <div className="flex items-center justify-center">
                    <h2 className="text-2xl font-bold">{clubData.fantasyName}</h2>
                    <BadgeCheck size={24} className="text-primary-500 ml-2" />
                  </div>
                  <div className="flex items-center justify-center mt-2">
                    <MapPin size={16} className="text-gray-500 mr-1" />
                    <p className="text-gray-600">{clubData.city}, {clubData.state}</p>
                  </div>
                  <div className="flex items-center justify-center mt-1">
                    <Phone size={16} className="text-gray-500 mr-1" />
                    <p className="text-gray-600">{clubData.phone}</p>
                  </div>
                  <div className="flex items-center justify-center mt-1">
                    <Mail size={16} className="text-gray-500 mr-1" />
                    <p className="text-gray-600">{clubData.email}</p>
                  </div>
                </div>

                <div className="w-full mt-6">
                  <p className="text-gray-700 text-center">{clubData.description}</p>
                </div>

                <button className="w-full mt-6 bg-gradient-to-r from-primary-900 to-primary-700 text-white py-2 rounded-md hover:from-primary-800 hover:to-primary-600 transition-all duration-300 flex items-center justify-center">
                  <Edit2 size={20} className="mr-2" />
                  Editar Perfil
                </button>
                
                <div className="flex justify-between w-full mt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary-600">{stats.tournaments}</p>
                    <p className="text-sm text-gray-600">Torneios</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary-600">{stats.participants}</p>
                    <p className="text-sm text-gray-600">Participantes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary-600">{stats.activeMembers}</p>
                    <p className="text-sm text-gray-600">Membros</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mt-6">
                  <a href="#" className="text-gray-600 hover:text-pink-600">
                    <Instagram size={24} />
                  </a>
                  <a href="#" className="text-gray-600 hover:text-black">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-600 hover:text-black">
                    <Globe size={24} />
                  </a>
                  <button className="text-gray-600 hover:text-primary-600">
                    <Share2 size={24} />
                  </button>
                </div>

                <div className="w-full mt-6">
                  <h3 className="font-semibold mb-2">Estrutura</h3>
                  <div className="space-y-2">
                    {facilities.map((facility, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{facility.name}</span>
                        {facility.count ? (
                          <span className="text-sm font-medium text-primary-600">{facility.count}</span>
                        ) : (
                          <CheckCircle 
                            size={16} 
                            className={facility.available ? 'text-primary-600' : 'text-gray-300'} 
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center Column - Tournaments & Activity */}
          <div className="lg:col-span-5">
            <div className="space-y-6">
              {/* Recent Tournaments */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-bold mb-4">Torneios Recentes</h2>
                <div className="space-y-4">
                  {recentTournaments.map(tournament => (
                    <div
                      key={tournament.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-primary-50 transition-colors"
                    >
                      <div>
                        <h3 className="font-medium text-gray-900">{tournament.name}</h3>
                        <p className="text-sm text-gray-600">
                          {tournament.participants} participantes
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(tournament.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tournament.status === 'completed' 
                            ? 'bg-gray-100 text-gray-800' 
                            : tournament.status === 'in-progress'
                            ? 'bg-primary-100 text-primary-800'
                            : 'bg-accent-100 text-accent-800'
                        }`}>
                          {tournament.status === 'completed' ? 'Concluído' : 
                           tournament.status === 'in-progress' ? 'Em Andamento' : 'Inscrições Abertas'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Club Statistics */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-bold mb-4">Estatísticas do Clube</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-primary-50 rounded-lg">
                    <p className="text-2xl font-bold text-primary-600">95%</p>
                    <p className="text-sm text-gray-600">Taxa de Ocupação</p>
                  </div>
                  <div className="text-center p-4 bg-primary-50 rounded-lg">
                    <p className="text-2xl font-bold text-primary-600">85%</p>
                    <p className="text-sm text-gray-600">Membros Ativos</p>
                  </div>
                  <div className="text-center p-4 bg-primary-50 rounded-lg">
                    <p className="text-2xl font-bold text-primary-600">12</p>
                    <p className="text-sm text-gray-600">Anos de Experiência</p>
                  </div>
                  <div className="text-center p-4 bg-primary-50 rounded-lg">
                    <p className="text-2xl font-bold text-primary-600">150+</p>
                    <p className="text-sm text-gray-600">Torneios Realizados</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact & Actions */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-bold mb-4">Ações Rápidas</h2>
                <div className="space-y-3">
                  <button className="w-full bg-gradient-to-r from-primary-900 to-primary-700 text-white py-2 rounded-md hover:from-primary-800 hover:to-primary-600 transition-all duration-300 flex items-center justify-center">
                    <Trophy size={20} className="mr-2" />
                    Criar Torneio
                  </button>
                  <button className="w-full bg-gradient-to-r from-accent-500 to-accent-400 text-dark-900 py-2 rounded-md hover:from-accent-400 hover:to-accent-300 transition-all duration-300 flex items-center justify-center">
                    <Users size={20} className="mr-2" />
                    Gerenciar Membros
                  </button>
                  <button className="w-full bg-dark-600 text-white py-2 rounded-md hover:bg-dark-700 transition-all duration-300 flex items-center justify-center">
                    <Settings size={20} className="mr-2" />
                    Configurações
                  </button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-bold mb-4">Informações de Contato</h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Phone size={16} className="text-gray-500 mr-3" />
                    <span className="text-gray-700">{clubData.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail size={16} className="text-gray-500 mr-3" />
                    <span className="text-gray-700">{clubData.email}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin size={16} className="text-gray-500 mr-3" />
                    <span className="text-gray-700">{clubData.city}, {clubData.state}</span>
                  </div>
                  <div className="flex items-center">
                    <Instagram size={16} className="text-gray-500 mr-3" />
                    <span className="text-gray-700">{clubData.instagram}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubProfile;