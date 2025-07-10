import React from 'react';
import { MapPin, Calendar, Users, Zap, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tournament } from '../types';
import StatusBadge from './StatusBadge';

interface TournamentCardProps {
  tournament: Tournament;
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament }) => {
  const { id, name, club, location, date, status, participantsCount } = tournament;
  
  // Get tournament data from localStorage to check if it has participant limit
  const clubTournaments = JSON.parse(localStorage.getItem('clubTournaments') || '[]');
  const tournamentData = clubTournaments.find((t: any) => t.id === id);
  const hasParticipantLimit = tournamentData?.hasParticipantLimit && tournamentData?.maxParticipants;

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  const canRegister = status === 'open';

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100 group hover:-translate-y-1 cursor-pointer">
      <div className="p-6 flex-1">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-dark-800 mb-1 group-hover:text-primary-900 transition-colors">{name}</h2>
          <StatusBadge status={status} />
        </div>
        
        <div className="mb-3">
          <p className="text-dark-600 font-semibold">{club}</p>
        </div>
        
        <div className="flex items-center text-dark-600 mb-3">
          <MapPin size={18} className="mr-2 text-primary-600" />
          <span>{location.city}, {location.state}</span>
        </div>
        
        <div className="flex items-center text-dark-600 mb-3">
          <Calendar size={18} className="mr-2 text-primary-600" />
          <span>{formatDate(date)}</span>
        </div>
        
        <div className="flex items-center text-dark-600">
          <Users size={18} className="mr-2 text-primary-600" />
          <span>
            {participantsCount} 
            {hasParticipantLimit ? ` / ${tournamentData.maxParticipants}` : ''} 
            inscritos
          </span>
        </div>
      </div>
      
      <div className="p-6 pt-0 mt-auto">
        <div className="flex flex-col gap-3">
          {/* Top row buttons */}
          <div className="flex gap-3">
            <Link
              to={`/tournament/${id}?tab=inscritos`}
              onClick={handleButtonClick}
              className="flex-1 bg-white border-2 border-primary-600 text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center"
            >
              <Users size={16} className="mr-2" />
              Inscritos
            </Link>
            <Link
              to={`/tournament/${id}`}
              onClick={handleButtonClick}
              className="flex-1 bg-white border-2 border-dark-300 text-dark-600 hover:bg-dark-50 px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center"
            >
              <Info size={16} className="mr-2" />
              Informações
            </Link>
          </div>
          
          {/* Bottom register button */}
          <button 
            onClick={handleButtonClick}
            className={`${
              canRegister 
                ? 'bg-gradient-to-r from-primary-900 to-primary-700 hover:from-primary-800 hover:to-primary-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5' 
                : 'bg-dark-200 text-dark-500 cursor-not-allowed'
            } px-4 py-3 rounded-lg font-bold transition-all duration-300 w-full flex items-center justify-center`}
            disabled={!canRegister}
          >
            {canRegister && <Zap size={18} className="mr-2" />}
            Inscrever-se
          </button>
        </div>
        
        {/* Progress bar - only show if tournament has participant limit */}
        {hasParticipantLimit && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-dark-500 mb-1">
              <span>Ocupação</span>
              <span>{Math.round((participantsCount / tournamentData.maxParticipants) * 100)}% ocupado</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-accent-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((participantsCount / tournamentData.maxParticipants) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TournamentCard;