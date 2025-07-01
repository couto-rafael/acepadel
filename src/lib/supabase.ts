import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Profile {
  id: string;
  user_type: 'athlete' | 'club';
  email: string;
  created_at: string;
  updated_at: string;
  
  // Athlete fields
  first_name?: string;
  last_name?: string;
  nickname?: string;
  birth_date?: string;
  gender?: string;
  location?: string;
  bio?: string;
  sports?: string[];
  rackets?: string[];
  instagram?: string;
  twitter?: string;
  tiktok?: string;
  profile_image_url?: string;
  
  // Club fields
  club_name?: string;
  fantasy_name?: string;
  cnpj?: string;
  phone?: string;
  city?: string;
  state?: string;
  full_address?: string;
  description?: string;
  facilities?: Record<string, boolean>;
}

export interface Tournament {
  id: string;
  club_id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  registration_fee: number;
  max_participants: number;
  status: 'scheduled' | 'open' | 'closed' | 'in_progress' | 'completed' | 'cancelled';
  daily_schedules: any[];
  profile_image_url?: string;
  banner_image_url?: string;
  sponsors: any[];
  streaming_links: any[];
  rules?: string;
  created_at: string;
  updated_at: string;
}

export interface Court {
  id: string;
  club_id: string;
  name: string;
  is_covered: boolean;
  created_at: string;
}

// Auth functions
export const signUp = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  });
  
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Profile functions
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  return { data, error };
};

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();
    
  return { data, error };
};

// Tournament functions
export const getTournaments = async () => {
  const { data, error } = await supabase
    .from('tournaments')
    .select(`
      *,
      profiles!tournaments_club_id_fkey(fantasy_name, club_name),
      tournament_categories(*)
    `)
    .order('start_date', { ascending: true });
    
  return { data, error };
};

export const getClubTournaments = async (clubId: string) => {
  const { data, error } = await supabase
    .from('tournaments')
    .select(`
      *,
      tournament_categories(*),
      tournament_registrations(count)
    `)
    .eq('club_id', clubId)
    .order('created_at', { ascending: false });
    
  return { data, error };
};

export const createTournament = async (tournamentData: any) => {
  const { data, error } = await supabase
    .from('tournaments')
    .insert(tournamentData)
    .select()
    .single();
    
  return { data, error };
};

// Court functions
export const getClubCourts = async (clubId: string) => {
  const { data, error } = await supabase
    .from('courts')
    .select('*')
    .eq('club_id', clubId)
    .order('name');
    
  return { data, error };
};

export const createCourt = async (courtData: any) => {
  const { data, error } = await supabase
    .from('courts')
    .insert(courtData)
    .select()
    .single();
    
  return { data, error };
};

export const updateCourt = async (courtId: string, updates: any) => {
  const { data, error } = await supabase
    .from('courts')
    .update(updates)
    .eq('id', courtId)
    .select()
    .single();
    
  return { data, error };
};

export const deleteCourt = async (courtId: string) => {
  const { error } = await supabase
    .from('courts')
    .delete()
    .eq('id', courtId);
    
  return { error };
};