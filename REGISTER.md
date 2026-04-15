# 📝 Página de Registro - Guia de Uso

A página de registro foi criada para permitir que você crie usuários com senhas hasheadas corretamente no banco de dados.

## 🚀 Acessar Página de Registro

```
http://localhost:3000/register
```

Ou clique em **"Criar Conta"** na página inicial ou login.

## 📋 Campos do Formulário

### 1. **Email** (obrigatório)
- Deve ser um email válido
- Não pode já estar registrado
- Exemplo: `seu_email@gmail.com`

### 2. **Nome** (opcional)
- Seu nome completo
- Se não preenchido, usará a primeira parte do email

### 3. **Empresa (ID)** (obrigatório)
- Identificador único da sua empresa
- Usa apenas: letras minúsculas, números, underscores e hífens
- Não pode ter espaços
- Exemplo: `minha_empresa`, `pizzaria-italia`, `cafe123`
- ⚠️ Este ID será usado nas URLs: `/minha_empresa/setor1`

### 4. **Senha** (obrigatório)
- Mínimo 6 caracteres
- A senha será hasheada com bcrypt (10 rounds)
- Exemplo: `SenhaForte123!`

### 5. **Confirmar Senha** (obrigatório)
- Deve ser igual à senha acima
- Erro se não corresponder

## ✅ Passo a Passo para Registrar

1. **Abra** `http://localhost:3000/register`

2. **Preencha os campos:**
   ```
   Email: owner@example.com
   Nome: João Silva
   Empresa: restaurante_joao
   Senha: MinhaSenh@123
   Confirmar Senha: MinhaSenh@123
   ```

3. **Clique em "Criar Conta"**

4. **Veja a mensagem de sucesso** e será redirecionado para `/login`

5. **Faça login** com o email e senha que acabou de criar

## 🔍 Validações

O formulário valida:
- ✅ Email obrigatório
- ✅ Senha com mínimo 6 caracteres
- ✅ Senhas precisam corresponder
- ✅ Empresa não pode estar vazia
- ✅ Email não pode estar já registrado

## 🪵 Logs do Servidor

Quando cria um usuário, vê os logs:
```
[REGISTER] Creating user: owner@example.com
[REGISTER] Password hash: $2a$10$...
[REGISTER] User created successfully: owner@example.com
```

## 🧪 Testar

### Criar Novo Usuário
1. Acesse `/register`
2. Preencha com informações diferentes:
   ```
   Email: novo_user@teste.com
   Empresa: teste_empresa
   Senha: Teste@123
   ```
3. Envie o formulário

### Fazer Login
1. Acesse `/login`
2. Use as credenciais que acabou de criar
3. Deve entrar no `/dashboard` com sucesso

### Verificar no Banco
No Neon Console execute:
```sql
SELECT email, name, enterprise FROM users WHERE email = 'novo_user@teste.com';
```

## 🐛 Troubleshooting

### "Email já registrado"
- Este email já existe no banco
- Use um email diferente ou delete o usuário antigo:
  ```sql
  DELETE FROM users WHERE email = 'seu_email@example.com';
  ```

### "Senhas não correspondem"
- Os campos de senha precisam ser idênticos
- Verifique maiúsculas/minúsculas

### "Erro ao registrar usuário"
- Verifique os logs do servidor (`npm run dev`)
- DATABASE_URL pode estar incorreta
- Tente ver o endpoint `/api/debug`

### Login ainda não funciona após registrar
- Aguarde 1-2 segundos após criar a conta
- Abra em incógnito (sem cookies antigos)
- Verifique os logs `[AUTH]` durante o login

## 📱 Criar Vários Usuários

Você pode criar múltiplos usuários para testar:

```
User 1:
- Email: owner1@test.com
- Empresa: pizzaria_italia
- Senha: Senha123

User 2:
- Email: owner2@test.com
- Empresa: restaurante_brasil
- Senha: Outra@456
```

Cada um terá seu próprio dashboard com feedback de sua empresa.

## 🎯 Fluxo Completo

```
1. /register → Registrar novo usuário
   ↓
2. Hash bcrypt é gerado corretamente
   ↓
3. Usuário salvo no banco com hash válido
   ↓
4. /login → Fazer login
   ↓
5. bcrypt.compare reconhece a senha
   ↓
6. /dashboard → Acesso autorizado ✅
```

## 💡 Dicas

- Use senhas fortes: misture maiúsculas, minúsculas, números
- Enterprise ID deve ser único para cada empresa
- Você pode ter múltiplas contas com diferentes enterprises
- Cada empresa terá seus próprios dados de feedback

---

**Agora você tem um método seguro e confiável para criar usuários!** 🎉
