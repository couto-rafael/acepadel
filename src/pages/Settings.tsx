import React, { useState, useEffect, useRef } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import { 
  Camera, 
  Plus, 
  X, 
  Check, 
  Instagram, 
  Twitter,
  Trophy,
  Medal,
  Star,
  Award,
  TrendingUp,
  BarChart2,
  PieChart,
  Users as UsersIcon,
  Bell as BellIcon,
  Lock,
  Shield,
  UserCheck,
  Building2,
  MapPin,
  Phone,
  Mail,
  FileText,
  Globe
} from 'lucide-react';

interface SponsorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, image: string | null) => void;
}

const SponsorModal: React.FC<SponsorModalProps> = ({ isOpen, onClose, onSave }) => {
  const [sponsorName, setSponsorName] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Adicionar Patrocinador</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Patrocinador
            </label>
            <input
              type="text"
              value={sponsorName}
              onChange={(e) => setSponsorName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logo do Patrocinador
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Recomendado: 400x200px, máximo 2MB
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
            {selectedImage && (
              <div className="mt-2">
                <img 
                  src={selectedImage} 
                  alt="Preview" 
                  className="max-h-32 object-contain"
                />
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-2 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={() => onSave(sponsorName, selectedImage)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Settings: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState('profile');
  const [showSponsorModal, setShowSponsorModal] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [sponsors, setSponsors] = useState<Array<{ name: string; image: string }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSocialFields, setShowSocialFields] = useState({
    instagram: false,
    twitter: false,
    threads: false
  });

  // Check user type
  const userType = localStorage.getItem('userType') || 'athlete';
  const isClub = userType === 'club';
  const isNewClub = localStorage.getItem('isNewClub') === 'true';
  
  // Different form data based on user type
  const [athleteData, setAthleteData] = useState({
    name: 'João Silva',
    nickname: 'Joaozinho',
    birthDate: '1990-01-01',
    gender: 'masculino',
    location: 'São Paulo, SP',
    instagram: '',
    twitter: '',
    tiktok: '',
    bio: '',
    sports: ['Padel'],
    rackets: ['Nox'],
    username: '@joaosilva'
  });

  const [clubData, setClubData] = useState({
    clubName: '',
    fantasyName: '',
    email: '',
    cnpj: '',
    phone: '',
    city: '',
    state: '',
    fullAddress: '',
    description: '',
    courts: [] as Array<{ id: string; name: string }>,
    facilities: {
      parking: false,
      lockers: false,
      bar: false,
      restaurant: false,
      kidsArea: false
    },
    instagram: '',
    twitter: '',
    threads: ''
  });

  // Load initial club data if it exists
  useEffect(() => {
    if (isClub) {
      const savedClubData = localStorage.getItem('clubData');
      if (savedClubData) {
        const parsedData = JSON.parse(savedClubData);
        setClubData(prev => ({ ...prev, ...parsedData }));
      }
      
      // Clear the new club flag after first load
      if (isNewClub) {
        localStorage.removeItem('isNewClub');
      }
    }
  }, [isClub, isNewClub]);

  const menuItems = isClub ? [
    { id: 'profile', label: 'Perfil do Clube', icon: Building2 },
    { id: 'notifications', label: 'Notificações', icon: BellIcon },
    { id: 'privacy', label: 'Privacidade', icon: Lock },
    { id: 'permissions', label: 'Permissões', icon: Shield }
  ] : [
    { id: 'profile', label: 'Meu Perfil', icon: UserCheck },
    { id: 'performance', label: 'Minha Performance', icon: TrendingUp },
    { id: 'achievements', label: 'Conquistas', icon: Trophy },
    { id: 'notifications', label: 'Notificações', icon: BellIcon },
    { id: 'privacy', label: 'Privacidade', icon: Lock },
    { id: 'permissions', label: 'Permissões', icon: Shield },
    { id: 'partners', label: 'Parceiros', icon: UsersIcon }
  ];

  const sports = ['Padel', 'Tênis', 'Beach Tennis', 'Beach Vôlei', 'Squash', 'Badminton'];
  const rackets = ['Nox', 'Compass', 'Adidas', 'Dropshot', 'Siux', 'Head', 'Wilson', 'Babolat'];

  const achievements = [
    {
      id: 1,
      title: "Jogador da Semana",
      description: "Jogou mais de 5 partidas essa semana",
      icon: Trophy,
      earned: true
    },
    {
      id: 2,
      title: "Mestre do Padel",
      description: "Venceu 20 partidas em um mês",
      icon: Medal,
      earned: true
    },
    {
      id: 3,
      title: "Estrela em Ascensão",
      description: "Ganhou 3 torneios seguidos",
      icon: Star,
      earned: false
    },
    {
      id: 4,
      title: "Veterano",
      description: "Completou 1 ano jogando",
      icon: Award,
      earned: true
    }
  ];

  const notificationSettings = [
    {
      category: "Torneios",
      settings: [
        { id: "tournament_new", label: "Novos torneios na sua região", email: true, push: true },
        { id: "tournament_reminder", label: "Lembretes de torneios", email: true, push: true },
        { id: "tournament_results", label: "Resultados de torneios", email: true, push: true }
      ]
    },
    {
      category: "Social",
      settings: [
        { id: "new_follower", label: "Novos seguidores", email: true, push: true },
        { id: "match_invitation", label: "Convites para partidas", email: true, push: true },
        { id: "friend_activity", label: "Atividades dos amigos", email: false, push: true }
      ]
    },
    {
      category: "Sistema",
      settings: [
        { id: "system_updates", label: "Atualizações do sistema", email: true, push: false },
        { id: "security_alerts", label: "Alertas de segurança", email: true, push: true },
        { id: "newsletter", label: "Newsletter semanal", email: true, push: false }
      ]
    }
  ];

  const privacySettings = [
    {
      category: "Visibilidade do Perfil",
      settings: [
        { id: "profile_public", label: "Perfil público", description: "Seu perfil pode ser visto por qualquer pessoa", enabled: true },
        { id: "show_stats", label: "Mostrar estatísticas", description: "Suas estatísticas são visíveis para outros jogadores", enabled: true },
        { id: "show_achievements", label: "Mostrar conquistas", description: "Suas conquistas são visíveis para outros jogadores", enabled: true }
      ]
    },
    {
      category: "Interações",
      settings: [
        { id: "allow_messages", label: "Permitir mensagens", description: "Outros jogadores podem te enviar mensagens", enabled: true },
        { id: "allow_challenges", label: "Permitir desafios", description: "Outros jogadores podem te desafiar para partidas", enabled: true },
        { id: "show_activity", label: "Mostrar atividade", description: "Sua atividade recente é visível para outros jogadores", enabled: false }
      ]
    }
  ];

  const permissionSettings = [
    {
      category: "Dados Pessoais",
      settings: [
        { id: "location_access", label: "Acesso à localização", description: "Permitir acesso à sua localização para encontrar torneios próximos", enabled: true },
        { id: "contact_sync", label: "Sincronização de contatos", description: "Permitir sincronização com seus contatos para encontrar amigos", enabled: false },
        { id: "calendar_sync", label: "Sincronização de calendário", description: "Permitir adicionar eventos ao seu calendário", enabled: true }
      ]
    },
    {
      category: "Integrações",
      settings: [
        { id: "social_sharing", label: "Compartilhamento social", description: "Permitir compartilhamento automático nas redes sociais", enabled: false },
        { id: "fitness_apps", label: "Apps de fitness", description: "Permitir integração com apps de fitness", enabled: true },
        { id: "third_party", label: "Aplicativos de terceiros", description: "Permitir acesso a aplicativos de terceiros", enabled: false }
      ]
    }
  ];

  const partners = [
    {
      id: 1,
      name: "Maria Silva",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
      tournaments: 5,
      wins: 3,
      lastPlayed: "2024-03-15"
    },
    {
      id: 2,
      name: "Pedro Santos",
      image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
      tournaments: 3,
      wins: 2,
      lastPlayed: "2024-03-10"
    }
  ];

  const performanceStats = {
    overall: {
      matches: 45,
      wins: 30,
      winRate: 66.7,
      averageScore: 6.2
    },
    monthly: {
      matches: 12,
      wins: 8,
      improvement: 5.2
    },
    recentMatches: [
      { id: 1, result: "win", score: "6-4, 6-3", date: "2024-03-15" },
      { id: 2, result: "loss", score: "4-6, 6-7", date: "2024-03-12" },
      { id: 3, result: "win", score: "6-2, 6-1", date: "2024-03-10" }
    ],
    skills: {
      serve: 85,
      volley: 75,
      backhand: 70,
      forehand: 80,
      positioning: 78
    }
  };

  const handleSponsorSave = (name: string, image: string | null) => {
    if (name && image) {
      setSponsors([...sponsors, { name, image }]);
    }
    setShowSponsorModal(false);
  };

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

  const handleFieldEdit = (field: string) => {
    setEditingField(field);
  };

  const handleFieldSave = (field: string, value: string) => {
    if (isClub) {
      setClubData(prev => ({ ...prev, [field]: value }));
      localStorage.setItem('clubData', JSON.stringify({ ...clubData, [field]: value }));
    } else {
      setAthleteData(prev => ({ ...prev, [field]: value }));
      localStorage.setItem('userData', JSON.stringify({ ...athleteData, [field]: value }));
    }
    setEditingField(null);
  };

  const handleSaveProfile = () => {
    if (isClub) {
      localStorage.setItem('clubData', JSON.stringify(clubData));
      alert('Perfil do clube salvo com sucesso!');
    } else {
      localStorage.setItem('userData', JSON.stringify(athleteData));
      alert('Perfil salvo com sucesso!');
    }
  };

  const addCourt = () => {
    const newCourt = {
      id: Date.now().toString(),
      name: `Quadra ${clubData.courts.length + 1}`
    };
    setClubData(prev => ({
      ...prev,
      courts: [...prev.courts, newCourt]
    }));
  };

  const removeCourt = (courtId: string) => {
    setClubData(prev => ({
      ...prev,
      courts: prev.courts.filter(court => court.id !== courtId)
    }));
  };

  const updateCourtName = (courtId: string, name: string) => {
    setClubData(prev => ({
      ...prev,
      courts: prev.courts.map(court => 
        court.id === courtId ? { ...court, name } : court
      )
    }));
  };

  useEffect(() => {
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }

    if (!isClub) {
      const savedUserData = localStorage.getItem('userData');
      if (savedUserData) {
        setAthleteData(JSON.parse(savedUserData));
      }
    }
  }, [isClub]);

  const renderEditableField = (field: string, value: string, type: string = 'text') => {
    const isEditing = editingField === field;
    
    return (
      <div className="relative">
        {isEditing ? (
          <div className="flex items-center">
            <input
              type={type}
              value={value}
              onChange={(e) => {
                if (isClub) {
                  setClubData(prev => ({ ...prev, [field]: e.target.value }));
                } else {
                  setAthleteData(prev => ({ ...prev, [field]: e.target.value }));
                }
              }}
              className="block w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              autoFocus
            />
            <button
              onClick={() => handleFieldSave(field, isClub ? clubData[field as keyof typeof clubData] as string : athleteData[field as keyof typeof athleteData] as string)}
              className="absolute right-3 text-green-600 hover:text-green-700"
            >
              <Check size={16} />
            </button>
          </div>
        ) : (
          <div className="group relative">
            <input
              type={type}
              value={value}
              readOnly
              className="block w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer"
              onClick={() => handleFieldEdit(field)}
            />
            <Plus
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={() => handleFieldEdit(field)}
            />
          </div>
        )}
      </div>
    );
  };

  const renderClubProfile = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Perfil do Clube</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Foto de Perfil
          </label>
          <div className="relative w-32 h-32">
            <div 
              className="w-full h-full bg-gray-200 rounded-full overflow-hidden cursor-pointer group"
              onClick={handleImageClick}
            >
              {profileImage ? (
                <img 
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Camera size={40} className="text-gray-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={24} className="text-white" />
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome Fantasia</label>
            {renderEditableField('fantasyName', clubData.fantasyName)}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            {renderEditableField('email', clubData.email, 'email')}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">CNPJ</label>
            {renderEditableField('cnpj', clubData.cnpj)}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contato</label>
            {renderEditableField('phone', clubData.phone, 'tel')}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
            {renderEditableField('city', clubData.city)}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            {renderEditableField('state', clubData.state)}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Descrição do Clube</label>
          <div className="group relative">
            <textarea
              value={clubData.description}
              onChange={(e) => setClubData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
              placeholder="Descreva seu clube, instalações, diferenciais..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Quadras</label>
          <div className="space-y-2">
            {clubData.courts.map((court) => (
              <div key={court.id} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={court.name}
                  onChange={(e) => updateCourtName(court.id, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                />
                <button
                  onClick={() => removeCourt(court.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
            <button
              onClick={addCourt}
              className="flex items-center text-green-600 hover:text-green-700"
            >
              <Plus size={20} className="mr-2" />
              Adicionar Quadra
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Estrutura</label>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'parking', label: 'Estacionamento' },
              { key: 'lockers', label: 'Vestiários' },
              { key: 'bar', label: 'Bar' },
              { key: 'restaurant', label: 'Restaurante' },
              { key: 'kidsArea', label: 'Área Kids' }
            ].map((facility) => (
              <label key={facility.key} className="flex items-center">
                <input
                  type="checkbox"
                  checked={clubData.facilities[facility.key as keyof typeof clubData.facilities]}
                  onChange={(e) => setClubData(prev => ({
                    ...prev,
                    facilities: {
                      ...prev.facilities,
                      [facility.key]: e.target.checked
                    }
                  }))}
                  className="form-checkbox h-5 w-5 text-green-600"
                />
                <span className="ml-2">{facility.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Redes Sociais</label>
          <div className="space-y-3">
            <div className="flex items-center">
              <Instagram size={20} className="text-gray-500 mr-3" />
              <span className="text-gray-700 w-20">Instagram</span>
              <div className="flex-1">
                {renderEditableField('instagram', clubData.instagram)}
              </div>
            </div>

            <div className="flex items-center">
              <Twitter size={20} className="text-gray-500 mr-3" />
              <span className="text-gray-700 w-20">Twitter/X</span>
              <div className="flex-1">
                {renderEditableField('twitter', clubData.twitter)}
              </div>
            </div>

            <div className="flex items-center">
              <Globe size={20} className="text-gray-500 mr-3" />
              <span className="text-gray-700 w-20">Threads</span>
              <div className="flex-1">
                {renderEditableField('threads', clubData.threads)}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={handleSaveProfile}
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
          >
            Salvar Perfil do Clube
          </button>
        </div>
      </div>
    </div>
  );

  const renderAthleteProfile = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Meu Perfil</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Foto Atual
          </label>
          <div className="relative w-32 h-32">
            <div 
              className="w-full h-full bg-gray-200 rounded-full overflow-hidden cursor-pointer group"
              onClick={handleImageClick}
            >
              {profileImage ? (
                <img 
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Camera size={40} className="text-gray-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={24} className="text-white" />
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
            {renderEditableField('name', athleteData.name)}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Apelido</label>
            {renderEditableField('nickname', athleteData.nickname)}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data de Nascimento</label>
            {renderEditableField('birthDate', athleteData.birthDate, 'date')}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gênero</label>
            <div className="group relative">
              <select
                value={athleteData.gender}
                onChange={(e) => handleFieldSave('gender', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cidade/Estado</label>
            {renderEditableField('location', athleteData.location)}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <div className="group relative">
              <textarea
                value={athleteData.bio}
                onChange={(e) => setAthleteData(prev => ({ ...prev, bio: e.target.value }))}
                rows={4}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
                placeholder="Escreva um pouco sobre você..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Redes Sociais</label>
            <div className="space-y-2">
              <div className="flex items-center">
                <Instagram size={20} className="text-gray-500 mr-2" />
                <span className="text-gray-700">Instagram</span>
                <button
                  onClick={() => setShowSocialFields(prev => ({ ...prev, instagram: !prev.instagram }))}
                  className="ml-2 text-green-600 hover:text-green-700"
                >
                  <Plus size={16} />
                </button>
              </div>
              {showSocialFields.instagram && renderEditableField('instagram', athleteData.instagram)}

              <div className="flex items-center">
                <Twitter size={20} className="text-gray-500 mr-2" />
                <span className="text-gray-700">X</span>
                <button
                  onClick={() => setShowSocialFields(prev => ({ ...prev, twitter: !prev.twitter }))}
                  className="ml-2 text-green-600 hover:text-green-700"
                >
                  <Plus size={16} />
                </button>
              </div>
              {showSocialFields.twitter && renderEditableField('twitter', athleteData.twitter)}

              <div className="flex items-center">
                <svg viewBox="0 0 24 24" width="20" height="20" className="text-gray-500 mr-2">
                  <path fill="currentColor" d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.88 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .54.05.79.13v-3.31a6.07 6.07 0 0 0-.79-.05A6.21 6.21 0 0 0 3 16.13 6.21 6.21 0 0 0 9.2 22.34a6.21 6.21 0 0 0 6.21-6.21V9.04a8.16 8.16 0 0 0 4.18 1.12z"/>
                </svg>
                <span className="text-gray-700">TikTok</span>
                <button
                  onClick={() => setShowSocialFields(prev => ({ ...prev, threads: !prev.threads }))}
                  className="ml-2 text-green-600 hover:text-green-700"
                >
                  <Plus size={16} />
                </button>
              </div>
              {showSocialFields.threads && renderEditableField('tiktok', athleteData.tiktok)}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Esportes</label>
            <div className="flex flex-wrap gap-2">
              {sports.map(sport => (
                <label key={sport} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={athleteData.sports.includes(sport)}
                    onChange={(e) => {
                      const newSports = e.target.checked
                        ? [...athleteData.sports, sport]
                        : athleteData.sports.filter(s => s !== sport);
                      setAthleteData(prev => ({ ...prev, sports: newSports }));
                    }}
                    className="form-checkbox h-5 w-5 text-green-600"
                  />
                  <span className="ml-2">{sport}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Raquetes</label>
            <div className="flex flex-wrap gap-2">
              {rackets.map(racket => (
                <label key={racket} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={athleteData.rackets.includes(racket)}
                    onChange={(e) => {
                      const newRackets = e.target.checked
                        ? [...athleteData.rackets, racket]
                        : athleteData.rackets.filter(r => r !== racket);
                      setAthleteData(prev => ({ ...prev, rackets: newRackets }));
                    }}
                    className="form-checkbox h-5 w-5 text-green-600"
                  />
                  <span className="ml-2">{racket}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Patrocinadores</label>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {sponsors.map((sponsor, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <img
                    src={sponsor.image}
                    alt={sponsor.name}
                    className="h-20 object-contain mx-auto mb-2"
                  />
                  <p className="text-center text-sm font-medium">{sponsor.name}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowSponsorModal(true)}
              className="flex items-center text-green-600 hover:text-green-700"
            >
              <Plus size={20} className="mr-2" />
              Adicionar Patrocinador
            </button>
          </div>

          <div className="pt-4">
            <button
              onClick={handleSaveProfile}
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (selectedSection) {
      case 'profile':
        return isClub ? renderClubProfile() : renderAthleteProfile();

      case 'achievements':
        if (isClub) return <div className="text-center text-gray-600 py-12">Seção não disponível para clubes</div>;
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Conquistas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map(achievement => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border ${
                    achievement.earned
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      achievement.earned ? 'bg-green-200' : 'bg-gray-200'
                    }`}>
                      <achievement.icon
                        size={24}
                        className={achievement.earned ? 'text-green-600' : 'text-gray-500'}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Notificações</h2>
            {notificationSettings.map((category, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">{category.category}</h3>
                <div className="space-y-3">
                  {category.settings.map(setting => (
                    <div key={setting.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                      <div>
                        <p className="font-medium text-gray-900">{setting.label}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={setting.email}
                            onChange={() => {}}
                            className="form-checkbox h-5 w-5 text-green-600"
                          />
                          <span className="text-sm text-gray-600">Email</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={setting.push}
                            onChange={() => {}}
                            className="form-checkbox h-5 w-5 text-green-600"
                          />
                          <span className="text-sm text-gray-600">Push</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Privacidade</h2>
            {privacySettings.map((category, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">{category.category}</h3>
                <div className="space-y-3">
                  {category.settings.map(setting => (
                    <div key={setting.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                      <div>
                        <p className="font-medium text-gray-900">{setting.label}</p>
                        <p className="text-sm text-gray-600">{setting.description}</p>
                      </div>
                      <div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={setting.enabled}
                            onChange={() => {}}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 'permissions':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Permissões</h2>
            {permissionSettings.map((category, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">{category.category}</h3>
                <div className="space-y-3">
                  {category.settings.map(setting => (
                    <div key={setting.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                      <div>
                        <p className="font-medium text-gray-900">{setting.label}</p>
                        <p className="text-sm text-gray-600">{setting.description}</p>
                      </div>
                      <div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={setting.enabled}
                            onChange={() => {}}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 'partners':
        if (isClub) return <div className="text-center text-gray-600 py-12">Seção não disponível para clubes</div>;
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Parceiros de Jogo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {partners.map(partner => (
                <div key={partner.id} className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-4">
                    <img
                      src={partner.image}
                      alt={partner.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{partner.name}</h3>
                      <p className="text-sm text-gray-600">
                        {partner.tournaments} torneios juntos
                      </p>
                      <p className="text-sm text-gray-600">
                        {partner.wins} vitórias em dupla
                      </p>
                      <p className="text-sm text-gray-500">
                        Último jogo: {new Date(partner.lastPlayed).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'performance':
        if (isClub) return <div className="text-center text-gray-600 py-12">Seção não disponível para clubes</div>;
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Minha Performance</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-2">Geral</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Partidas: <span className="font-semibold">{performanceStats.overall.matches}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Vitórias: <span className="font-semibold">{performanceStats.overall.wins}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Taxa de vitória: <span className="font-semibold">{performanceStats.overall.winRate}%</span>
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-2">Este Mês</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Partidas: <span className="font-semibold">{performanceStats.monthly.matches}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Vitórias: <span className="font-semibold">{performanceStats.monthly.wins}</span>
                  </p>
                  <p className="text-sm text-green-600">
                    Melhoria: <span className="font-semibold">+{performanceStats.monthly.improvement}%</span>
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-2">Média de Pontos</h3>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {performanceStats.overall.averageScore}
                  </p>
                  <p className="text-sm text-gray-600">pontos por jogo</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-4">Habilidades</h3>
              <div className="space-y-4">
                {Object.entries(performanceStats.skills).map(([skill, value]) => (
                  <div key={skill} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600 capitalize">
                        {skill}
                      </span>
                      <span className="text-sm text-gray-600">{value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-4">Partidas Recentes</h3>
              <div className="space-y-3">
                {performanceStats.recentMatches.map(match => (
                  <div
                    key={match.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      match.result === 'win' ? 'bg-green-50' : 'bg-red-50'
                    }`}
                  >
                    <div>
                      <span className={`font-medium ${
                        match.result === 'win' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {match.result === 'win' ? 'Vitória' : 'Derrota'}
                      </span>
                      <p className="text-sm text-gray-600">{match.score}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(match.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center text-gray-600 py-12">
            Seção em desenvolvimento
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Menu */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow">
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedSection(item.id)}
                      className={`w-full text-left px-4 py-3 flex items-center space-x-3 ${
                        selectedSection === item.id
                          ? 'bg-green-50 border-l-4 border-green-600 text-green-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Center Column - Content */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-lg shadow p-6">
              {renderContent()}
            </div>
          </div>

          {/* Right Column - Account Info */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Conta</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">E-mail</label>
                  <p className="text-gray-900">
                    {isClub ? clubData.email || 'contato@clube.com' : 'usuario@email.com'}
                  </p>
                  <a href="#" className="text-sm text-green-600 hover:text-green-700">
                    Alterar e-mail de acesso
                  </a>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    {isClub ? 'Nome do Clube' : 'Usuário'}
                  </label>
                  <p className="text-gray-900">
                    {isClub ? clubData.clubName || 'Clube Exemplo' : athleteData.username}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Membro desde</label>
                  <p className="text-gray-900">01 de Janeiro de 2024</p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Deletar conta</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Ao deletar sua conta, todos os seus dados serão permanentemente removidos.
                    Esta ação não pode ser desfeita.
                  </p>
                  <button className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700">
                    Deletar Conta
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SponsorModal
        isOpen={showSponsorModal}
        onClose={() => setShowSponsorModal(false)}
        onSave={handleSponsorSave}
      />
    </div>
  );
};

export default Settings;