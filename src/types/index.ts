export type TournamentStatus = 'open' | 'closed' | 'in-progress' | 'completed';

export interface Tournament {
  id: string;
  name: string;
  club: string;
  location: {
    city: string;
    state: string;
  };
  date: string;
  status: TournamentStatus;
  participantsCount: number;
}

export interface LocationFilter {
  state: string;
  city: string;
  status: TournamentStatus | '';
  search: string;
}