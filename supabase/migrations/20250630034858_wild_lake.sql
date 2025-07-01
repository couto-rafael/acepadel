/*
  # Schema inicial do PadelTour

  1. Tabelas principais
    - `profiles` - Perfis de usuários (atletas e clubes)
    - `clubs` - Informações específicas dos clubes
    - `tournaments` - Torneios criados pelos clubes
    - `tournament_categories` - Categorias dos torneios
    - `tournament_registrations` - Inscrições nos torneios
    - `courts` - Quadras dos clubes
    - `matches` - Partidas dos torneios

  2. Segurança
    - RLS habilitado em todas as tabelas
    - Políticas para controle de acesso baseado no usuário autenticado
*/

-- Enum para tipos de usuário
CREATE TYPE user_type AS ENUM ('athlete', 'club');

-- Enum para status dos torneios
CREATE TYPE tournament_status AS ENUM ('scheduled', 'open', 'closed', 'in_progress', 'completed', 'cancelled');

-- Enum para status das partidas
CREATE TYPE match_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');

-- Tabela de perfis (estende auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type user_type NOT NULL,
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Campos para atletas
  first_name text,
  last_name text,
  nickname text,
  birth_date date,
  gender text,
  location text,
  bio text,
  sports text[] DEFAULT '{}',
  rackets text[] DEFAULT '{}',
  instagram text,
  twitter text,
  tiktok text,
  profile_image_url text,
  
  -- Campos para clubes
  club_name text,
  fantasy_name text,
  cnpj text,
  phone text,
  city text,
  state text,
  full_address text,
  description text,
  facilities jsonb DEFAULT '{}',
  
  CONSTRAINT valid_athlete_data CHECK (
    user_type != 'athlete' OR (first_name IS NOT NULL AND last_name IS NOT NULL)
  ),
  CONSTRAINT valid_club_data CHECK (
    user_type != 'club' OR (club_name IS NOT NULL AND cnpj IS NOT NULL)
  )
);

-- Tabela de quadras dos clubes
CREATE TABLE IF NOT EXISTS courts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  is_covered boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT courts_club_check CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = club_id AND user_type = 'club')
  )
);

-- Tabela de torneios
CREATE TABLE IF NOT EXISTS tournaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  registration_fee decimal(10,2) DEFAULT 0,
  max_participants integer DEFAULT 64,
  status tournament_status DEFAULT 'scheduled',
  daily_schedules jsonb DEFAULT '[]',
  profile_image_url text,
  banner_image_url text,
  sponsors jsonb DEFAULT '[]',
  streaming_links jsonb DEFAULT '[]',
  rules text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT tournaments_club_check CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = club_id AND user_type = 'club')
  ),
  CONSTRAINT valid_dates CHECK (end_date >= start_date)
);

-- Tabela de categorias dos torneios
CREATE TABLE IF NOT EXISTS tournament_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  category_name text NOT NULL,
  max_teams integer DEFAULT 16,
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(tournament_id, category_name)
);

-- Tabela de inscrições nos torneios
CREATE TABLE IF NOT EXISTS tournament_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  athlete_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES tournament_categories(id) ON DELETE CASCADE,
  partner_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  registration_date timestamptz DEFAULT now(),
  payment_status text DEFAULT 'pending',
  
  CONSTRAINT registrations_athlete_check CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = athlete_id AND user_type = 'athlete')
  ),
  CONSTRAINT registrations_partner_check CHECK (
    partner_id IS NULL OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = partner_id AND user_type = 'athlete')
  ),
  CONSTRAINT no_self_partner CHECK (athlete_id != partner_id),
  UNIQUE(tournament_id, athlete_id, category_id)
);

-- Tabela de partidas
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES tournament_categories(id) ON DELETE CASCADE,
  court_id uuid REFERENCES courts(id),
  round_name text NOT NULL,
  match_number integer NOT NULL,
  
  -- Time 1
  team1_player1_id uuid REFERENCES profiles(id),
  team1_player2_id uuid REFERENCES profiles(id),
  
  -- Time 2
  team2_player1_id uuid REFERENCES profiles(id),
  team2_player2_id uuid REFERENCES profiles(id),
  
  -- Resultado
  team1_score jsonb DEFAULT '[]', -- Array de sets: [6, 6, 7]
  team2_score jsonb DEFAULT '[]', -- Array de sets: [4, 7, 5]
  winner_team integer, -- 1 ou 2
  
  scheduled_time timestamptz,
  start_time timestamptz,
  end_time timestamptz,
  status match_status DEFAULT 'scheduled',
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_winner CHECK (winner_team IN (1, 2) OR winner_team IS NULL),
  CONSTRAINT valid_times CHECK (
    start_time IS NULL OR end_time IS NULL OR end_time >= start_time
  )
);

-- Tabela de patrocinadores
CREATE TABLE IF NOT EXISTS sponsors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  logo_url text,
  website text,
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Usuários podem ver perfis públicos"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários podem atualizar próprio perfil"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir próprio perfil"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Políticas para courts
CREATE POLICY "Qualquer um pode ver quadras"
  ON courts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Clubes podem gerenciar suas quadras"
  ON courts
  FOR ALL
  TO authenticated
  USING (
    club_id = auth.uid() AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = 'club')
  );

-- Políticas para tournaments
CREATE POLICY "Qualquer um pode ver torneios"
  ON tournaments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Clubes podem gerenciar seus torneios"
  ON tournaments
  FOR ALL
  TO authenticated
  USING (
    club_id = auth.uid() AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = 'club')
  );

-- Políticas para tournament_categories
CREATE POLICY "Qualquer um pode ver categorias"
  ON tournament_categories
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Clubes podem gerenciar categorias de seus torneios"
  ON tournament_categories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tournaments 
      WHERE id = tournament_id AND club_id = auth.uid()
    )
  );

-- Políticas para tournament_registrations
CREATE POLICY "Usuários podem ver inscrições de torneios públicos"
  ON tournament_registrations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Atletas podem se inscrever em torneios"
  ON tournament_registrations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    athlete_id = auth.uid() AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = 'athlete')
  );

CREATE POLICY "Atletas podem atualizar suas inscrições"
  ON tournament_registrations
  FOR UPDATE
  TO authenticated
  USING (athlete_id = auth.uid());

CREATE POLICY "Clubes podem gerenciar inscrições de seus torneios"
  ON tournament_registrations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tournaments 
      WHERE id = tournament_id AND club_id = auth.uid()
    )
  );

-- Políticas para matches
CREATE POLICY "Qualquer um pode ver partidas"
  ON matches
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Clubes podem gerenciar partidas de seus torneios"
  ON matches
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tournaments 
      WHERE id = tournament_id AND club_id = auth.uid()
    )
  );

-- Políticas para sponsors
CREATE POLICY "Qualquer um pode ver patrocinadores"
  ON sponsors
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários podem gerenciar seus patrocinadores"
  ON sponsors
  FOR ALL
  TO authenticated
  USING (profile_id = auth.uid());

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tournaments_updated_at 
  BEFORE UPDATE ON tournaments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matches_updated_at 
  BEFORE UPDATE ON matches 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para criar perfil automaticamente após signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, user_type)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'user_type', 'athlete')::user_type
  );
  RETURN new;
END;
$$ language plpgsql security definer;

-- Trigger para criar perfil automaticamente
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();