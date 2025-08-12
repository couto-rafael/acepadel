import React, { useState, useEffect } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  FileText, 
  Building2, 
  MapPin, 
  Timer, 
  Trophy, 
  Camera, 
  Upload, 
  Plus, 
  X, 
  ChevronRight,
  ChevronLeft,
  Check
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface TournamentData {
  name: string;
  tournamentType: 'regular' | 'super8';
  startDate: string;
  endDate: string;
  dailySchedules: Array<{
    date: string;
    startTime: string;
    endTime: string;
  }>;
  registrationFee: number;
  description: string;
  mainClub: string;
  subClub: string;
  hasSubClub: boolean;
  courts: Array<{ id: string; name: string }>;
  matchDuration: string;
  categories: string[];
  profileImage: string | null;
  bannerImage: string | null;
  sponsors: Array<{ id: string; name: string; image: string }>;
  streamingLinks: Array<{ courtId: string; courtName: string; link: string }>;
  hasParticipantLimit: boolean;
}

const CreateTournament: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const { profile } = useAuth();
  const [tournamentData, setTournamentData] = useState<TournamentData>({
    name: '',
    tournamentType: 'regular',
    startDate: '',
    endDate: '',
    dailySchedules: [],
    registrationFee: 0,
    description: '',
    mainClub: '',
    subClub: '',
    hasSubClub: false,
    courts: [],
    matchDuration: '90',
    categories: [],
    profileImage: null,
    bannerImage: null,
    sponsors: [],
    streamingLinks: [],
    hasParticipantLimit: false
  });

  const tabs = [
    { id: 0, name: 'Informações Essenciais', icon: FileText },
    { id: 1, name: 'Estrutura', icon: Building2 },
    { id: 2, name: 'Categorias', icon: Trophy },
    { id: 3, name: 'Imagens', icon: Camera },
    { id: 4, name: 'Regras', icon: FileText },
    { id: 5, name: 'Transmissão', icon: Upload }
  ];

  const predefinedCategories = [
    'Open Masculina', 'Open Feminina', '2ª Masc', '2ª Fem', '3ª Masc', '3ª Fem',
    '4ª Masc', '4ª Fem', '5ª Masc', '5ª Fem', '6ª Masc', '6ª Fem',
    '7ª Masc', '7ª Fem', 'Mista A', 'Mista B', 'Mista C', 'Mista D'
  ];

  useEffect(() => {
    // Load club data from profile
    if (profile && profile.user_type === 'club') {
      setTournamentData(prev => ({
        ...prev,
        mainClub: profile.fantasy_name || profile.club_name || 'Meu Clube',
        courts: profile.courts || []
      }));
    }
  }, [profile]);

  useEffect(() => {
    // Generate daily schedules when dates change
    if (tournamentData.startDate && tournamentData.endDate) {
      const start = new Date(tournamentData.startDate);
      const end = new Date(tournamentData.endDate);
      const schedules = [];
      
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const existing = tournamentData.dailySchedules.find(s => s.date === dateStr);
        schedules.push({
          date: dateStr,
          startTime: existing?.startTime || '08:00',
          endTime: existing?.endTime || '18:00'
        });
      }
      
      setTournamentData(prev => ({ ...prev, dailySchedules: schedules }));
    }
  }, [tournamentData.startDate, tournamentData.endDate]);

  const handleInputChange = (field: keyof TournamentData, value: any) => {
    setTournamentData(prev => ({ ...prev, [field]: value }));
  };

  const handleScheduleChange = (date: string, field: 'startTime' | 'endTime', value: string) => {
    setTournamentData(prev => ({
      ...prev,
      dailySchedules: prev.dailySchedules.map(schedule =>
        schedule.date === date ? { ...schedule, [field]: value } : schedule
      )
    }));
  };

  const addCourt = () => {
    const newCourt = {
      id: Date.now().toString(),
      name: `Quadra ${tournamentData.courts.length + 1}`
    };
    setTournamentData(prev => ({
      ...prev,
      courts: [...prev.courts, newCourt]
    }));
  };

  const removeCourt = (courtId: string) => {
    setTournamentData(prev => ({
      ...prev,
      courts: prev.courts.filter(court => court.id !== courtId)
    }));
  };

  const updateCourtName = (courtId: string, name: string) => {
    setTournamentData(prev => ({
      ...prev,
      courts: prev.courts.map(court => 
        court.id === courtId ? { ...court, name } : court
      )
    }));
  };

  const toggleCategory = (category: string) => {
    setTournamentData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const selectAllCategories = () => {
    setTournamentData(prev => ({
      ...prev,
      categories: predefinedCategories
    }));
  };

  const deselectAllCategories = () => {
    setTournamentData(prev => ({
      ...prev,
      categories: []
    }));
  };

  const addCustomCategory = () => {
    const categoryName = prompt('Nome da categoria:');
    if (categoryName && categoryName.trim()) {
      setTournamentData(prev => ({
        ...prev,
        categories: [...prev.categories, categoryName.trim()]
      }));
    }
  };

  const handleImageUpload = (field: 'profileImage' | 'bannerImage', file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setTournamentData(prev => ({ ...prev, [field]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const addSponsor = (name: string, image: string) => {
    const newSponsor = {
      id: Date.now().toString(),
      name,
      image
    };
    setTournamentData(prev => ({
      ...prev,
      sponsors: [...prev.sponsors, newSponsor]
    }));
  };

  const removeSponsor = (sponsorId: string) => {
    setTournamentData(prev => ({
      ...prev,
      sponsors: prev.sponsors.filter(sponsor => sponsor.id !== sponsorId)
    }));
  };

  const updateStreamingLink = (courtId: string, link: string) => {
    setTournamentData(prev => ({
      ...prev,
      streamingLinks: prev.streamingLinks.some(s => s.courtId === courtId)
        ? prev.streamingLinks.map(s => s.courtId === courtId ? { ...s, link } : s)
        : [...prev.streamingLinks, { 
            courtId, 
            courtName: prev.courts.find(c => c.id === courtId)?.name || '', 
            link 
          }]
    }));
  };

  const nextTab = () => {
    if (currentTab < tabs.length - 1) {
      setCurrentTab(currentTab + 1);
    }
  };

  const prevTab = () => {
    if (currentTab > 0) {
      setCurrentTab(currentTab - 1);
    }
  };

  const saveTournament = () => {
    // Save tournament data
    const existingTournaments = JSON.parse(localStorage.getItem('clubTournaments') || '[]');
    const newTournament = {
      id: Date.now().toString(),
      ...tournamentData,
      status: 'scheduled',
      participantsCount: 0,
      maxParticipants: 64, // Default value
      createdAt: new Date().toISOString(),
      // Add location data for the tournaments page
      location: {
        city: profile?.city || 'São Paulo',
        state: profile?.state || 'SP'
      }
    };
    
    const updatedTournaments = [...existingTournaments, newTournament];
    localStorage.setItem('clubTournaments', JSON.stringify(updatedTournaments));
    
    alert('Torneio criado com sucesso!');
    // Redirect to my tournaments page
    window.location.href = '/my-tournaments';
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case 0: // Informações Essenciais
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-dark-800">Informações Essenciais</h2>
            
            <div>
              <label className="block text-sm font-semibold text-dark-700 mb-2">
                <div className="flex items-center space-x-2">
                  <span>Nome do Torneio *</span>
                  <div className="relative group">
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
                      </svg>
                    </button>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-dark-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      {tournamentData.tournamentType === 'regular' 
                        ? 'Regular: Aberto a qualquer número de duplas. Fase de grupos e mata-mata.'
                        : 'Super 8: Apenas 8 inscritos. Super 8 clássico, cada atleta jogando 1x com outro.'
                      }
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-dark-800"></div>
                    </div>
                  </div>
                </div>
              </label>
              <div className="flex items-center space-x-6 mb-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-semibold text-dark-700">Tipo de Torneio:</span>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="tournamentType"
                        value="regular"
                        checked={tournamentData.tournamentType === 'regular'}
                        onChange={(e) => handleInputChange('tournamentType', e.target.value)}
                        className="sr-only"
                      />
                      <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        tournamentData.tournamentType === 'regular' ? 'bg-primary-600' : 'bg-gray-300'
                      }`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          tournamentData.tournamentType === 'regular' ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </div>
                      <span className="ml-2 text-sm font-medium text-dark-700">Regular</span>
                    </label>
                    
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="tournamentType"
                        value="super8"
                        checked={tournamentData.tournamentType === 'super8'}
                        onChange={(e) => handleInputChange('tournamentType', e.target.value)}
                        className="sr-only"
                      />
                      <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        tournamentData.tournamentType === 'super8' ? 'bg-purple-600' : 'bg-gray-300'
                      }`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          tournamentData.tournamentType === 'super8' ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </div>
                      <span className="ml-2 text-sm font-medium text-dark-700">Super 8</span>
                    </label>
                  </div>
                </div>
              </div>
              <input
                type="text"
                value={tournamentData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder="Digite o nome do torneio"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-dark-700 mb-2">
                  Data Início *
                </label>
                <input
                  type="date"
                  value={tournamentData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark-700 mb-2">
                  Data Fim *
                </label>
                <input
                  type="date"
                  value={tournamentData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  required
                />
              </div>
            </div>

            {tournamentData.dailySchedules.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-dark-700 mb-2">
                  Horários por Dia
                </label>
                <div className="space-y-3">
                  {tournamentData.dailySchedules.map((schedule) => (
                    <div key={schedule.date} className="flex items-center space-x-4 p-4 bg-accent-50 rounded-lg border border-accent-200">
                      <div className="flex-1">
                        <span className="text-sm font-semibold text-dark-700">
                          {new Date(schedule.date + 'T00:00:00').toLocaleDateString('pt-BR', { 
                            weekday: 'long', 
                            day: '2-digit', 
                            month: '2-digit' 
                          })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock size={16} className="text-primary-500" />
                        <input
                          type="time"
                          value={schedule.startTime}
                          onChange={(e) => handleScheduleChange(schedule.date, 'startTime', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <span className="text-dark-500 font-medium">até</span>
                        <input
                          type="time"
                          value={schedule.endTime}
                          onChange={(e) => handleScheduleChange(schedule.date, 'endTime', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-dark-700 mb-2">
                Valor Inscrição *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 font-medium">R$</span>
                <input
                  type="text"
                  value={tournamentData.registrationFee.toFixed(2)}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    const numericValue = parseFloat(value) / 100;
                    handleInputChange('registrationFee', isNaN(numericValue) ? 0 : numericValue);
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  placeholder="0,00"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark-700 mb-2">
                Descrição do Torneio
              </label>
              <textarea
                value={tournamentData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none"
                placeholder="Descreva o torneio, regras especiais, premiação, etc."
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={tournamentData.hasParticipantLimit}
                  onChange={(e) => handleInputChange('hasParticipantLimit', e.target.checked)}
                  className="form-checkbox h-5 w-5 text-primary-600 rounded focus:ring-primary-500 mr-3"
                />
                <span className="text-sm font-semibold text-dark-700">Limite de Inscritos?</span>
              </label>
              {tournamentData.hasParticipantLimit && (
                <div className="mt-3">
                  <label className="block text-sm font-semibold text-dark-700 mb-2">
                    Número máximo de duplas
                  </label>
                  <input
                    type="number"
                    min="4"
                    max="128"
                    value={tournamentData.maxParticipants || ''}
                    onChange={(e) => handleInputChange('maxParticipants', parseInt(e.target.value) || null)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    placeholder="Ex: 64"
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <button
                onClick={nextTab}
                className="bg-gradient-to-r from-primary-900 to-primary-700 text-white px-6 py-3 rounded-lg hover:from-primary-800 hover:to-primary-600 transition-all duration-300 flex items-center font-semibold shadow-lg"
              >
                Próximo
                <ChevronRight size={20} className="ml-2" />
              </button>
            </div>
          </div>
        );

      case 1: // Estrutura
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-dark-800">Estrutura</h2>
            
            <div>
              <label className="block text-sm font-semibold text-dark-700 mb-2">
                Clube Sede
              </label>
              <input
                type="text"
                value={tournamentData.mainClub}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={tournamentData.hasSubClub}
                  onChange={(e) => handleInputChange('hasSubClub', e.target.checked)}
                  className="form-checkbox h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm font-semibold text-dark-700">Clube Sub-sede?</span>
              </label>
              {tournamentData.hasSubClub && (
                <input
                  type="text"
                  value={tournamentData.subClub}
                  onChange={(e) => handleInputChange('subClub', e.target.value)}
                  className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  placeholder="Nome do clube sub-sede"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark-700 mb-2">
                Quadras
              </label>
              <div className="space-y-2">
                {tournamentData.courts.map((court) => (
                  <div key={court.id} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={court.name}
                      onChange={(e) => updateCourtName(court.id, e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      onClick={() => removeCourt(court.id)}
                      className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addCourt}
                  className="flex items-center text-primary-600 hover:text-primary-700 font-semibold"
                >
                  <Plus size={20} className="mr-2" />
                  Adicionar Quadra
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark-700 mb-2">
                Tempo por Partida (minutos)
              </label>
              <div className="relative">
                <Timer size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" />
                <input
                  type="number"
                  value={tournamentData.matchDuration}
                  onChange={(e) => handleInputChange('matchDuration', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  placeholder="90"
                  min="30"
                  max="180"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={prevTab}
                className="bg-dark-600 text-white px-6 py-3 rounded-lg hover:bg-dark-700 transition-all duration-300 flex items-center font-semibold"
              >
                <ChevronLeft size={20} className="mr-2" />
                Anterior
              </button>
              <button
                onClick={nextTab}
                className="bg-gradient-to-r from-primary-900 to-primary-700 text-white px-6 py-3 rounded-lg hover:from-primary-800 hover:to-primary-600 transition-all duration-300 flex items-center font-semibold shadow-lg"
              >
                Próximo
                <ChevronRight size={20} className="ml-2" />
              </button>
            </div>
          </div>
        );

      case 2: // Categorias
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-dark-800">Categorias</h2>
            
            <div>
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-dark-600">
                  Selecione as categorias que estarão disponíveis no torneio:
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={selectAllCategories}
                    className="text-sm bg-primary-100 text-primary-700 px-3 py-1 rounded-lg hover:bg-primary-200 transition-colors"
                  >
                    Selecionar Todas
                  </button>
                  <button
                    onClick={deselectAllCategories}
                    className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Desmarcar Todas
                  </button>
                  <button
                    onClick={addCustomCategory}
                    className="text-sm bg-accent-100 text-accent-700 px-3 py-1 rounded-lg hover:bg-accent-200 transition-colors flex items-center"
                  >
                    <Plus size={16} className="mr-1" />
                    Adicionar
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {predefinedCategories.map((category) => (
                  <label
                    key={category}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      tournamentData.categories.includes(category)
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={tournamentData.categories.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="form-checkbox h-4 w-4 text-primary-600 mr-3 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm font-semibold">{category}</span>
                  </label>
                ))}
                
                {/* Custom categories */}
                {tournamentData.categories
                  .filter(cat => !predefinedCategories.includes(cat))
                  .map((category) => (
                    <label
                      key={category}
                      className="flex items-center p-4 border-2 border-accent-500 bg-accent-50 text-accent-700 rounded-lg cursor-pointer transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={true}
                        onChange={() => toggleCategory(category)}
                        className="form-checkbox h-4 w-4 text-accent-600 mr-3 rounded focus:ring-accent-500"
                      />
                      <span className="text-sm font-semibold">{category}</span>
                    </label>
                  ))}
              </div>
              
              {tournamentData.categories.length > 0 && (
                <div className="mt-4 p-4 bg-accent-50 rounded-lg border border-accent-200">
                  <p className="text-sm text-accent-700 font-semibold">
                    <strong>{tournamentData.categories.length}</strong> categoria(s) selecionada(s)
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <button
                onClick={prevTab}
                className="bg-dark-600 text-white px-6 py-3 rounded-lg hover:bg-dark-700 transition-all duration-300 flex items-center font-semibold"
              >
                <ChevronLeft size={20} className="mr-2" />
                Anterior
              </button>
              <button
                onClick={nextTab}
                className="bg-gradient-to-r from-primary-900 to-primary-700 text-white px-6 py-3 rounded-lg hover:from-primary-800 hover:to-primary-600 transition-all duration-300 flex items-center font-semibold shadow-lg"
              >
                Próximo
                <ChevronRight size={20} className="ml-2" />
              </button>
            </div>
          </div>
        );

      case 3: // Imagens
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-dark-800">Imagens</h2>
            
            <div>
              <label className="block text-sm font-semibold text-dark-700 mb-2">
                Foto de Perfil do Torneio
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  {tournamentData.profileImage ? (
                    <img
                      src={tournamentData.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Camera size={32} className="text-gray-400" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload('profileImage', file);
                  }}
                  className="hidden"
                  id="profile-image"
                />
                <label
                  htmlFor="profile-image"
                  className="bg-gradient-to-r from-primary-900 to-primary-700 text-white px-4 py-2 rounded-lg hover:from-primary-800 hover:to-primary-600 cursor-pointer transition-all font-semibold"
                >
                  Escolher Imagem
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark-700 mb-2">
                Foto Banner do Torneio
              </label>
              <div className="space-y-4">
                <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  {tournamentData.bannerImage ? (
                    <img
                      src={tournamentData.bannerImage}
                      alt="Banner"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center">
                      <Camera size={48} className="text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Banner do torneio</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload('bannerImage', file);
                  }}
                  className="hidden"
                  id="banner-image"
                />
                <label
                  htmlFor="banner-image"
                  className="bg-gradient-to-r from-primary-900 to-primary-700 text-white px-4 py-2 rounded-lg hover:from-primary-800 hover:to-primary-600 cursor-pointer inline-block transition-all font-semibold"
                >
                  Escolher Banner
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark-700 mb-2">
                Patrocinadores
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {tournamentData.sponsors.map((sponsor) => (
                  <div key={sponsor.id} className="relative border border-gray-300 rounded-lg p-4">
                    <button
                      onClick={() => removeSponsor(sponsor.id)}
                      className="absolute top-2 right-2 text-red-600 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                    <img
                      src={sponsor.image}
                      alt={sponsor.name}
                      className="w-full h-20 object-contain mb-2"
                    />
                    <p className="text-sm font-medium text-center">{sponsor.name}</p>
                  </div>
                ))}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const name = prompt('Nome do patrocinador:');
                    if (name) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        addSponsor(name, reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }
                }}
                className="hidden"
                id="sponsor-image"
              />
              <label
                htmlFor="sponsor-image"
                className="bg-gradient-to-r from-primary-900 to-primary-700 text-white px-4 py-2 rounded-lg hover:from-primary-800 hover:to-primary-600 cursor-pointer inline-flex items-center transition-all font-semibold"
              >
                <Plus size={20} className="mr-2" />
                Adicionar Patrocinador
              </label>
            </div>

            <div className="flex justify-between">
              <button
                onClick={prevTab}
                className="bg-dark-600 text-white px-6 py-3 rounded-lg hover:bg-dark-700 transition-all duration-300 flex items-center font-semibold"
              >
                <ChevronLeft size={20} className="mr-2" />
                Anterior
              </button>
              <button
                onClick={nextTab}
                className="bg-gradient-to-r from-primary-900 to-primary-700 text-white px-6 py-3 rounded-lg hover:from-primary-800 hover:to-primary-600 transition-all duration-300 flex items-center font-semibold shadow-lg"
              >
                Próximo
                <ChevronRight size={20} className="ml-2" />
              </button>
            </div>
          </div>
        );

      case 4: // Regras
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-dark-800">Regras</h2>
            
            <div className="text-center py-12">
              <FileText size={64} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-dark-900 mb-2">
                Seção em Desenvolvimento
              </h3>
              <p className="text-dark-500">
                Esta seção será desenvolvida em breve para configuração das regras do torneio.
              </p>
            </div>

            <div className="flex justify-between">
              <button
                onClick={prevTab}
                className="bg-dark-600 text-white px-6 py-3 rounded-lg hover:bg-dark-700 transition-all duration-300 flex items-center font-semibold"
              >
                <ChevronLeft size={20} className="mr-2" />
                Anterior
              </button>
              <button
                onClick={nextTab}
                className="bg-gradient-to-r from-primary-900 to-primary-700 text-white px-6 py-3 rounded-lg hover:from-primary-800 hover:to-primary-600 transition-all duration-300 flex items-center font-semibold shadow-lg"
              >
                Próximo
                <ChevronRight size={20} className="ml-2" />
              </button>
            </div>
          </div>
        );

      case 5: // Transmissão
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-dark-800">Transmissão</h2>
            
            <div>
              <p className="text-sm text-dark-600 mb-4">
                Configure os links de transmissão ao vivo para cada quadra:
              </p>
              <div className="space-y-4">
                {tournamentData.courts.map((court) => (
                  <div key={court.id} className="flex items-center space-x-4 p-4 border border-gray-300 rounded-lg">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-dark-700 mb-1">
                        {court.name}
                      </label>
                      <input
                        type="url"
                        value={tournamentData.streamingLinks.find(s => s.courtId === court.id)?.link || ''}
                        onChange={(e) => updateStreamingLink(court.id, e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                        placeholder="https://youtube.com/live/..."
                      />
                    </div>
                    <Upload size={20} className="text-dark-400" />
                  </div>
                ))}
              </div>
              {tournamentData.courts.length === 0 && (
                <div className="text-center py-8 text-dark-500">
                  <p>Nenhuma quadra cadastrada. Volte para a aba "Estrutura" para adicionar quadras.</p>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <button
                onClick={prevTab}
                className="bg-dark-600 text-white px-6 py-3 rounded-lg hover:bg-dark-700 transition-all duration-300 flex items-center font-semibold"
              >
                <ChevronLeft size={20} className="mr-2" />
                Anterior
              </button>
              <button
                onClick={saveTournament}
                className="bg-gradient-to-r from-accent-500 to-accent-400 text-dark-900 px-6 py-3 rounded-lg hover:from-accent-400 hover:to-accent-300 transition-all duration-300 flex items-center font-bold shadow-lg"
              >
                <Check size={20} className="mr-2" />
                Criar Torneio
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-light">
      <DashboardHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-900">Criar Torneio</h1>
          <p className="text-dark-600 mt-2">Configure todos os detalhes do seu novo torneio</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Tabs */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setCurrentTab(tab.id)}
                      className={`w-full text-left px-4 py-3 flex items-center space-x-3 transition-all ${
                        currentTab === tab.id
                          ? 'bg-primary-50 border-l-4 border-primary-600 text-primary-700'
                          : 'text-dark-600 hover:bg-accent-50'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTournament;