-- Add 'agendado' to lead_status enum
ALTER TYPE lead_status ADD VALUE IF NOT EXISTS 'agendado' AFTER 'quente';

-- ─── availability_slots ───────────────────────────────────────────────────────
-- Horários disponíveis definidos pelo administrador
CREATE TABLE IF NOT EXISTS availability_slots (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  date             DATE        NOT NULL,
  start_time       TIME        NOT NULL,
  duration_minutes INTEGER     NOT NULL DEFAULT 30,
  is_booked        BOOLEAN     NOT NULL DEFAULT false,
  is_cancelled     BOOLEAN     NOT NULL DEFAULT false,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (date, start_time)
);

CREATE INDEX IF NOT EXISTS idx_availability_slots_date
  ON availability_slots (date);

CREATE INDEX IF NOT EXISTS idx_availability_slots_available
  ON availability_slots (date, start_time)
  WHERE is_booked = false AND is_cancelled = false;

-- ─── appointments ─────────────────────────────────────────────────────────────
-- Agendamentos confirmados, vinculando um slot a um lead
CREATE TABLE IF NOT EXISTS appointments (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id      UUID        NOT NULL REFERENCES availability_slots (id) ON DELETE RESTRICT,
  lead_id      UUID        REFERENCES leads (id) ON DELETE SET NULL,
  -- Campos desnormalizados para resiliência (soft-delete de leads)
  lead_name    TEXT        NOT NULL,
  lead_phone   TEXT        NOT NULL,
  lead_service TEXT        NOT NULL,
  lead_code    TEXT        NOT NULL,
  status       TEXT        NOT NULL DEFAULT 'scheduled'
                           CHECK (status IN ('scheduled', 'cancelled', 'completed', 'no_show')),
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_slot_id   ON appointments (slot_id);
CREATE INDEX IF NOT EXISTS idx_appointments_lead_id   ON appointments (lead_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status    ON appointments (status);

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ─── RLS ──────────────────────────────────────────────────────────────────────
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments       ENABLE ROW LEVEL SECURITY;

-- Público pode ler slots não cancelados (para exibir no calendário de agendamento)
CREATE POLICY "Public can read available slots"
  ON availability_slots FOR SELECT
  USING (is_cancelled = false);

-- Público pode criar agendamentos
CREATE POLICY "Public can book appointment"
  ON appointments FOR INSERT
  WITH CHECK (true);

-- Público pode ler agendamentos (para confirmar o próprio agendamento)
CREATE POLICY "Public can read appointments"
  ON appointments FOR SELECT
  USING (true);
