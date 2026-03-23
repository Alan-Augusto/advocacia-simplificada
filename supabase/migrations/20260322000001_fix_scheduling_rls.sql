-- Fix RLS policies for availability_slots and appointments
-- The initial migration only created SELECT policies, missing write operations

-- ─── availability_slots ───────────────────────────────────────────────────────
CREATE POLICY "Public availability_slots insert" ON availability_slots
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public availability_slots update" ON availability_slots
  FOR UPDATE USING (true);

CREATE POLICY "Public availability_slots delete" ON availability_slots
  FOR DELETE USING (true);

-- ─── appointments ─────────────────────────────────────────────────────────────
CREATE POLICY "Public appointments update" ON appointments
  FOR UPDATE USING (true);

CREATE POLICY "Public appointments delete" ON appointments
  FOR DELETE USING (true);
