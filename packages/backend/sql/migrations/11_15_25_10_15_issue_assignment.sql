-- Add assigned_to_user_id column to issue table
-- user_id represents the creator, assigned_to_user_id represents who it's assigned to
ALTER TABLE issue
ADD COLUMN IF NOT EXISTS assigned_to_user_id TEXT;

-- Create index for assigned_to_user_id for query performance
CREATE INDEX IF NOT EXISTS idx_issue_assigned_to_user_id ON issue(assigned_to_user_id);

