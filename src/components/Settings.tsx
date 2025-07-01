import React, { useState, useRef, useEffect } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import { Calendar, Edit2, Camera, Plus, X, Check } from 'lucide-react';

interface SponsorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, image: File | null) => void;
}

const SponsorModal: React.FC<SponsorModalProps> = ({ isOpen, onClose, onSave }) => {
  const [sponsorName, setSponsorName] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

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
              onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
              className="w-full"
            />
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
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
    sponsors: [],
    username: '@joaosilva'
  });

  const menuItems = [
    { id: 'profile', label: 'Meu Perfil' },
    { id: 'account', label: 'Minha conta' },
    { id: 'performance', label: 'Minha performance' },
    { id: 'privacy', label: 'Privacidade' },
    { id: 'permissions', label: 'Permissões' },
    { id: 'notifications', label: 'Notificações' },
    { id: 'partners', label: 'Parceiros' },
    { id: 'achievements', label: 'Conquistas' }
  ];

  const sports = ['Padel', 'Tênis', 'Beach Tennis', 'Beach Vôlei', 'Squash', 'Badminton'];
  const rackets = ['Nox', 'Compass', 'Adidas', 'Dropshot', 'Siux', 'Head', 'Wilson', 'Babolat'];

  const handleSponsorSave = (name: string, image: File | null) => {
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
        // Save to localStorage to sync with Dashboard
        localStorage.setItem('profileImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFieldEdit = (field: string) => {
    setEditingField(field);
  };

  const handleFieldSave = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setEditingField(null);
    // Save to localStorage to sync with Dashboard
    localStorage.setItem('userData', JSON.stringify({ ...formData, [field]: value }));
  };

  const handleSaveProfile = () => {
    // Save all form data to localStorage
    localStorage.setItem('userData', JSON.stringify(formData));
    // You could also make an API call here to save the data
    alert('Perfil salvo com sucesso!');
  };

  useEffect(() => {
    // Load profile data from localStorage
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }

    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      setFormData(JSON.parse(savedUserData));
    }
  }, []);

  const renderEditableField = (field: string, value: string, type: string = 'text') => {
    const isEditing = editingField === field;
    
    return (
      <div className="relative">
        {isEditing ? (
          <div className="flex items-center">
            <input
              type={type}
              value={value}
              onChange={(e) => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
              className="block w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              autoFocus
            />
            <button
              onClick={() => handleFieldSave(field, formData[field as keyof typeof formData] as string)}
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
            <Edit2
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={() => handleFieldEdit(field)}
            />
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (selectedSection) {
      case 'profile':
        return (
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
                  {renderEditableField('name', formData.name)}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Apelido</label>
                  {renderEditableField('nickname', formData.nickname)}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data de Nascimento</label>
                  {renderEditableField('birthDate', formData.birthDate, 'date')}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gênero</label>
                  <div className="group relative">
                    <select
                      value={formData.gender}
                      onChange={(e) => handleFieldSave('gender', e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="masculino">Masculino</option>
                      <option value="feminino">Feminino</option>
                    </select>
                    <Edit2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cidade/Estado</label>
                  {renderEditableField('location', formData.location)}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <div className="group relative">
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      rows={4}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
                      placeholder="Escreva um pouco sobre você..."
                    />
                    <Edit2 size={16} className="absolute right-3 top-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                  {renderEditableField('instagram', formData.instagram)}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">X</label>
                  {renderEditableField('twitter', formData.twitter)}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">TikTok</label>
                  {renderEditableField('tiktok', formData.tiktok)}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Esportes</label>
                  <div className="relative">
                    <select
                      multiple
                      value={formData.sports}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                      onChange={(e) => {
                        const values = Array.from(e.target.selectedOptions, option => option.value);
                        setFormData(prev => ({ ...prev, sports: values }));
                        localStorage.setItem('userData', JSON.stringify({ ...formData, sports: values }));
                      }}
                    >
                      {sports.map(sport => (
                        <option key={sport} value={sport}>{sport}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Raquetes</label>
                  <div className="relative">
                    <select
                      multiple
                      value={formData.rackets}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                      onChange={(e) => {
                        const values = Array.from(e.target.selectedOptions, option => option.value);
                        setFormData(prev => ({ ...prev, rackets: values }));
                        localStorage.setItem('userData', JSON.stringify({ ...formData, rackets: values }));
                      }}
                    >
                      {rackets.map(racket => (
                        <option key={racket} value={racket}>{racket}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Patrocinadores</label>
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
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedSection(item.id)}
                    className={`w-full text-left px-4 py-3 flex items-center space-x-3 ${
                      selectedSection === item.id
                        ? 'bg-green-50 border-l-4 border-green-600 text-green-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
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
                  <p className="text-gray-900">usuario@email.com</p>
                </div>

                <div className="group relative">
                  <label className="block text-sm font-medium text-gray-500">Usuário</label>
                  {renderEditableField('username', formData.username)}
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