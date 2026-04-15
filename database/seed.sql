#!/bin/bash

# This file contains example SQL queries to test your FeedbackPro setup
# Run these in your Neon Console to create test data

# 1. Create a test user (owner)
# Password is hashed from "123456" using bcryptjs
INSERT INTO users (email, name, password_hash, enterprise, created_at, updated_at)
VALUES (
  'owner@feedbackpro.com',
  'João Silva',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36gZvWFm',
  'myempresa',
  NOW(),
  NOW()
);

-- 2. Create some sample feedback
INSERT INTO feedback (enterprise, sector, satisfaction_level, created_at)
VALUES
  ('myempresa', 'setor1', 5, NOW() - INTERVAL '1 day'),
  ('myempresa', 'setor1', 4, NOW() - INTERVAL '2 days'),
  ('myempresa', 'setor1', 5, NOW() - INTERVAL '3 days'),
  ('myempresa', 'setor1', 3, NOW() - INTERVAL '4 days'),
  ('myempresa', 'setor1', 4, NOW()),
  ('myempresa', 'setor2', 5, NOW()),
  ('myempresa', 'setor2', 5, NOW() - INTERVAL '1 day'),
  ('myempresa', 'setor2', 4, NOW() - INTERVAL '2 days'),
  ('myempresa', 'setor2', 2, NOW() - INTERVAL '3 days'),
  ('myempresa', 'setor2', 3, NOW() - INTERVAL '4 days');

-- 3. Verify data by querying:
SELECT 
  enterprise, 
  sector,
  COUNT(*) as total,
  ROUND(AVG(satisfaction_level), 2) as avg_satisfaction
FROM feedback
GROUP BY enterprise, sector;

-- 4. Login with:
-- Email: owner@feedbackpro.com
-- Password: 123456
