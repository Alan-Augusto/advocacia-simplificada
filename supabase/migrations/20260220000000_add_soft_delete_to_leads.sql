-- Add deleted_at column to leads for soft delete
ALTER TABLE leads ADD COLUMN deleted_at TIMESTAMPTZ DEFAULT NULL;

-- Create index for faster querying non-deleted leads
CREATE INDEX idx_leads_deleted_at ON leads(deleted_at) WHERE deleted_at IS NULL;
