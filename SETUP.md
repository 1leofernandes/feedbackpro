# FeedbackPro - Guia de Setup e Uso

## Overview

O FeedbackPro é uma plataforma de avaliação de satisfação de clientes em modo quiosque. A arquitetura consiste em:

- **Página de Kiosk**: Interface simples e atrativa para clientes avaliarem a satisfação
- **Painel do Dono**: Dashboard para visualizar dados de satisfação por estabelecimento
- **Banco de Dados**: PostgreSQL (Neon) para armazenamento anônimo de avaliações

## Pré-requisitos

- Node.js 18+
- Conta no Neon (para PostgreSQL hospedado)
- Vercel (para deploy)

## Setup Inicial

### 1. Configurar o Banco de Dados no Neon

1. Acesse [console.neon.tech](https://console.neon.tech)
2. Crie um novo projeto chamado "feedbackpro"
3. Copie a connection string (algo como: `postgresql://user:password@ep-xxxxx.neon.tech/feedbackpro?sslmode=require`)
4. Execute o script SQL em [database/schema.sql](./database/schema.sql) no Neon

### 2. Configurar as Variáveis de Ambiente

Edite o arquivo `.env.local`:

```bash
# URL de conexão do PostgreSQL (Neon)
DATABASE_URL=postgresql://user:password@ep-xxxxx.neon.tech/feedbackpro?sslmode=require

# Auth.js Configuration
AUTH_SECRET=gere-com: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=${AUTH_SECRET}

# Google OAuth (opcional)
GOOGLE_ID=seu-google-client-id
GOOGLE_SECRET=seu-google-client-secret
```

Para gerar o `AUTH_SECRET` no Windows PowerShell:
```powershell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

#### Configurar Google OAuth (Opcional)

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto: "FeedbackPro"
3. Ative a API "Google+ API"
4. Vá para "Credenciais" e crie uma credencial "OAuth 2.0 Client ID"
5. Tipo: "Aplicação Web"
6. URIs autorizados:
   - `http://localhost:3000`
   - `http://localhost:3000/api/auth/callback/google`
   - Sua URL de produção (ex: `https://feedbackpro.vercel.app`)
7. Copie o Client ID e Client Secret para `.env.local`


### 3. Criar o Primeiro Usuário (Dono)

Execute esta query no Neon para criar um usuário teste:

```sql
INSERT INTO users (email, name, password_hash, enterprise, created_at, updated_at)
VALUES (
  'owner@example.com',
  'João Silva',
  '$2a$10$...', -- Use bcrypt hash da senha (veja instruções abaixo)
  'myempresa',
  NOW(),
  NOW()
);
```

Para gerar o hash bcrypt da senha `123456`:
```bash
# Use um gerador online ou rode no Node.js:
# node -e "console.log(require('bcryptjs').hashSync('123456', 10))"
```

#### Usuários Google OAuth

Quando um dono acessa por primeira vez com Google, um usuário é criado automaticamente com:
- `enterprise = 'pending'` (precisa ser atualizado manualmente)
- `password_hash = '!oauth_google'` (indica login via Google)

Você pode atualizar o `enterprise` do usuário com:
```sql
UPDATE users 
SET enterprise = 'myempresa' 
WHERE email = 'seu-email@gmail.com' AND enterprise = 'pending';
```

### 4. Começar o Desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:3000`

## Estrutura do Projeto

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/ - Rotas de autenticação
│   │   ├── feedback/ - API para salvar feedback
│   │   └── establishments/ - APIs para dados do dashboard
│   ├── [enterprise]/[sector]/ - Página do kiosk (dinâmica)
│   ├── dashboard/ - Painel do dono
│   ├── dashboard/establishment/[establishment]/ - Detalhes por setor
│   ├── login/ - Página de login
│   └── page.tsx - Home/Instruções
├── components/
│   └── FeedbackForm.tsx - Componente do formulário de feedback
├── lib/
│   └── db.ts - Conexão com PostgreSQL
└── auth.ts - Configuração NextAuth
```

## Como Usar

### Para Clientes (Kiosk)

1. Acesse: `http://localhost:3000/myempresa/setor1`
2. Selecione seu nível de satisfação (1-5 emojis)
3. Clique em "Enviar Avaliação"
4. A avaliação é salva anonimamente no banco

### Para o Dono (Dashboard)

1. Acesse: `http://localhost:3000/login`
2. Faça login com suas credenciais
3. Veja a satisfação geral de todos os estabelecimentos
4. Clique em um estabelecimento para ver detalhes

## URLs Importantes

- **Home**: `http://localhost:3000`
- **Kiosk Empresa 1, Setor A**: `http://localhost:3000/empresa1/setora`
- **Kiosk Empresa 1, Setor B**: `http://localhost:3000/empresa1/setorb`
- **Kiosk Empresa 2, Setor A**: `http://localhost:3000/empresa2/setora`
- **Login**: `http://localhost:3000/login`
- **Dashboard**: `http://localhost:3000/dashboard` (protegido)

## Estrutura de Dados

### Tabela `feedback`
```sql
- id (SERIAL PRIMARY KEY)
- enterprise (VARCHAR) - Identificador da empresa
- sector (VARCHAR) - Identificador do setor
- satisfaction_level (INTEGER) - 1-5
- created_at (TIMESTAMP)
```

### Tabela `users`
```sql
- id (SERIAL PRIMARY KEY)
- email (VARCHAR UNIQUE)
- name (VARCHAR)
- password_hash (VARCHAR)
- enterprise (VARCHAR) - Empresa vinculada
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## Funcionalidades Principais

### Kiosk
- ✅ Interface moderna e atrativa
- ✅ 5 níveis de satisfação com emojis
- ✅ Animações suaves (Framer Motion)
- ✅ Feedback anônimo
- ✅ Responsiva (mobile-first)
- ✅ Confirmação visual após envio

### Dashboard
- ✅ Autenticação segura (NextAuth)
- ✅ Suporte a múltiplos métodos de login:
  - Credenciais (email/senha)
  - Google OAuth
- ✅ Visualização por estabelecimento
- ✅ Satisfação geral e por setor
- ✅ Distribuição de avaliações (gráficos de barras)
- ✅ Histórico de feedback (últimos 7 dias)
- ✅ Dados agregados em tempo real

## Deploy na Vercel

1. Push para GitHub
2. Conecte o repositório na Vercel
3. Adicione as variáveis de ambiente (DATABASE_URL, AUTH_SECRET, etc)
4. Deploy automático!

Após deploy, atualize `NEXTAUTH_URL` para sua URL da Vercel.

## Próximas Melhorias

- [ ] Exportar dados em CSV/Excel
- [ ] Relatórios por período
- [ ] Gráficos mais avançados
- [ ] Notificações por email
- [ ] Múltiplos usuários por empresa
- [ ] API para integração externa
- [ ] Autenticação com OAuth (Google, etc)
- [ ] Dark mode

## Troubleshooting

### Erro: "Cannot find module 'postgres'"
- Execute: `npm install`

### Erro: "Database connection failed"
- Verifique DATABASE_URL no .env.local
- Certifique-se de que o schema foi criado no Neon
- Tente: `npm run build` para validar TypeScript

### Login não funciona
- Certifique-se de que existe usuário na tabela `users`
- Verifique se o password_hash está correto (bcrypt)
- Limpe os cookies do navegador

### Feedback não é salvo
- Verifique se o endpoint `/api/feedback` retorna 201
- Confirme que a rota `[enterprise]/[sector]` está correta
- Veja o console do servidor para erros

## Suporte

Para dúvidas ou issues, verifique:
1. Se as variáveis de ambiente estão corretas
2. Se o banco de dados está acessível
3. Se o schema foi criado corretamente
4. Os logs do servidor (npm run dev)
