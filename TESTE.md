# 🧪 Guia de Testes - FeedbackPro

Este guia mostra como testar a aplicação FeedbackPro com dados reais.

## 📋 Dados de Teste

### Empresa
- **Nome da Empresa:** Restaurante do João
- **Identificador:** `restaurante_do_joao`
- **Setores:** 
  - `atendimento` (Atendimento)
  - `qualidade_comida` (Qualidade da Comida)
  - `limpeza` (Limpeza)
  - `tempo_espera` (Tempo de Espera)

### Usuário (Dono)
- **Email:** `owner@feedbackpro.com`
- **Senha:** `123456`
- **Nome:** João Silva
- **Enterprise:** `restaurante_do_joao`

## 🚀 Passos para Testar

### ⭐ NOVO: Criar Conta pela Página de Registro

A forma **RECOMENDADA** e mais segura é usar a página de registro:

```
1. Abra: http://localhost:3000/register
2. Preencha:
   - Email: owner@testemeu.com
   - Nome: Seu Nome
   - Empresa: empresa_teste
   - Senha: Senha123
   - Confirmar Senha: Senha123
3. Clique em "Criar Conta"
4. Será redirecionado para /login
5. Use as mesmas credenciais para fazer login
```

✅ A senha será hasheada corretamente com bcrypt

### Ou: Executar Schema no Neon

Copie o conteúdo de `database/schema.sql` e execute no **Neon Console** Query Editor.

✅ Cria as tabelas `users` e `feedback`

### Ou: Popular com Dados de Teste

Copie o conteúdo de `database/seed_test_data.sql` e execute no **Neon Console**.

✅ Cria 1 usuário e 27 feedbacks em 4 setores


```bash
npm run dev
```

Acesse: `http://localhost:3000`

## 🎯 URLs para Testar

### Cliente (Kiosk)

**Setor: Atendimento**
```
http://localhost:3000/restaurante_do_joao/atendimento
```

**Setor: Qualidade da Comida**
```
http://localhost:3000/restaurante_do_joao/qualidade_comida
```

**Setor: Limpeza**
```
http://localhost:3000/restaurante_do_joao/limpeza
```

**Setor: Tempo de Espera**
```
http://localhost:3000/restaurante_do_joao/tempo_espera
```

### Gestor (Dashboard)

**Login:**
```
http://localhost:3000/login
```

**Credenciais:**
- Email: `owner@feedbackpro.com`
- Senha: `123456`

**Dashboard:**
```
http://localhost:3000/dashboard
```

## 📊 Fluxo de Teste Completo

### 1. Testar Página Kiosk
```
1. Abra http://localhost:3000/restaurante_do_joao/atendimento
2. Veja a interface de avaliação com 5 emojis
3. Clique em um emoji (por exemplo, 😍)
4. Clique em "Enviar Avaliação"
5. Veja a confirmação ✓
6. A página reseta automaticamente em 3 segundos
```

**Resultado esperado:** Nova avaliação salva no banco de dados

### 3️⃣ Testar Login

**Usando conta criada no registro:**
```
1. Abra http://localhost:3000/login
2. Digite:
   - Email: owner@testemeu.com (o que criou no /register)
   - Senha: Senha123 (a que definiu)
3. Clique em "Entrar"
```

**Ou usando dados de teste pré-populados:**
```
Email: owner@feedbackpro.com
Senha: 123456
(Somente se executou seed_test_data.sql)
```

**Resultado esperado:** Redirecionado para `/dashboard`

### 3. Testar Dashboard
```
1. Veja a satisfação geral média (deve ser ~4.0)
2. Veja 4 cards com cada setor:
   - Atendimento (média: ~4.4)
   - Qualidade da Comida (média: ~4.67)
   - Limpeza (média: ~4.0)
   - Tempo de Espera (média: ~4.0)
3. Clique em um setor para ver detalhes
```

**Resultado esperado:** Gráficos com distribuição de avaliações

### 4. Testar Detalhes do Setor
```
1. No dashboard, clique em "Qualidade da Comida"
2. Veja:
   - Média de satisfação: 4.67
   - Total de avaliações: 6
   - Distribuição em barras
```

**Resultado esperado:** Todos os dados carregam corretamente

### 5. Testar Nova Avaliação
```
1. Abra http://localhost:3000/restaurante_do_joao/qualidade_comida
2. Clique em 😠 (Muito Insatisfeito)
3. Envie
4. Volte ao Dashboard
5. Veja a média atualizada e total agora em 7 (era 6)
```

**Resultado esperado:** Dados em tempo real atualizam

## 🔄 Adicionar Mais Dados

### Adicionar Novo Setor

Execute no Neon Console:
```sql
INSERT INTO feedback (enterprise, sector, satisfaction_level, created_at)
VALUES
  ('restaurante_do_joao', 'novo_setor', 5, NOW()),
  ('restaurante_do_joao', 'novo_setor', 4, NOW()),
  ('restaurante_do_joao', 'novo_setor', 5, NOW());
```

### Adicionar Novo Dono

Execute no Neon Console (gerar hash bcrypt para senha):
```sql
INSERT INTO users (email, name, password_hash, enterprise, created_at, updated_at)
VALUES (
  'novo_dono@example.com',
  'Maria Silva',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36gZvWFm',
  'pizzaria_da_maria',
  NOW(),
  NOW()
);

-- Depois adicione feedback para a nova empresa:
INSERT INTO feedback (enterprise, sector, satisfaction_level, created_at)
VALUES
  ('pizzaria_da_maria', 'pizza', 5, NOW()),
  ('pizzaria_da_maria', 'pizza', 5, NOW()),
  ('pizzaria_da_maria', 'pizza', 4, NOW());
```

## 🐛 Troubleshooting

### Erro: "Servidor recusou conexão"
- Certifique-se de que `npm run dev` está rodando
- Verifique `DATABASE_URL` no `.env.local`

### Erro: "Usuário não encontrado"
- Verifique se `seed_test_data.sql` foi executado
- Confirme que o email está correto: `owner@feedbackpro.com`

### Dados não aparecem após nova avaliação
- Refreshe a página F5
- Verifique o console do navegador para erros
- Veja se a rota dinâmica está correta: `/[enterprise]/[sector]/`

### Erro 404 ao acessar dashboard
- Faça logout e login novamente
- Limpe cookies do navegador
- Verifique cookies em DevTools (F12)

## 📝 Notas Importantes

- Todas as avaliações são **anônimas** (sem ID de usuário)
- Dados são salvos por **enterprise** + **sector**
- O dono pode ver todas as avaliações de sua empresa
- Feedback antigo é mantido para histórico

## ✅ Checklist de Testes

- [ ] Schema criado no Neon
- [ ] Dados de teste importados
- [ ] Acesso kiosk funciona (4 setores diferentes)
- [ ] Login com email/senha funciona
- [ ] Dashboard carrega corretamente
- [ ] Detalhes do setor mostram gráficos
- [ ] Nova avaliação salva e reflete imediatamente
- [ ] Múltiplas avaliações geram média correta
- [ ] Logout funciona
- [ ] Página home carrega sem erro

---

**Pronto para testar!** 🚀 Se encontrar algum problema, verifique os logs em `npm run dev`
