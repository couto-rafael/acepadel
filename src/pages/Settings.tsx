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
  Globe,
  CreditCard,
  DollarSign,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

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
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
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
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { profile } = useAuth();

  // Check user type
  const isClub = profile?.user_type === 'club';
  
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
    cnpj: '',
    email: '',
    phone: '',
    slogan: '',
    description: '',
    courts: [] as Array<{ id: string; name: string }>,
    extras: {
      parking: false,
      bar: false,
      restaurant: false,
      lockers: false,
      partyHall: false,
      barbecue: false
    },
    address: {
      cep: '',
      street: '',
      number: '',
      neighborhood: '',
      city: '',
      state: ''
    },
    pixKeys: [] as Array<{ id: string; type: string; key: string; order: number }>,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const menuItems = isClub ? [
    { id: 'profile', label: 'Perfil', icon: Building2 },
    { id: 'structure', label: 'Estrutura', icon: MapPin },
    { id: 'financial', label: 'Financeiro', icon: CreditCard },
    { id: 'account', label: 'Conta', icon: UserCheck },
    { id: 'notifications', label: 'Notificações', icon: BellIcon },
    { id: 'permissions', label: 'Permissões', icon: Shield },
    { id: 'privacy', label: 'Privacidade', icon: Lock }
  ] : [
    { id: 'profile', label: 'Meu Perfil', icon: UserCheck },
    { id: 'performance', label: 'Minha Performance', icon: TrendingUp },
    { id: 'achievements', label: 'Conquistas', icon: Trophy },
    { id: 'notifications', label: 'Notificações', icon: BellIcon },
    { id: 'permissions', label: 'Permissões', icon: Shield },
    { id: 'privacy', label: 'Privacidade', icon: Lock },
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
    },
    {
      category: "Conta",
      settings: [
        { id: "delete_account", label: "Deletar conta", description: "Remover permanentemente sua conta e todos os dados", enabled: false, isDestructive: true }
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

  const addPixKey = () => {
    const newPixKey = {
      id: Date.now().toString(),
      type: 'email',
      key: '',
      order: clubData.pixKeys.length + 1
    };
    setClubData(prev => ({
      ...prev,
      pixKeys: [...prev.pixKeys, newPixKey]
    }));
  };

  const removePixKey = (keyId: string) => {
    setClubData(prev => ({
      ...prev,
      pixKeys: prev.pixKeys.filter(key => key.id !== keyId)
    }));
  };

  const updatePixKey = (keyId: string, field: string, value: string) => {
    setClubData(prev => ({
      ...prev,
      pixKeys: prev.pixKeys.map(key => 
        key.id === keyId ? { ...key, [field]: value } : key
      )
    }));
  };

  const formatCNPJ = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18);
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d)(\d{4})/, '$1 $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 17);
  };

  const formatCEP = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 9);
  };

  useEffect(() => {
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }

    if (isClub) {
      const savedClubData = localStorage.getItem('clubData');
      if (savedClubData) {
        const parsedData = JSON.parse(savedClubData);
        setClubData(prev => ({ ...prev, ...parsedData }));
      }
    } else {
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
              className="block w-full px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              autoFocus
            />
            <button
              onClick={() => handleFieldSave(field, isClub ? clubData[field as keyof typeof clubData] as string : athleteData[field as keyof typeof athleteData] as string)}
              className="absolute right-3 text-primary-600 hover:text-primary-700"
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
            Logo do Clube
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Clube</label>
          <input
            type="text"
            value={clubData.clubName}
            onChange={(e) => setClubData(prev => ({ ...prev, clubName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">CNPJ</label>
          <input
            type="text"
            value={clubData.cnpj}
            onChange={(e) => setClubData(prev => ({ ...prev, cnpj: formatCNPJ(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="00.000.000/0000-00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={clubData.email}
            onChange={(e) => setClubData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contato</label>
          <input
            type="text"
            value={clubData.phone}
            onChange={(e) => setClubData(prev => ({ ...prev, phone: formatPhone(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="(00) 0 0000-0000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Slogan</label>
          <input
            type="text"
            value={clubData.slogan}
            onChange={(e) => setClubData(prev => ({ ...prev, slogan: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Slogan do seu clube"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Descrição do Clube</label>
          <textarea
            value={clubData.description}
            onChange={(e) => setClubData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
            placeholder="Descreva seu clube, instalações, diferenciais..."
          />
        </div>

        <div className="pt-4">
          <button
            onClick={handleSaveProfile}
            className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700"
          >
            Salvar Perfil
          </button>
        </div>
      </div>
    </div>
  );

  const renderStructure = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Estrutura</h2>
      
      <div className="space-y-6">
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
              className="flex items-center text-primary-600 hover:text-primary-700"
            >
              <Plus size={20} className="mr-2" />
              Adicionar Quadra
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Extras</label>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'parking', label: 'Estacionamento' },
              { key: 'bar', label: 'Bar' },
              { key: 'restaurant', label: 'Restaurante' },
              { key: 'lockers', label: 'Vestiários' },
              { key: 'partyHall', label: 'Salão de Festas' },
              { key: 'barbecue', label: 'Churrasqueira' }
            ].map((extra) => (
              <label key={extra.key} className="flex items-center">
                <input
                  type="checkbox"
                  checked={clubData.extras[extra.key as keyof typeof clubData.extras]}
                  onChange={(e) => setClubData(prev => ({
                    ...prev,
                    extras: {
                      ...prev.extras,
                      [extra.key]: e.target.checked
                    }
                  }))}
                  className="form-checkbox h-5 w-5 text-primary-600"
                />
                <span className="ml-2">{extra.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Endereço Completo</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">CEP</label>
              <input
                type="text"
                value={clubData.address.cep}
                onChange={(e) => setClubData(prev => ({
                  ...prev,
                  address: { ...prev.address, cep: formatCEP(e.target.value) }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="00000-000"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Rua</label>
              <input
                type="text"
                value={clubData.address.street}
                onChange={(e) => setClubData(prev => ({
                  ...prev,
                  address: { ...prev.address, street: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Número</label>
              <input
                type="text"
                value={clubData.address.number}
                onChange={(e) => setClubData(prev => ({
                  ...prev,
                  address: { ...prev.address, number: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Bairro</label>
              <input
                type="text"
                value={clubData.address.neighborhood}
                onChange={(e) => setClubData(prev => ({
                  ...prev,
                  address: { ...prev.address, neighborhood: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Cidade</label>
              <input
                type="text"
                value={clubData.address.city}
                onChange={(e) => setClubData(prev => ({
                  ...prev,
                  address: { ...prev.address, city: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Estado</label>
              <input
                type="text"
                value={clubData.address.state}
                onChange={(e) => setClubData(prev => ({
                  ...prev,
                  address: { ...prev.address, state: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Maps</label>
          <div className="bg-gray-100 h-32 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Google Maps será implementado aqui</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fotos</label>
          <div className="bg-gray-100 h-32 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Upload de fotos será implementado aqui</p>
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={handleSaveProfile}
            className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700"
          >
            Salvar Estrutura
          </button>
        </div>
      </div>
    </div>
  );

  const renderFinancial = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Financeiro</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Chaves PIX</label>
          <div className="space-y-3">
            {clubData.pixKeys.map((pixKey, index) => (
              <div key={pixKey.id} className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg">
                <span className="text-sm font-medium text-gray-600 w-8">{index + 1}º</span>
                <select
                  value={pixKey.type}
                  onChange={(e) => updatePixKey(pixKey.id, 'type', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="email">E-mail</option>
                  <option value="phone">Celular</option>
                  <option value="cnpj">CNPJ</option>
                  <option value="random">Chave Aleatória</option>
                </select>
                <input
                  type="text"
                  value={pixKey.key}
                  onChange={(e) => updatePixKey(pixKey.id, 'key', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Digite a chave PIX"
                />
                <button
                  onClick={() => removePixKey(pixKey.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
            <button
              onClick={addPixKey}
              className="flex items-center text-primary-600 hover:text-primary-700"
            >
              <Plus size={20} className="mr-2" />
              Adicionar Chave PIX
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Dados Financeiros</label>
          <div className="bg-gray-100 p-6 rounded-lg">
            <p className="text-gray-500 text-center">
              Área para dados financeiros como Valor Recebido em Torneios será desenvolvida
            </p>
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={handleSaveProfile}
            className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700"
          >
            Salvar Dados Financeiros
          </button>
        </div>
      </div>
    </div>
  );

  const renderAccount = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Conta</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Atual</label>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span>{clubData.email || 'contato@clube.com'}</span>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Alterar Email
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Alterar Senha</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Senha Atual</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={clubData.currentPassword}
                  onChange={(e) => setClubData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nova Senha</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={clubData.newPassword}
                  onChange={(e) => setClubData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Nova Senha</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={clubData.confirmPassword}
                  onChange={(e) => setClubData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">
              Alterar Senha
            </button>
          </div>
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
                    className="form-checkbox h-5 w-5 text-primary-600"
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
                    className="form-checkbox h-5 w-5 text-primary-600"
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
              className="flex items-center text-primary-600 hover:text-primary-700"
            >
              <Plus size={20} className="mr-2" />
              Adicionar Patrocinador
            </button>
          </div>

          <div className="pt-4">
            <button
              onClick={handleSaveProfile}
              className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (isClub) {
      switch (selectedSection) {
        case 'profile':
          return renderClubProfile();
        case 'structure':
          return renderStructure();
        case 'financial':
          return renderFinancial();
        case 'account':
          return renderAccount();
        case 'notifications':
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Notificações</h2>
              <div className="text-center text-gray-600 py-12">
                A ser desenvolvido
              </div>
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
                          {setting.isDestructive ? (
                            <button className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 transition-colors">
                              Deletar Conta
                            </button>
                          ) : (
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={setting.enabled}
                                onChange={() => {}}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            </label>
                          )}
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
              <div className="text-center text-gray-600 py-12">
                A ser desenvolvido
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
    } else {
      // Athlete sections (existing code)
      switch (selectedSection) {
        case 'profile':
          return renderAthleteProfile();
        case 'achievements':
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Conquistas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map(achievement => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border ${
                      achievement.earned
                        ? 'border-primary-200 bg-primary-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        achievement.earned ? 'bg-primary-200' : 'bg-gray-200'
                      }`}>
                        <achievement.icon
                          size={24}
                          className={achievement.earned ? 'text-primary-600' : 'text-gray-500'}
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
                              className="form-checkbox h-5 w-5 text-primary-600"
                            />
                            <span className="text-sm text-gray-600">Email</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={setting.push}
                              onChange={() => {}}
                              className="form-checkbox h-5 w-5 text-primary-600"
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
                          {setting.isDestructive ? (
                            <button className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 transition-colors">
                              Deletar Conta
                            </button>
                          ) : (
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={setting.enabled}
                                onChange={() => {}}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            </label>
                          )}
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
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
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
                      Vitórias: <span className="font-semibold text-primary-600">{performanceStats.overall.wins}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Taxa de vitória: <span className="font-semibold text-primary-600">{performanceStats.overall.winRate}%</span>
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
                    <p className="text-sm text-primary-600">
                      Melhoria: <span className="font-semibold">+{performanceStats.monthly.improvement}%</span>
                    </p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-700 mb-2">Média de Pontos</h3>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary-600">
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
                          className="bg-primary-600 h-2 rounded-full"
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
                        match.result === 'win' ? 'bg-primary-50' : 'bg-red-50'
                      }`}
                    >
                      <div>
                        <span className={`font-medium ${
                          match.result === 'win' ? 'text-primary-600' : 'text-red-600'
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
    }
  };

  return (
    <div className="min-h-screen bg-light">
      <DashboardHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Menu */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedSection(item.id)}
                      className={`w-full text-left px-4 py-3 flex items-center space-x-3 ${
                        selectedSection === item.id
                          ? 'bg-primary-50 border-l-4 border-primary-600 text-primary-700'
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
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              {renderContent()}
            </div>
          </div>

          {/* Right Column - Account Info */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Conta</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">E-mail</label>
                  <p className="text-gray-900">
                    {isClub ? clubData.email || 'contato@clube.com' : 'usuario@email.com'}
                  </p>
                  <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
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