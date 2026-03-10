import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface MC {
  id: string;
  nome: string;
  cidade: string;
  foto: string;
  instagram?: string;
  vitorias: number;
  derrotas: number;
  titulos?: string;
  pontos: number;
  created_at: string;
}

export interface Torneio {
  id: string;
  nome: string;
  data: string;
  local: string;
  premio?: string;
  created_at: string;
}

export interface Batalha {
  id: string;
  mc1_id: string;
  mc2_id: string;
  vencedor_id?: string;
  data: string;
  torneio_id?: string;
  created_at: string;
  mc1?: MC;
  mc2?: MC;
  vencedor?: MC;
  torneio?: Torneio;
}

export interface Evento {
  id: string;
  nome: string;
  data: string;
  local: string;
  descricao?: string;
  created_at: string;
}

export interface Video {
  id: string;
  titulo: string;
  youtube_id: string;
  thumbnail?: string;
  created_at: string;
}
