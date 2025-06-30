import React from 'react';
import { TournamentStatus } from '../types';

interface StatusBadgeProps {
  status: TournamentStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: TournamentStatus) => {
    switch (status) {
      case 'open':
        return {
          text: 'Inscrições Abertas',
          bgColor: 'bg-accent-100',
          textColor: 'text-accent-800',
          borderColor: 'border-accent-200'
        };
      case 'closed':
        return {
          text: 'Inscrições Encerradas',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200'
        };
      case 'in-progress':
        return {
          text: 'Em Andamento',
          bgColor: 'bg-primary-100',
          textColor: 'text-primary-800',
          borderColor: 'border-primary-200'
        };
      case 'completed':
        return {
          text: 'Concluído',
          bgColor: 'bg-dark-100',
          textColor: 'text-dark-800',
          borderColor: 'border-dark-200'
        };
      default:
        return {
          text: 'Status Desconhecido',
          bgColor: 'bg-dark-100',
          textColor: 'text-dark-800',
          borderColor: 'border-dark-200'
        };
    }
  };

  const { text, bgColor, textColor, borderColor } = getStatusConfig(status);

  return (
    <span 
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${bgColor} ${textColor} border ${borderColor}`}
    >
      {text}
    </span>
  );
};

export default StatusBadge;