# 🔧 Troubleshooting - Login Não Funciona

Se você recebe o erro "Email ou senha inválida" ao fazer login, siga este guia para diagnosticar o problema.

## 🐛 Erro: CredentialsSignin

```
[auth][error] CredentialsSignin: Read more at https://errors.authjs.dev#credentialssignin
```

Este erro significa que o NextAuth não conseguiu autenticar o usuário. Pode ser:
1. ✗ Usuário não existe no banco de dados
2. ✗ Senha está incorreta ou hash inválido
3. ✗ Conexão com banco de dados falhou
4. ✗ DATABASE_URL está incorreta

## ✅ Passo 1: Verificar Conexão com Banco de Dados

Acesse (apenas em desenvolvimento):
```
http://localhost:3000/api/debug
```

Você deve ver um JSON como:
```json
{
  "status": "ok",
  "database": {
    "connected": true,
    "currentTime": "2026-04-15T12:30:45.123Z"
  },
  "users": [
    {
      "id": 1,
      "email": "owner@feedbackpro.com",
      "name": "João Silva",
      "enterprise": "myempresa"
    }
  ],
  "feedbackStatistics": [...]
}
```

### Se receber erro:

**Erro: "ENOENT" ou "Cannot find module 'postgres'"**
```bash
npm install
npm run dev
```

**Erro: "database connection refused"**
- Abra `.env.local` e verifique `DATABASE_URL`
- Deve ser algo como: `postgresql://user:password@ep-xxxxx.neon.tech/...`
- Copie do Neon Console exatamente

**Erro: "read ECONNREFUSED"**
- DATABASE_URL está incorreta
- Ou o servidor Neon está offline (improvável)
- Tente regenerar a connection string no Neon

## ✅ Passo 2: Verificar Usuário no Banco

### No Endpoint /api/debug
Se viu a resposta anterior, verifique se há algum usuário na lista `users`.

### No Neon Console
Execute o script [database/verify.sql](../database/verify.sql):

```sql
SELECT id, email, name, enterprise, password_hash FROM users;
```

Você deve ver:
```
id | email                    | name        | enterprise  | password_hash
-- | ----------------------- | ----------- | ----------- | -----------
1  | owner@feedbackpro.com    | João Silva  | myempresa   | $2a$10$...
```

### Se não vê nenhum usuário:

Copie e execute este SQL no Neon Console:

```sql
INSERT INTO users (email, name, password_hash, enterprise, created_at, updated_at)
VALUES (
  'owner@feedbackpro.com',
  'João Silva',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36gZvWFm',
  'myempresa',
  NOW(),
  NOW()
);
```

Depois verifique novamente:
```sql
SELECT COUNT(*) FROM users WHERE email = 'owner@feedbackpro.com';
```

## ✅ Passo 3: Verificar Hash da Senha

O hash da senha `123456` é:
```
$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36gZvWFm
```

No Neon Console, verifique:
```sql
SELECT password_hash FROM users WHERE email = 'owner@feedbackpro.com';
```

Deve retornar:
```
$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36gZvWFm
```

Se for diferente, execute para atualizar:
```sql
UPDATE users 
SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36gZvWFm'
WHERE email = 'owner@feedbackpro.com';
```

## ✅ Passo 4: Verificar Logs no Console

Quando você tenta fazer login, aparecerá no terminal (onde rodou `npm run dev`):

```
[AUTH] Attempting login with email: owner@feedbackpro.com
[AUTH] Query results count: 1
[AUTH] User found: owner@feedbackpro.com Enterprise: myempresa
[AUTH] Password valid: true
[AUTH] Login successful for: owner@feedbackpro.com
```

Se não vir `[AUTH]` logs, pode ser que:
- NextAuth não está rodando corretamente
- Reinicie: Ctrl+C em `npm run dev`, depois `npm run dev` novamente

Se vir `[AUTH] Query results count: 0`:
- O usuário não existe no banco
- Execute o passo 2 acima

Se vir `[AUTH] Password valid: false`:
- O hash da senha está errado
- Execute o passo 3 acima

## 🔄 Passo 5: Teste Completo

Depois de tudo verificado:

1. **Abra em Incógnito** (sem cookies antigos)
   ```
   Ctrl+Shift+N (Windows/Linux) ou Cmd+Shift+N (Mac)
   ```

2. **Acesse login**
   ```
   http://localhost:3000/login
   ```

3. **Digite as credenciais**
   - Email: `owner@feedbackpro.com`
   - Senha: `123456`

4. **Clique em "Entrar"**

5. **Deve redirecionar para** `/dashboard`

## 🚨 Troubleshooting Avançado

### Ver toda query SQL

Se ainda não funciona, edite `src/auth.ts` e adicione:

```typescript
// Após a query
console.log('[AUTH] Raw query result:', JSON.stringify(results, null, 2));
```

### Testar hash manualmente

Execute no Node.js:
```javascript
node -e "
const bcrypt = require('bcryptjs');
const senha = '123456';
const hash = '\$2a\$10\$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36gZvWFm';
bcrypt.compare(senha, hash).then(result => console.log('Match:', result));
"
```

### Deletar e recriar usuário

No Neon Console:
```sql
DELETE FROM users WHERE email = 'owner@feedbackpro.com';

INSERT INTO users (email, name, password_hash, enterprise, created_at, updated_at)
VALUES (
  'owner@feedbackpro.com',
  'João Silva',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36gZvWFm',
  'myempresa',
  NOW(),
  NOW()
);
```

## 📋 Checklist

- [ ] Endpoint `/api/debug` funciona e mostra "connected": true
- [ ] Usuário aparece na lista do `/api/debug`
- [ ] Email está correto: `owner@feedbackpro.com`
- [ ] Enterprise é: `myempresa`
- [ ] Password hash inicia com `$2a$10$`
- [ ] Console mostra logs `[AUTH]`
- [ ] Logs mostram "Login successful"
- [ ] Login redireciona para `/dashboard`

## 💡 Dica

Se tudo parece estar certo mas ainda não funciona:

```bash
# Limpe o Next.js cache
rm -rf .next

# Reinicie
npm run dev
```

---

Se nada funcionar, **envie uma screenshot de**:
1. `/api/debug` response
2. Logs do terminal quando tenta fazer login
3. Erro do navegador (F12 → Console)
