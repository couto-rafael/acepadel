import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TournamentCard from './TournamentCard';
import { Tournament, LocationFilter } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface TournamentListProps {
  filters: LocationFilter;
  limit?: number;
}

const TournamentList: React.FC<TournamentListProps> = ({ filters, limit }) => {
  const [filteredTournaments, setFilteredTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, profile } = useAuth();

  useEffect(() => {
    setIsLoading(true);
    
    // Get tournaments ONLY from localStorage (created by clubs)
    const clubTournaments = JSON.parse(localStorage.getItem('clubTournaments') || '[]');
    
    // Convert club tournaments to the Tournament format
    const convertedClubTournaments: Tournament[] = clubTournaments.map((tournament: any) => ({
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
    
    // Apply filters to club tournaments only
    let result = [...convertedClubTournaments];
    
    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(tournament => 
        tournament.name.toLowerCase().includes(searchLower) ||
        tournament.club.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by state if selected
    if (filters.state) {
      result = result.filter(tournament => tournament.location.state === filters.state);
    }
    
    // Filter by city if selected
    if (filters.city) {
      result = result.filter(tournament => tournament.location.city === filters.city);
    }

    // Filter by status if selected
    if (filters.status) {
      result = result.filter(tournament => tournament.status === filters.status);
    }
    
    // Sort by date and status (completed tournaments at the end)
    result.sort((a, b) => {
      if (a.status === 'completed' && b.status !== 'completed') return 1;
      if (a.status !== 'completed' && b.status === 'completed') return -1;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    // Apply limit if specified
    if (limit) {
      result = result.slice(0, limit);
    }
    
    setFilteredTournaments(result);
    setIsLoading(false);
  }, [filters, limit]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (filteredTournaments.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100">
        <h3 className="text-xl font-semibold text-dark-700 mb-2">Nenhum torneio encontrado</h3>
        <p className="text-dark-500 mb-4">
          {JSON.parse(localStorage.getItem('clubTournaments') || '[]').length === 0 
            ? 'Ainda não há torneios criados pelos clubes.' 
            : 'Tente ajustar seus filtros ou busque em outra região.'}
        </p>
        {/* Only show "Create Tournament" button if user is logged in and is a club */}
        {user && profile?.user_type === 'club' && (
          <Link 
            to="/create-tournament" 
            className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Criar Primeiro Torneio
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredTournaments.map((tournament) => (
        <Link key={tournament.id} to={`/tournament/${tournament.id}`} className="block">
          <TournamentCard tournament={tournament} />
        </Link>
      ))}
    </div>
  );
};

export default TournamentList;