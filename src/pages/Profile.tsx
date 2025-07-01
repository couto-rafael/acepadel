import React, { useState, useRef, useEffect } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import { 
  Camera, 
  Edit2, 
  MapPin, 
  Calendar, 
  Trophy, 
  Users, 
  Star,
  Instagram,
  Share2,
  BadgeCheck,
  Settings,
  Medal,
  Award
} from 'lucide-react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

const Profile: React.FC = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'João Silva',
    nickname: 'Joaozinho',
    location: 'São Paulo, SP',
    bio: 'Jogador de padel apaixonado pelo esporte. Sempre em busca de novos desafios e parceiros para jogar.',
    joinDate: '2024-01-01',
    sports: ['Padel'],
    rackets: ['Nox'],
    sponsors: []
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load profile image from localStorage
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }

    // Load user data from localStorage
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      const parsedData = JSON.parse(savedUserData);
      setUserData(prev => ({ ...prev, ...parsedData }));
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
    matches: 45,
    wins: 30,
    tournaments: 12,
    friends: 150,
    winRate: 66.7
  };

  const recentAchievements = [
    { id: 1, title: 'Jogador da Semana', icon: Trophy, color: 'text-yellow-500' },
    { id: 2, title: 'Mestre do Padel', icon: Medal, color: 'text-purple-500' },
    { id: 3, title: 'Veterano', icon: Award, color: 'text-blue-500' }
  ];

  const recentMatches = [
    { id: 1, opponent: 'Maria & Pedro', result: 'win', score: '6-4, 6-3', date: '2024-03-15' },
    { id: 2, opponent: 'Ana & Carlos', result: 'loss', score: '4-6, 6-7', date: '2024-03-12' },
    { id: 3, opponent: 'Lucas & João', result: 'win', score: '6-2, 6-1', date: '2024-03-10' }
  ];

  const friends = [
    { id: 1, name: 'Maria Silva', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg' },
    { id: 2, name: 'Pedro Santos', avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg' },
    { id: 3, name: 'Ana Costa', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg' },
    { id: 4, name: 'Carlos Lima', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg' },
    { id: 5, name: 'Julia Rocha', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg' },
    { id: 6, name: 'Rafael Dias', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg' },
    { id: 7, name: 'Camila Souza', avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg' },
    { id: 8, name: 'Bruno Alves', avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col items-center">
                <div 
                  className="relative w-32 h-32 bg-gray-200 rounded-full overflow-hidden cursor-pointer group"
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
                    <h2 className="text-2xl font-bold">{userData.name}</h2>
                    <BadgeCheck size={24} className="text-blue-500 ml-2" />
                  </div>
                  <p className="text-gray-500 text-lg italic">"{userData.nickname}"</p>
                  <p className="text-gray-600">@joaosilva</p>
                  <div className="flex items-center justify-center mt-2">
                    <MapPin size={16} className="text-gray-500 mr-1" />
                    <p className="text-gray-600">{userData.location}</p>
                    <img 
                      src="https://flagcdn.com/w20/br.png" 
                      alt="Brazil" 
                      className="ml-2 h-4"
                    />
                  </div>
                  <div className="flex items-center justify-center mt-2">
                    <Calendar size={16} className="text-gray-500 mr-1" />
                    <p className="text-gray-600">
                      Membro desde {new Date(userData.joinDate).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="w-full mt-6">
                  <p className="text-gray-700 text-center">{userData.bio}</p>
                </div>
                
                <div className="flex justify-between w-full mt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{stats.matches}</p>
                    <p className="text-sm text-gray-600">Jogos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{stats.friends}</p>
                    <p className="text-sm text-gray-600">Amigos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{stats.tournaments}</p>
                    <p className="text-sm text-gray-600">Torneios</p>
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
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.88 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .54.05.79.13v-3.31a6.07 6.07 0 0 0-.79-.05A6.21 6.21 0 0 0 3 16.13 6.21 6.21 0 0 0 9.2 22.34a6.21 6.21 0 0 0 6.21-6.21V9.04a8.16 8.16 0 0 0 4.18 1.12z"/>
                    </svg>
                  </a>
                  <button className="text-gray-600 hover:text-green-600">
                    <Share2 size={24} />
                  </button>
                </div>

                <div className="w-full mt-6">
                  <h3 className="font-semibold mb-2">Esportes</h3>
                  <div className="flex flex-wrap gap-2">
                    {userData.sports.map((sport, index) => (
                      <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        {sport}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="w-full mt-4">
                  <h3 className="font-semibold mb-2">Raquetes</h3>
                  <div className="flex flex-wrap gap-2">
                    {userData.rackets.map((racket, index) => (
                      <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                        {racket}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="w-full mt-6 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 flex items-center justify-center">
                  <Edit2 size={20} className="mr-2" />
                  Editar Perfil
                </button>
              </div>
            </div>
          </div>

          {/* Center Column - Activity Feed */}
          <div className="lg:col-span-5">
            <div className="space-y-6">
              {/* Recent Achievements */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Conquistas Recentes</h2>
                <div className="grid grid-cols-3 gap-4">
                  {recentAchievements.map(achievement => (
                    <div key={achievement.id} className="text-center">
                      <div className="bg-gray-100 rounded-full p-4 mb-2 mx-auto w-16 h-16 flex items-center justify-center">
                        <achievement.icon size={32} className={achievement.color} />
                      </div>
                      <p className="text-sm font-medium">{achievement.title}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Heatmap */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Atividade de Jogos</h2>
                <div className="flex justify-center space-x-12 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Semana</p>
                    <p className="text-2xl font-bold">3</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Mês</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Taxa de Vitória</p>
                    <p className="text-2xl font-bold text-green-600">{stats.winRate}%</p>
                  </div>
                </div>
                <div className="w-full h-16">
                  <CalendarHeatmap
                    startDate={new Date('2024-01-01')}
                    endDate={new Date('2024-12-31')}
                    values={[
                      { date: '2024-03-05', count: 1 },
                      { date: '2024-03-10', count: 2 },
                      { date: '2024-03-15', count: 1 },
                      { date: '2024-03-20', count: 3 },
                      { date: '2024-02-14', count: 2 },
                      { date: '2024-02-20', count: 1 },
                      { date: '2024-01-15', count: 3 }
                    ]}
                    classForValue={(value) => {
                      if (!value) return 'color-empty';
                      return `color-scale-${value.count}`;
                    }}
                    showMonthLabels={true}
                    gutterSize={2}
                  />
                </div>
              </div>

              {/* Recent Matches */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Partidas Recentes</h2>
                <div className="space-y-3">
                  {recentMatches.map(match => (
                    <div
                      key={match.id}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        match.result === 'win' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                      }`}
                    >
                      <div>
                        <p className="font-medium">vs {match.opponent}</p>
                        <p className="text-sm text-gray-600">{match.score}</p>
                      </div>
                      <div className="text-right">
                        <span className={`font-medium ${
                          match.result === 'win' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {match.result === 'win' ? 'Vitória' : 'Derrota'}
                        </span>
                        <p className="text-sm text-gray-500">
                          {new Date(match.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Info */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Performance Stats */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Estatísticas</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Partidas Jogadas</span>
                    <span className="font-bold">{stats.matches}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vitórias</span>
                    <span className="font-bold text-green-600">{stats.wins}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxa de Vitória</span>
                    <span className="font-bold text-green-600">{stats.winRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Torneios</span>
                    <span className="font-bold">{stats.tournaments}</span>
                  </div>
                </div>
              </div>

              {/* Friends */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Amigos</h2>
                  <Users size={20} className="text-gray-600" />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {friends.slice(0, 8).map(friend => (
                    <div key={friend.id} className="relative group">
                      <img
                        src={friend.avatar}
                        alt={friend.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-1 rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-center truncate">{friend.name.split(' ')[0]}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-center text-sm text-gray-600 mt-3">
                  {stats.friends} amigos
                </p>
              </div>

              {/* Sponsors */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Patrocinadores</h2>
                {userData.sponsors && userData.sponsors.length > 0 ? (
                  <div className="space-y-3">
                    {userData.sponsors.map((sponsor: any, index: number) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3">
                        <img
                          src={sponsor.image}
                          alt={sponsor.name}
                          className="h-16 object-contain mx-auto"
                        />
                        <p className="text-center text-sm font-medium mt-2">{sponsor.name}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Trophy size={48} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">Nenhum patrocinador ainda</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Continue jogando para atrair patrocinadores!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;