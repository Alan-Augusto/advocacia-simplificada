-- Adiciona coluna para rastrear quando o lead solicitou ativamente ser contatado
ALTER TABLE leads 
  ADD COLUMN contact_requested_at TIMESTAMPTZ DEFAULT NULL;

-- Index para query performática na tela de agenda e board
CREATE INDEX IF NOT EXISTS idx_leads_contact_requested 
  ON leads(contact_requested_at) 
  WHERE contact_requested_at IS NOT NULL 
    AND deleted_at IS NULL;

-- Atualiza leads existentes (nenhum terá contact_requested_at por enquanto)
-- Leads novos serão marcados quando o cliente clicar em "Receber contato"
