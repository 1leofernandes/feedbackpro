# 🎯 FeedbackPro - Plataforma de Avaliação de Satisfação

Uma plataforma moderna de avaliação de satisfação de clientes em modo quiosque, com dashboard para gestores. Desenvolvida com Next.js, PostgreSQL e NextAuth.

## ✨ Principais Características

### Página de Kiosk (Cliente)
- 🎨 Interface moderna, limpa e atrativa
- 😊 5 níveis de satisfação com emojis intuitivos
  - 😠 Muito Insatisfeito
  - 😟 Insatisfeito
  - 😐 Indiferente
  - 😊 Satisfeito
  - 😍 **Muito Satisfeito**
- ✨ Animações suaves com Framer Motion
- 📱 Responsiva (mobile-first design)
- 🔒 Salva dados de forma anônima
- 🎯 UX otimizada para quiosque

### Painel do Gestor (Dashboard)
- 🔐 Autenticação segura com NextAuth
  - 📧 Login com Email/Senha
  - 🔵 Login com Google OAuth
- 📊 Visualização de satisfação por estabelecimento
- 📈 Gráficos de distribuição de avaliações
- 🏢 Suporte a múltiplos estabelecimentos
- 📅 Histórico de feedback (últimos 7 dias)
- 🔄 Dados em tempo real

## 🚀 Quick Start

### 1. Pré-requisitos
```bash
Node.js 18+
npm ou yarn
Conta Neon (PostgreSQL hospedado)
```

### 2. Clonar e Instalar
```bash
git clone <seu-repo>
cd feedback
npm install
```

### 3. Configurar Banco de Dados

**Criar projeto no Neon:**
1. Acesse [console.neon.tech](https://console.neon.tech)
2. Crie um novo projeto "feedbackpro"
3. Copie a connection string

**Executar schema:**
```bash
# Copie o conteúdo de database/schema.sql
# Execute no Neon Console Query Editor
```

### 4. Configurar Variáveis de Ambiente

Crie `.env.local`:
```bash
# Database
DATABASE_URL=postgresql://user:password@ep-xxxxx.neon.tech/feedbackpro?sslmode=require

# Auth (gere com: openssl rand -base64 32)
AUTH_SECRET=seu-secret-aleatorio
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=${AUTH_SECRET}

# Google OAuth (opcional)
GOOGLE_ID=seu-google-client-id
GOOGLE_SECRET=seu-google-client-secret
```

**Para configurar Google OAuth:**
1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie novo projeto "FeedbackPro"
3. Ative "Google+ API"
4. Crie credencial OAuth 2.0 - Application Web
5. URLs autorizadas:
   - `http://localhost:3000`
   - `http://localhost:3000/api/auth/callback/google`
   - Sua URL de produção

### 5. Criar Primeiro Usuário

Execute no Neon Console:
```sql
INSERT INTO users (email, name, password_hash, enterprise, created_at, updated_at)
VALUES (
  'owner@example.com',
  'Seu Nome',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36gZvWFm',
  'myempresa',
  NOW(),
  NOW()
);
```

**Senha padrão:** `123456`

### 6. Iniciar Desenvolvimento
```bash
npm run dev
```

Acesse: `http://localhost:3000`

## 📖 Uso

### Cliente (Kiosk de Feedback)
```
http://localhost:3000/[enterprise]/[sector]
```

**Exemplo:**
```
http://localhost:3000/myempresa/setor1
http://localhost:3000/myempresa/setor2
```

### Gestor (Dashboard)
```
http://localhost:3000/login
```

**Credenciais de teste:**
- Email: `owner@example.com`
- Senha: `123456`

## 🏗️ Arquitetura

### Estrutura de Pastas
```
feedback/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/     # NextAuth endpoints
│   │   │   ├── feedback/               # POST feedback
│   │   │   └── establishments/         # GET dados dashboard
│   │   ├── [enterprise]/[sector]/      # Kiosk dinâmico
│   │   ├── dashboard/                  # Dashboard protegido
│   │   ├── login/                      # Login page
│   │   └── page.tsx                    # Home
│   ├── components/
│   │   └── FeedbackForm.tsx            # Componente kiosk
│   ├── lib/
│   │   └── db.ts                       # PostgreSQL client
│   ├── auth.ts                         # NextAuth config
│   └── auth.types.ts                   # Types
├── database/
│   ├── schema.sql                      # Tabelas SQL
│   └── seed.sql                        # Dados de teste
├── SETUP.md                            # Guia detalhado
└── package.json
```

## 📊 API Endpoints

### POST `/api/feedback`
Salva feedback anônimo
```json
{
  "enterprise": "myempresa",
  "sector": "setor1",
  "satisfaction_level": 5
}
```

### GET `/api/establishments/[enterprise]`
Retorna todos os setores com estatísticas
- Requer autenticação
- Valida se usuário pertence à empresa

### GET `/api/establishments/[enterprise]/[establishment]`
Retorna detalhes de um setor específico
- Requer autenticação
- Inclui histórico últimos 7 dias

## 🔒 Segurança

- ✅ Senhas com bcrypt (10 rounds)
- ✅ Sessões seguras com NextAuth
- ✅ CSRF protection integrado
- ✅ Feedback completamente anônimo
- ✅ SQL com prepared statements
- ✅ Validação de entrada

## 📦 Deploy na Vercel

1. Push para GitHub
2. Conecte em [vercel.com](https://vercel.com)
3. Adicione environment variables (DATABASE_URL, AUTH_SECRET, etc)
4. Deploy automático!

## 🐛 Troubleshooting

| Problema | Solução |
|----------|---------|
| "Cannot find module 'postgres'" | `npm install` |
| Database connection failed | Verifique DATABASE_URL |
| Login inválido | Verifique email/senha |
| Feedback não salva | Verifique URL da rota |

Para mais detalhes, veja [SETUP.md](./SETUP.md)

---

**Feito com ❤️ para melhorar a experiência do cliente!**
