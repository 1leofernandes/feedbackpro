-- Users table (for owners/managers)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password_hash VARCHAR(255),
  enterprise VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Feedback table (anonymous customer feedback)
CREATE TABLE IF NOT EXISTS feedback (
  id SERIAL PRIMARY KEY,
  enterprise VARCHAR(255) NOT NULL,
  sector VARCHAR(255) NOT NULL,
  satisfaction_level INTEGER NOT NULL CHECK (satisfaction_level >= 1 AND satisfaction_level <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_feedback_enterprise ON feedback(enterprise);
CREATE INDEX IF NOT EXISTS idx_feedback_sector ON feedback(enterprise, sector);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at);
CREATE INDEX IF NOT EXISTS idx_users_enterprise ON users(enterprise);
