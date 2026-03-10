/*
  # Create Batalha de Rap Schema

  ## Overview
  Complete database schema for a rap battle management system with public pages and admin panel.

  ## New Tables

  ### `mcs`
  Stores information about rap battle participants (MCs):
  - `id` (uuid, primary key) - Unique identifier
  - `nome` (text) - MC's name
  - `cidade` (text) - MC's city
  - `foto` (text) - Photo URL
  - `instagram` (text, nullable) - Instagram handle
  - `vitorias` (integer, default 0) - Number of victories
  - `derrotas` (integer, default 0) - Number of defeats
  - `titulos` (text, nullable) - Titles won
  - `pontos` (integer, default 0) - Ranking points
  - `created_at` (timestamptz) - Creation timestamp

  ### `torneios`
  Stores tournament information:
  - `id` (uuid, primary key) - Unique identifier
  - `nome` (text) - Tournament name
  - `data` (date) - Tournament date
  - `local` (text) - Location
  - `premio` (text, nullable) - Prize description
  - `created_at` (timestamptz) - Creation timestamp

  ### `batalhas`
  Stores battle records:
  - `id` (uuid, primary key) - Unique identifier
  - `mc1_id` (uuid, foreign key) - First MC reference
  - `mc2_id` (uuid, foreign key) - Second MC reference
  - `vencedor_id` (uuid, foreign key, nullable) - Winner MC reference
  - `data` (date) - Battle date
  - `torneio_id` (uuid, foreign key, nullable) - Tournament reference
  - `created_at` (timestamptz) - Creation timestamp

  ### `eventos`
  Stores upcoming events and schedule:
  - `id` (uuid, primary key) - Unique identifier
  - `nome` (text) - Event name
  - `data` (date) - Event date
  - `local` (text) - Location
  - `descricao` (text, nullable) - Event description
  - `created_at` (timestamptz) - Creation timestamp

  ### `videos`
  Stores YouTube video gallery:
  - `id` (uuid, primary key) - Unique identifier
  - `titulo` (text) - Video title
  - `youtube_id` (text) - YouTube video ID
  - `thumbnail` (text, nullable) - Thumbnail URL
  - `created_at` (timestamptz) - Creation timestamp

  ## Security
  - Enable RLS on all tables
  - Public read access for all data (public site)
  - Admin write access only for authenticated users
*/

-- Create mcs table
CREATE TABLE IF NOT EXISTS mcs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  cidade text NOT NULL,
  foto text NOT NULL,
  instagram text,
  vitorias integer DEFAULT 0,
  derrotas integer DEFAULT 0,
  titulos text,
  pontos integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create torneios table
CREATE TABLE IF NOT EXISTS torneios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  data date NOT NULL,
  local text NOT NULL,
  premio text,
  created_at timestamptz DEFAULT now()
);

-- Create batalhas table
CREATE TABLE IF NOT EXISTS batalhas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mc1_id uuid REFERENCES mcs(id) ON DELETE CASCADE,
  mc2_id uuid REFERENCES mcs(id) ON DELETE CASCADE,
  vencedor_id uuid REFERENCES mcs(id) ON DELETE SET NULL,
  data date NOT NULL,
  torneio_id uuid REFERENCES torneios(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create eventos table
CREATE TABLE IF NOT EXISTS eventos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  data date NOT NULL,
  local text NOT NULL,
  descricao text,
  created_at timestamptz DEFAULT now()
);

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  youtube_id text NOT NULL,
  thumbnail text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE mcs ENABLE ROW LEVEL SECURITY;
ALTER TABLE torneios ENABLE ROW LEVEL SECURITY;
ALTER TABLE batalhas ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Public read policies (for public site)
CREATE POLICY "Public can view mcs"
  ON mcs FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can view torneios"
  ON torneios FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can view batalhas"
  ON batalhas FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can view eventos"
  ON eventos FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can view videos"
  ON videos FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin write policies (authenticated users only)
CREATE POLICY "Authenticated users can insert mcs"
  ON mcs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update mcs"
  ON mcs FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete mcs"
  ON mcs FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert torneios"
  ON torneios FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update torneios"
  ON torneios FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete torneios"
  ON torneios FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert batalhas"
  ON batalhas FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update batalhas"
  ON batalhas FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete batalhas"
  ON batalhas FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert eventos"
  ON eventos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update eventos"
  ON eventos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete eventos"
  ON eventos FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert videos"
  ON videos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update videos"
  ON videos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete videos"
  ON videos FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mcs_pontos ON mcs(pontos DESC);
CREATE INDEX IF NOT EXISTS idx_batalhas_data ON batalhas(data DESC);
CREATE INDEX IF NOT EXISTS idx_torneios_data ON torneios(data DESC);
CREATE INDEX IF NOT EXISTS idx_eventos_data ON eventos(data DESC);