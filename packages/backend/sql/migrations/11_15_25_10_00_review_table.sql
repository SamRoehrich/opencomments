-- Create review table
CREATE TABLE IF NOT EXISTS review (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id TEXT NOT NULL,
    env_id TEXT
);

-- Add review_id foreign key to issue table
ALTER TABLE issue
ADD COLUMN IF NOT EXISTS review_id INTEGER REFERENCES review(id) ON DELETE SET NULL;

-- Create index for review_id
CREATE INDEX IF NOT EXISTS idx_issue_review_id ON issue(review_id);

