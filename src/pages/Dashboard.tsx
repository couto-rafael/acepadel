import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardHeader from '../components/DashboardHeader';
import InitialSetupModal from '../components/InitialSetupModal';
import { Instagram, Share2, Camera, Calendar, Settings, Users, Trophy, UserPlus, Plus, FileText, MessageSquare, BadgeCheck } from 'lucide-react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

const Dashboard: React.FC = () => {
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userType = localStorage.getItem('userType') || 'athlete';
    const isNewUser = localStorage.getItem('isNewUser');
    const setupComplete = localStorage.getItem('setupComplete');
    
    // Only show setup modal for athletes who are new and haven't completed setup
    if (userType === 'athlete' && isNewUser === 'true' && !setupComplete) {
      setShowSetupModal(true);
    }

    const isAuthenticated = localStorage.getItem('auth');
    if (!isAuthenticated) {
      navigate('/');
    }

    // Load profile image from localStorage
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (addMenuRef.current && !addMenuRef.current.contains(event.target as Node)) {
        setIsAddMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [navigate]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        // Save to localStorage to sync with Settings
        localStorage.setItem('profileImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col items-center">
                <div 
                  className="relative w-32 h-32 bg-gray-200 rounded-full overflow-hidden cursor-pointer"
                  onClick={handleImageClick}
                >
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <Camera size={40} className="text-gray-400" />
                    </div>
                  )}
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
                    <h2 className="text-xl font-bold">João Silva</h2>
                    <BadgeCheck size={20} className="text-blue-500 ml-1" />
                  </div>
                  <p className="text-gray-500 text-sm italic">"Joaozinho"</p>
                  <p className="text-gray-600 text-sm">@joaosilva</p>
                  <p className="text-gray-600 flex items-center justify-center mt-1">
                    São Paulo, SP 
                    <img 
                      src="https://flagcdn.com/w20/br.png" 
                      alt="Brazil" 
                      className="ml-2 h-4"
                    />
                  </p>
                </div>
                
                <div className="flex justify-between w-full mt-6">
                  <div className="text-center">
                    <p className="font-bold">45</p>
                    <p className="text-sm text-gray-600">Jogos</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold">150</p>
                    <p className="text-sm text-gray-600">Amigos</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold">12</p>
                    <p className="text-sm text-gray-600">Torneios</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mt-4">
                  <a href="#" className="text-gray-600 hover:text-pink-600">
                    <Instagram size={20} />
                  </a>
                  <a href="#" className="text-gray-600 hover:text-black">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-600 hover:text-black">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.88 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .54.05.79.13v-3.31a6.07 6.07 0 0 0-.79-.05A6.21 6.21 0 0 0 3 16.13 6.21 6.21 0 0 0 9.2 22.34a6.21 6.21 0 0 0 6.21-6.21V9.04a8.16 8.16 0 0 0 4.18 1.12z"/>
                    </svg>
                  </a>
                  <button className="text-gray-600 hover:text-green-600">
                    <Share2 size={20} />
                  </button>
                </div>

                <div className="w-full mt-6">
                  <h3 className="font-semibold mb-2">Esportes</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                      Padel
                    </span>
                  </div>
                </div>

                <div className="w-full mt-4">
                  <h3 className="font-semibold mb-2">Raquetes</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm">
                      Nox
                    </span>
                  </div>
                </div>

                <div className="w-full mt-4">
                  <h3 className="font-semibold mb-2">Patrocinadores</h3>
                  <p className="text-gray-600 text-sm">Nenhum patrocinador ainda</p>
                </div>
              </div>
            </div>
          </div>

          {/* Center Column */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Feed de Atividades</h2>
                <div className="relative" ref={addMenuRef}>
                  <button
                    onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                    className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700"
                  >
                    <Plus size={20} />
                  </button>
                  {isAddMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <Calendar size={16} className="mr-2" />
                        Adicionar Jogo
                      </button>
                      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <FileText size={16} className="mr-2" />
                        Criar Post
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-start">
                    <Calendar size={28} className="text-green-600 mt-1 mr-4" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">Crie seu primeiro jogo</h3>
                      <p className="text-gray-600 text-sm mb-3">
                        Registre suas partidas e acompanhe sua evolução no esporte.
                      </p>
                      <button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-300 flex items-center">
                        <Calendar size={20} className="mr-2" />
                        Adicionar Jogo
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-start">
                    <Users size={28} className="text-green-600 mt-1 mr-4" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">Veja o que seus amigos estão fazendo</h3>
                      <p className="text-gray-600 text-sm mb-3">
                        Conecte-se com outros jogadores e acompanhe suas atividades.
                      </p>
                      <button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-300 flex items-center">
                        <Users size={20} className="mr-2" />
                        Ache Amigos
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-start">
                    <Settings size={28} className="text-green-600 mt-1 mr-4" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">Configure sua conta</h3>
                      <p className="text-gray-600 text-sm mb-3">
                        Personalize seu perfil e ajuste suas preferências.
                      </p>
                      <Link
                        to="/settings"
                        className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-300 flex items-center inline-flex"
                      >
                        <Settings size={20} className="mr-2" />
                        Configuração
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Trophy size={20} className="text-green-600 mr-2" />
                    <h2 className="text-xl font-bold">Sala de Troféus</h2>
                  </div>
                  <button className="text-gray-600 hover:text-green-600">
                    <Share2 size={20} />
                  </button>
                </div>
                <p className="text-gray-600">Nenhum troféu ainda</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold mb-2">Atividade de Jogos</h3>
                <div className="flex justify-center space-x-12 mb-2">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Semana</p>
                    <p className="text-2xl font-bold">3</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Mês</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-1 flex justify-between">
                  <span>D</span>
                  <span>S</span>
                  <span>T</span>
                  <span>Q</span>
                  <span>Q</span>
                  <span>S</span>
                  <span>S</span>
                </div>
                <div className="w-full h-12">
                  <CalendarHeatmap
                    startDate={new Date('2024-03-01')}
                    endDate={new Date('2024-03-31')}
                    values={[
                      { date: '2024-03-05', count: 1 },
                      { date: '2024-03-10', count: 2 },
                      { date: '2024-03-15', count: 1 },
                      { date: '2024-03-20', count: 3 }
                    ]}
                    classForValue={(value) => {
                      if (!value) return 'color-empty';
                      return `color-scale-${value.count}`;
                    }}
                    showMonthLabels={false}
                    gutterSize={2}
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold mb-4">Estatísticas</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">75%</p>
                    <p className="text-sm text-gray-600">Vitórias</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">65%</p>
                    <p className="text-sm text-gray-600">Games Vencidos</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-3">
                  <UserPlus size={20} className="text-green-600 mr-2" />
                  <h3 className="font-semibold">Encontre Amigos/Atletas</h3>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Conecte-se com outros jogadores e expanda sua rede no esporte.
                </p>
                <Link to="/find-athletes" className="text-green-600 hover:text-green-700 text-sm font-medium">
                  Encontre aqui
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-green-800 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">PadelTour</h3>
              <p className="text-green-200 mb-4">
                A melhor plataforma para encontrar e participar de torneios de padel no Brasil.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-green-200">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-green-200">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-green-200">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-green-200 hover:text-white">Home</a></li>
                <li><a href="#" className="text-green-200 hover:text-white">Torneios</a></li>
                <li><a href="#" className="text-green-200 hover:text-white">Rankings</a></li>
                <li><a href="#" className="text-green-200 hover:text-white">Clubes</a></li>
                <li><a href="#" className="text-green-200 hover:text-white">Contato</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contato</h3>
              <p className="text-green-200 mb-2">contato@padeltour.com.br</p>
              <p className="text-green-200 mb-4">(11) 9999-9999</p>
              <p className="text-green-200">
                Av. Paulista, 1000 - Bela Vista<br />
                São Paulo - SP, 01310-100
              </p>
            </div>
          </div>
          
          <div className="border-t border-green-700 mt-8 pt-8 text-center text-green-300">
            <p>&copy; {new Date().getFullYear()} PadelTour. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      <InitialSetupModal
        isOpen={showSetupModal}
        onClose={() => setShowSetupModal(false)}
      />
    </div>
  );
};

export default Dashboard;