-- Add tournament bracket support with automatic progression metadata

CREATE TABLE IF NOT EXISTS torneio_participantes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  torneio_id uuid NOT NULL REFERENCES torneios(id) ON DELETE CASCADE,
  mc_id uuid NOT NULL REFERENCES mcs(id) ON DELETE CASCADE,
  seed integer,
  created_at timestamptz DEFAULT now(),
  UNIQUE (torneio_id, mc_id)
);

ALTER TABLE torneios
  ADD COLUMN IF NOT EXISTS campeao_id uuid REFERENCES mcs(id) ON DELETE SET NULL;

ALTER TABLE batalhas
  ADD COLUMN IF NOT EXISTS fase text,
  ADD COLUMN IF NOT EXISTS ordem_na_fase integer,
  ADD COLUMN IF NOT EXISTS placar_mc1 integer,
  ADD COLUMN IF NOT EXISTS placar_mc2 integer,
  ADD COLUMN IF NOT EXISTS proxima_batalha_id uuid REFERENCES batalhas(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS proxima_slot smallint;

CREATE INDEX IF NOT EXISTS idx_torneio_participantes_torneio_id ON torneio_participantes(torneio_id);
CREATE INDEX IF NOT EXISTS idx_batalhas_torneio_fase_ordem ON batalhas(torneio_id, fase, ordem_na_fase);
