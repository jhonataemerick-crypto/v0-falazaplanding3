# Fluxo de Autenticação

Este documento descreve o fluxo completo de autenticação do FalaZap, incluindo registro, login e confirmação de email.

## Visão Geral

O FalaZap usa **Supabase Auth** para gerenciar autenticação de usuários. O fluxo inclui:
1. Registro de novo usuário (signup)
2. Confirmação de email
3. Login
4. Sessão autenticada

---

## 1. Fluxo de Registro (Signup)

### Página: `/auth/signup`

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    USUÁRIO ACESSA /auth/signup               │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  Usuário preenche:                                           │
│  - Email                                                     │
│  - Senha                                                     │
│  - Nome                                                      │
│                                                              │
│  [Criar Conta] ◄─── Texto: "Você receberá um email..."     │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  CLIENTE: supabase.auth.signUp()                            │
│  - email: user@example.com                                  │
│  - password: ********                                       │
│  - options:                                                 │
│    - emailRedirectTo: /dashboard                            │
│    - data: { name: "Nome do Usuário" }                     │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  SUPABASE AUTH:                                             │
│  1. Cria usuário em auth.users                              │
│  2. Envia email de confirmação                              │
│  3. Retorna user (sem sessão ainda)                         │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  TRIGGER: on_auth_user_created                              │
│  - Executa handle_new_user()                                │
│  - Cria registro em profiles                                │
│  - Copia email e name                                       │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  REDIRECT: /auth/verify-email                               │
│  - Mostra mensagem: "Verifique seu email"                   │
│  - Botão para reenviar email                                │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### Código Relevante

**app/auth/signup/page.tsx:**
\`\`\`typescript
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || 
                     `${window.location.origin}/dashboard`,
    data: { name }
  }
})

if (!error) {
  router.push('/auth/verify-email')
}
\`\`\`

**scripts/002_create_profile_trigger.sql:**
\`\`\`sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
\`\`\`

---

## 2. Fluxo de Confirmação de Email

### Página: `/auth/verify-email`

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│  USUÁRIO RECEBE EMAIL DO SUPABASE                           │
│  - Assunto: "Confirme seu email"                            │
│  - Link: https://app.com/auth/confirm?token=...            │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  USUÁRIO CLICA NO LINK DO EMAIL                             │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  MIDDLEWARE: lib/supabase/middleware.ts                     │
│  1. Detecta token de confirmação na URL                     │
│  2. Chama supabase.auth.exchangeCodeForSession()            │
│  3. Cria sessão autenticada                                 │
│  4. Atualiza auth.users.email_confirmed_at                  │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  REDIRECT: /dashboard                                       │
│  - Usuário agora tem sessão ativa                           │
│  - Pode acessar rotas protegidas                            │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### Código Relevante

**lib/supabase/middleware.ts:**
\`\`\`typescript
export async function updateSession(request: NextRequest) {
  const { supabase, response } = createServerClient(request)
  
  // Troca o código de confirmação por uma sessão
  await supabase.auth.exchangeCodeForSession(code)
  
  return response
}
\`\`\`

---

## 3. Fluxo de Login

### Página: `/auth/login`

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│  USUÁRIO ACESSA /auth/login                                 │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  Usuário preenche:                                           │
│  - Email                                                     │
│  - Senha                                                     │
│                                                              │
│  [Entrar]                                                   │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  CLIENTE: supabase.auth.signInWithPassword()                │
│  - email: user@example.com                                  │
│  - password: ********                                       │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  SUPABASE AUTH VALIDA:                                      │
│  1. Email existe?                                           │
│  2. Senha correta?                                          │
│  3. Email confirmado?                                       │
└────────────────────────────┬────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
        ┌───────────────┐         ┌──────────────┐
        │   SUCESSO     │         │     ERRO     │
        └───────┬───────┘         └──────┬───────┘
                │                        │
                ▼                        ▼
    ┌──────────────────┐     ┌─────────────────────┐
    │ Cria sessão      │     │ Mostra erro:        │
    │ Seta cookies     │     │ - Invalid creds     │
    │ Redirect /assin. │     │ - Email not conf.   │
    └──────────────────┘     │ - Botão reenviar    │
                             └─────────────────────┘
\`\`\`

### Tratamento de Erros

**app/auth/login/page.tsx:**
\`\`\`typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
})

if (error) {
  if (error.message.includes('Email not confirmed')) {
    setError('Por favor, confirme seu email antes de fazer login.')
    setShowResendButton(true)
  } else if (error.message.includes('Invalid login credentials')) {
    setError('Email ou senha incorretos. Verifique suas credenciais.')
  } else {
    setError('Erro ao fazer login. Tente novamente.')
  }
}
\`\`\`

---

## 4. Proteção de Rotas

### Middleware

O middleware protege rotas que requerem autenticação:

\`\`\`typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const { supabase, response } = await updateSession(request)
  
  const { data: { user } } = await supabase.auth.getUser()
  
  // Rotas públicas
  const publicRoutes = ['/', '/auth/login', '/auth/signup', '/auth/verify-email']
  
  // Se não está autenticado e tenta acessar rota protegida
  if (!user && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  
  return response
}
\`\`\`

### Rotas Protegidas

- `/dashboard` - Requer autenticação
- `/assinatura` - Requer autenticação
- `/conta` - Requer autenticação

### Rotas Públicas

- `/` - Landing page
- `/auth/login` - Login
- `/auth/signup` - Registro
- `/auth/verify-email` - Verificação de email

---

## 5. Sessão e Cookies

### Como funciona

1. **Login bem-sucedido:**
   - Supabase cria um access_token e refresh_token
   - Tokens são armazenados em cookies HTTP-only
   - Cookies são enviados automaticamente em todas as requisições

2. **Verificação de sessão:**
   - Middleware verifica tokens em cada requisição
   - Se token expirou, usa refresh_token para renovar
   - Se refresh_token inválido, redireciona para login

3. **Logout:**
   - Chama `supabase.auth.signOut()`
   - Remove cookies de sessão
   - Redireciona para landing page

### Código de Logout

\`\`\`typescript
const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/')
}
\`\`\`

---

## Variáveis de Ambiente Necessárias

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Redirect após confirmação de email (desenvolvimento)
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/dashboard
\`\`\`

---

## Troubleshooting

### Erro: "Email not confirmed"
**Causa:** Usuário tentou fazer login antes de confirmar o email
**Solução:** Clicar no link do email ou usar o botão "Reenviar email"

### Erro: "Invalid login credentials"
**Causa:** Email ou senha incorretos, ou usuário não existe
**Solução:** Verificar credenciais ou criar nova conta

### Erro: "Auth session missing"
**Causa:** Sessão expirou ou cookies foram deletados
**Solução:** Fazer login novamente

### Email de confirmação não chega
**Causa:** Email pode estar no spam ou configuração SMTP incorreta
**Solução:** 
1. Verificar pasta de spam
2. Usar botão "Reenviar email"
3. Verificar configuração SMTP no Supabase Dashboard
