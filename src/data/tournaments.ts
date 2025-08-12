import { Tournament } from '../types';

// This file now only contains utility functions and state data
// The actual tournaments displayed come from localStorage (created by clubs)

// List of Brazilian states for filtering
export const states = [
  { value: '', label: 'Todos os Estados' },
  { value: 'Acre', label: 'Acre' },
  { value: 'Alagoas', label: 'Alagoas' },
  { value: 'Amapá', label: 'Amapá' },
  { value: 'Amazonas', label: 'Amazonas' },
  { value: 'Bahia', label: 'Bahia' },
  { value: 'Ceará', label: 'Ceará' },
  { value: 'Distrito Federal', label: 'Distrito Federal' },
  { value: 'Espírito Santo', label: 'Espírito Santo' },
  { value: 'Goiás', label: 'Goiás' },
  { value: 'Maranhão', label: 'Maranhão' },
  { value: 'Mato Grosso', label: 'Mato Grosso' },
  { value: 'Mato Grosso do Sul', label: 'Mato Grosso do Sul' },
  { value: 'Minas Gerais', label: 'Minas Gerais' },
  { value: 'Pará', label: 'Pará' },
  { value: 'Paraíba', label: 'Paraíba' },
  { value: 'Paraná', label: 'Paraná' },
  { value: 'Pernambuco', label: 'Pernambuco' },
  { value: 'Piauí', label: 'Piauí' },
  { value: 'Rio de Janeiro', label: 'Rio de Janeiro' },
  { value: 'Rio Grande do Norte', label: 'Rio Grande do Norte' },
  { value: 'Rio Grande do Sul', label: 'Rio Grande do Sul' },
  { value: 'Rondônia', label: 'Rondônia' },
  { value: 'Roraima', label: 'Roraima' },
  { value: 'Santa Catarina', label: 'Santa Catarina' },
  { value: 'São Paulo', label: 'São Paulo' },
  { value: 'Sergipe', label: 'Sergipe' },
  { value: 'Tocantins', label: 'Tocantins' }
];

// Get cities based on state (simplified version with just a few cities per state)
export const getCitiesByState = (stateCode: string) => {
  if (!stateCode) return [{ value: '', label: 'Todas as Cidades' }];
  
  const citiesByState: Record<string, {value: string, label: string}[]> = {
    'São Paulo': [
      { value: '', label: 'Todas as Cidades' },
      { value: 'São Paulo', label: 'São Paulo' },
      { value: 'Campinas', label: 'Campinas' },
      { value: 'Santos', label: 'Santos' }
    ],
    'Rio de Janeiro': [
      { value: '', label: 'Todas as Cidades' },
      { value: 'Rio de Janeiro', label: 'Rio de Janeiro' },
      { value: 'Niterói', label: 'Niterói' },
      { value: 'Petrópolis', label: 'Petrópolis' }
    ],
    'Minas Gerais': [
      { value: '', label: 'Todas as Cidades' },
      { value: 'Belo Horizonte', label: 'Belo Horizonte' },
      { value: 'Uberlândia', label: 'Uberlândia' },
      { value: 'Juiz de Fora', label: 'Juiz de Fora' }
    ],
    'Rio Grande do Sul': [
      { value: '', label: 'Todas as Cidades' },
      { value: 'Porto Alegre', label: 'Porto Alegre' },
      { value: 'Gramado', label: 'Gramado' },
      { value: 'Caxias do Sul', label: 'Caxias do Sul' }
    ],
    'Bahia': [
      { value: '', label: 'Todas as Cidades' },
      { value: 'Salvador', label: 'Salvador' },
      { value: 'Porto Seguro', label: 'Porto Seguro' },
      { value: 'Ilhéus', label: 'Ilhéus' }
    ],
    'Paraná': [
      { value: '', label: 'Todas as Cidades' },
      { value: 'Curitiba', label: 'Curitiba' },
      { value: 'Londrina', label: 'Londrina' },
      { value: 'Foz do Iguaçu', label: 'Foz do Iguaçu' }
    ],
    'Pernambuco': [
      { value: '', label: 'Todas as Cidades' },
      { value: 'Recife', label: 'Recife' },
      { value: 'Olinda', label: 'Olinda' },
      { value: 'Porto de Galinhas', label: 'Porto de Galinhas' }
    ],
    'Santa Catarina': [
      { value: '', label: 'Todas as Cidades' },
      { value: 'Florianópolis', label: 'Florianópolis' },
      { value: 'Balneário Camboriú', label: 'Balneário Camboriú' },
      { value: 'Blumenau', label: 'Blumenau' }
    ],
    'Distrito Federal': [
      { value: '', label: 'Todas as Cidades' },
      { value: 'Brasília', label: 'Brasília' },
      { value: 'Taguatinga', label: 'Taguatinga' },
      { value: 'Águas Claras', label: 'Águas Claras' }
    ],
    'Amazonas': [
      { value: '', label: 'Todas as Cidades' },
      { value: 'Manaus', label: 'Manaus' }
    ]
  };
  
  return citiesByState[stateCode] || [{ value: '', label: 'Todas as Cidades' }];
};

// Function to get tournaments from localStorage (created by clubs)
export const getClubTournaments = (): Tournament[] => {
  const clubTournaments = JSON.parse(localStorage.getItem('clubTournaments') || '[]');
  
  return clubTournaments.map((tournament: any) => ({
    id: tournament.id,
    name: tournament.name,
    club: tournament.mainClub || 'Clube',
    location: {
      city: tournament.location?.city || tournament.city || 'São Paulo',
      state: tournament.location?.state || tournament.state || 'SP'
    },
    date: tournament.startDate,
    status: tournament.status === 'scheduled' ? 'open' : tournament.status,
    participantsCount: tournament.participantsCount || 0
  }));
};

// Export empty array for tournaments since we now get them from localStorage
export const tournaments: Tournament[] = [];