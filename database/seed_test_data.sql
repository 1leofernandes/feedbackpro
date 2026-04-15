-- ============================================
-- SEED DATA - FeedbackPro Test Environment
-- ============================================
-- Execute este script no Neon Console Query Editor
-- para popular o banco com dados de teste

-- 1. Create a test user (owner)
-- Email: owner@feedbackpro.com
-- Password: 123456
-- Enterprise: restaurante_do_joao
INSERT INTO users (email, name, password_hash, enterprise, created_at, updated_at)
VALUES (
  'owner@feedbackpro.com',
  'João Silva',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36gZvWFm',
  'restaurante_do_joao',
  NOW(),
  NOW()
);

-- 2. Create sample feedback data for Sector: Atendimento (Service)
INSERT INTO feedback (enterprise, sector, satisfaction_level, created_at)
VALUES
  ('restaurante_do_joao', 'atendimento', 5, NOW() - INTERVAL '1 day'),
  ('restaurante_do_joao', 'atendimento', 5, NOW() - INTERVAL '2 days'),
  ('restaurante_do_joao', 'atendimento', 4, NOW() - INTERVAL '3 days'),
  ('restaurante_do_joao', 'atendimento', 5, NOW() - INTERVAL '4 days'),
  ('restaurante_do_joao', 'atendimento', 4, NOW() - INTERVAL '5 days'),
  ('restaurante_do_joao', 'atendimento', 5, NOW()),
  ('restaurante_do_joao', 'atendimento', 3, NOW() - INTERVAL '6 hours');

-- 3. Create sample feedback data for Sector: Qualidade da Comida (Food Quality)
INSERT INTO feedback (enterprise, sector, satisfaction_level, created_at)
VALUES
  ('restaurante_do_joao', 'qualidade_comida', 5, NOW() - INTERVAL '1 day'),
  ('restaurante_do_joao', 'qualidade_comida', 5, NOW() - INTERVAL '2 days'),
  ('restaurante_do_joao', 'qualidade_comida', 5, NOW() - INTERVAL '3 days'),
  ('restaurante_do_joao', 'qualidade_comida', 4, NOW() - INTERVAL '4 days'),
  ('restaurante_do_joao', 'qualidade_comida', 5, NOW()),
  ('restaurante_do_joao', 'qualidade_comida', 4, NOW() - INTERVAL '12 hours');

-- 4. Create sample feedback data for Sector: Limpeza (Cleanliness)
INSERT INTO feedback (enterprise, sector, satisfaction_level, created_at)
VALUES
  ('restaurante_do_joao', 'limpeza', 4, NOW() - INTERVAL '1 day'),
  ('restaurante_do_joao', 'limpeza', 5, NOW() - INTERVAL '2 days'),
  ('restaurante_do_joao', 'limpeza', 5, NOW() - INTERVAL '3 days'),
  ('restaurante_do_joao', 'limpeza', 4, NOW() - INTERVAL '4 days'),
  ('restaurante_do_joao', 'limpeza', 3, NOW() - INTERVAL '5 days'),
  ('restaurante_do_joao', 'limpeza', 4, NOW()),
  ('restaurante_do_joao', 'limpeza', 2, NOW() - INTERVAL '8 hours');

-- 5. Create sample feedback data for Sector: Tempo de Espera (Wait Time)
INSERT INTO feedback (enterprise, sector, satisfaction_level, created_at)
VALUES
  ('restaurante_do_joao', 'tempo_espera', 4, NOW() - INTERVAL '1 day'),
  ('restaurante_do_joao', 'tempo_espera', 4, NOW() - INTERVAL '2 days'),
  ('restaurante_do_joao', 'tempo_espera', 5, NOW() - INTERVAL '3 days'),
  ('restaurante_do_joao', 'tempo_espera', 3, NOW() - INTERVAL '4 days'),
  ('restaurante_do_joao', 'tempo_espera', 4, NOW());

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Verify users were created
SELECT id, email, enterprise, name, created_at FROM users WHERE email = 'owner@feedbackpro.com';

-- Check feedback count by sector with statistics
SELECT 
  sector,
  COUNT(*) as total_feedback,
  ROUND(AVG(satisfaction_level)::numeric, 2) as average_satisfaction,
  COUNT(CASE WHEN satisfaction_level = 5 THEN 1 END) as very_satisfied,
  COUNT(CASE WHEN satisfaction_level = 4 THEN 1 END) as satisfied,
  COUNT(CASE WHEN satisfaction_level = 3 THEN 1 END) as indifferent,
  COUNT(CASE WHEN satisfaction_level = 2 THEN 1 END) as dissatisfied,
  COUNT(CASE WHEN satisfaction_level = 1 THEN 1 END) as very_dissatisfied
FROM feedback
WHERE enterprise = 'restaurante_do_joao'
GROUP BY sector
ORDER BY sector;

-- Check overall statistics
SELECT 
  enterprise,
  COUNT(*) as total_feedback,
  ROUND(AVG(satisfaction_level)::numeric, 2) as overall_average
FROM feedback
WHERE enterprise = 'restaurante_do_joao'
GROUP BY enterprise;
