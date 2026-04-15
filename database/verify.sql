-- ============================================
-- VERIFICAÇÃO DE DADOS - FeedbackPro
-- ============================================
-- Execute este script no Neon Console Query Editor
-- para verificar se os dados foram criados corretamente

-- 1. Verificar se a tabela users existe e tem dados
SELECT 'Users Table' as check_name, COUNT(*) as total_users FROM users;

-- 2. Ver todos os usuários
SELECT id, email, name, enterprise, password_hash FROM users;

-- 3. Verificar usuário específico
SELECT id, email, name, enterprise, password_hash FROM users WHERE email = 'owner@feedbackpro.com';

-- 4. Verificar se tabela feedback existe
SELECT 'Feedback Table' as check_name, COUNT(*) as total_feedback FROM feedback;

-- 5. Ver feedback por empresa
SELECT enterprise, sector, COUNT(*) as total FROM feedback GROUP BY enterprise, sector;

-- 6. Limpar e reciar usuário (se necessário)
-- Descomente para limpar e recriar:
-- DELETE FROM users WHERE email = 'owner@feedbackpro.com';
-- INSERT INTO users (email, name, password_hash, enterprise, created_at, updated_at)
-- VALUES (
--   'owner@feedbackpro.com',
--   'João Silva',
--   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36gZvWFm',
--   'myempresa',
--   NOW(),
--   NOW()
-- );
