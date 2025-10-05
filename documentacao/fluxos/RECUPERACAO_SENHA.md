# Fluxo de Recuperação de Senha

## Visão Geral

Sistema completo de recuperação de senha integrado com Supabase Auth, permitindo que usuários redefinam suas senhas através de um link enviado por email.

## Arquitetura

### Páginas Envolvidas

1. **Login** (`/auth/login`)
   - Link "Esqueci minha senha"
   
2. **Esqueci Minha Senha** (`/auth/forgot-password`)
   - Formulário para solicitar recuperação
   
3. **Redefinir Senha** (`/auth/update-password`)
   - Formulário para definir nova senha

### Tecnologias

- **Supabase Auth**: Gerenciamento de autenticação e envio de emails
- **Next.js 14**: App Router com Client Components
- **TypeScript**: Tipagem forte
- **Tailwind CSS**: Estilização

## Fluxo Detalhado

### 1. Usuário Esqueceu a Senha

\`\`\`
┌─────────────────┐
│  Login Page     │
│  /auth/login    │
└────────┬────────┘
         │
         │ Clica em "Esqueci minha senha"
         │
         ▼
┌─────────────────────────┐
│  Forgot Password Page   │
│  /auth/forgot-password  │
└─────────────────────────┘
\`\`\`

**Ações:**
- Usuário clica no link "Esqueci minha senha"
- É redirecionado para `/auth/forgot-password`

### 2. Solicitação de Recuperação

\`\`\`
┌─────────────────────────┐
│  Forgot Password Page   │
│                         │
│  1. Digite email        │
│  2. Clique em enviar    │
└────────┬────────────────┘
         │
         │ supabase.auth.resetPasswordForEmail()
         │
         ▼
┌─────────────────────────┐
│  Supabase Auth          │
│                         │
│  - Valida email         │
│  - Gera token único     │
│  - Envia email          │
└────────┬────────────────┘
         │
         │ Email enviado
         │
         ▼
┌─────────────────────────┐
│  Caixa de Email         │
│                         │
│  Link com token         │
└─────────────────────────┘
\`\`\`

**Código:**
\`\`\`typescript
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/auth/update-password`,
})
\`\`\`

**Validações:**
- Email deve ser válido
- Email deve existir no sistema
- Rate limiting: máximo de tentativas por período

**Mensagens:**
- ✅ Sucesso: "Email enviado com sucesso! Verifique sua caixa de entrada..."
- ❌ Erro: Mensagem específica do erro

### 3. Usuário Recebe Email

**Conteúdo do Email:**
- Assunto: "Redefinir sua senha - FalaZap"
- Corpo: Link para redefinir senha
- Link expira em: 1 hora (padrão Supabase)

**Template do Email:**
Configurado no Supabase Dashboard:
- Settings → Auth → Email Templates → Reset Password

### 4. Clique no Link do Email

\`\`\`
┌─────────────────────────┐
│  Email                  │
│                         │
│  [Redefinir Senha]      │
└────────┬────────────────┘
         │
         │ Clica no link
         │
         ▼
┌─────────────────────────┐
│  Update Password Page   │
│  /auth/update-password  │
│                         │
│  - Valida token         │
│  - Cria sessão temp     │
└─────────────────────────┘
\`\`\`

**O que acontece:**
1. Supabase valida o token da URL
2. Cria uma sessão temporária
3. Usuário pode definir nova senha

### 5. Redefinição de Senha

\`\`\`
┌─────────────────────────┐
│  Update Password Page   │
│                         │
│  1. Nova senha          │
│  2. Confirmar senha     │
│  3. Clique em atualizar │
└────────┬────────────────┘
         │
         │ supabase.auth.updateUser()
         │
         ▼
┌─────────────────────────┐
│  Supabase Auth          │
│                         │
│  - Valida senha         │
│  - Atualiza no banco    │
│  - Invalida token       │
└────────┬────────────────┘
         │
         │ Senha atualizada
         │
         ▼
┌─────────────────────────┐
│  Login Page             │
│  /auth/login            │
│                         │
│  Usuário pode entrar    │
└─────────────────────────┘
\`\`\`

**Código:**
\`\`\`typescript
const { error } = await supabase.auth.updateUser({
  password: newPassword,
})
\`\`\`

**Validações:**
- Senha mínima: 6 caracteres
- Senhas devem coincidir
- Sessão deve ser válida

**Mensagens:**
- ✅ Sucesso: "Senha atualizada com sucesso! Redirecionando..."
- ❌ Erro: Mensagem específica do erro

## Segurança

### Tokens

- **Geração**: Supabase gera tokens únicos e seguros
- **Expiração**: 1 hora (configurável)
- **Uso único**: Token é invalidado após uso
- **Criptografia**: Tokens são criptografados

### Rate Limiting

- **Limite**: Configurado no Supabase
- **Proteção**: Previne ataques de força bruta
- **Mensagem**: "Muitas tentativas. Tente novamente mais tarde."

### Validações

1. **Email válido**: Formato correto
2. **Email existe**: Usuário cadastrado
3. **Senha forte**: Mínimo 6 caracteres
4. **Senhas coincidem**: Confirmação correta
5. **Token válido**: Não expirado e não usado

## Tratamento de Erros

### Erros Comuns

| Erro | Causa | Solução |
|------|-------|---------|
| "Email not found" | Email não cadastrado | Verificar email ou criar conta |
| "Invalid token" | Token expirado ou inválido | Solicitar novo link |
| "Passwords don't match" | Senhas diferentes | Digitar senhas iguais |
| "Password too short" | Senha < 6 caracteres | Usar senha mais longa |
| "Too many requests" | Rate limiting | Aguardar alguns minutos |
| "Error sending recovery email" | Problema com SMTP | Verificar configuração SMTP no Supabase |

### Logs de Debug

Todos os passos são logados com `console.log("[v0] ...")`:

\`\`\`typescript
console.log("[v0] Sending password reset email to:", email)
console.log("[v0] Redirect URL:", redirectUrl)
console.log("[v0] Reset password response:", { data, error })
console.log("[v0] Password reset email sent successfully")
console.log("[v0] Checking session for password update:", session?.user?.id)
console.log("[v0] Updating password...")
console.log("[v0] Password updated successfully")
\`\`\`

## Troubleshooting

### Problema: "Error sending recovery email"

**Causas possíveis:**

1. **SMTP não configurado**
   - O Supabase usa um SMTP padrão limitado para testes
   - Recomendado: configurar SMTP customizado

2. **Rate limit excedido**
   - Muitas tentativas em curto período
   - Aguardar alguns minutos

3. **Email provider bloqueando**
   - Verificar logs do email provider
   - Verificar se domínio está na blacklist

**Soluções:**

#### 1. Configurar SMTP Customizado (Recomendado)

1. Ir para Supabase Dashboard
2. Settings → Auth → Email
3. Configurar SMTP customizado:
   - Host: smtp.seu-provedor.com
   - Port: 587 (TLS) ou 465 (SSL)
   - Username: seu-email@dominio.com
   - Password: sua-senha-smtp

**Provedores recomendados:**
- SendGrid
- Mailgun
- AWS SES
- Resend
- Postmark

#### 2. Verificar Logs do Supabase

1. Ir para Supabase Dashboard
2. Logs → Auth Logs
3. Procurar por erros de "handover" ao email provider
4. Verificar mensagens de erro específicas

#### 3. Verificar Template de Email

1. Ir para Supabase Dashboard
2. Settings → Auth → Email Templates
3. Verificar template "Reset Password"
4. Garantir que a URL de redirect está correta:
   \`\`\`
   {{ .SiteURL }}/auth/update-password
   \`\`\`

#### 4. Verificar Variáveis de Ambiente

\`\`\`env
# Desenvolvimento
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000

# Produção
NEXT_PUBLIC_SITE_URL=https://seu-dominio.com
\`\`\`

#### 5. Testar com Email de Teste

Use serviços como:
- [Mailtrap](https://mailtrap.io/) - Para testes
- [Ethereal Email](https://ethereal.email/) - Email fake para testes

### Problema: Email não chega

**Verificar:**

1. **Caixa de spam**
   - Emails do Supabase podem ir para spam
   - Adicionar remetente à lista de contatos

2. **Firewall do servidor de email**
   - Alguns servidores bloqueiam emails de domínios desconhecidos
   - Contatar admin do servidor de email

3. **Delay no envio**
   - Emails podem demorar alguns minutos
   - Aguardar até 5 minutos

4. **Email provider logs**
   - Verificar logs do provedor de email
   - Procurar por bounces ou bloqueios

### Problema: Token expirado

**Causa:**
- Token expira em 1 hora (padrão)

**Solução:**
- Solicitar novo link de recuperação
- Usar o link mais recente recebido

### Problema: "Invalid session"

**Causa:**
- Usuário não clicou no link do email
- Token já foi usado
- Sessão expirou

**Solução:**
- Clicar no link recebido por email
- Solicitar novo link se necessário

## Configuração

### Variáveis de Ambiente

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=sua_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

### Supabase Dashboard

1. **Email Templates**
   - Settings → Auth → Email Templates
   - Customizar template "Reset Password"

2. **Email Provider**
   - Settings → Auth → Email
   - Configurar SMTP customizado (recomendado)

3. **Rate Limiting**
   - Settings → Auth → Rate Limits
   - Configurar limites de tentativas

## UX/UI

### Estados Visuais

1. **Loading**: Spinner + texto "Enviando..." / "Atualizando..."
2. **Sucesso**: Ícone verde + mensagem de confirmação
3. **Erro**: Ícone vermelho + mensagem de erro
4. **Validação**: Feedback em tempo real

### Acessibilidade

- Labels descritivos
- Mensagens de erro claras
- Foco no teclado
- Contraste adequado
- Ícones com significado

## Testes

### Cenários de Teste

1. ✅ Email válido e cadastrado
2. ✅ Email não cadastrado
3. ✅ Email inválido
4. ✅ Token expirado
5. ✅ Token já usado
6. ✅ Senhas não coincidem
7. ✅ Senha muito curta
8. ✅ Rate limiting

### Como Testar

\`\`\`bash
# 1. Solicitar recuperação
# Ir para /auth/forgot-password
# Digite email cadastrado
# Clique em "Enviar link de recuperação"

# 2. Verificar email
# Abrir caixa de entrada
# Clicar no link recebido

# 3. Redefinir senha
# Digite nova senha (mínimo 6 caracteres)
# Confirme a senha
# Clique em "Atualizar senha"

# 4. Fazer login
# Ir para /auth/login
# Entrar com nova senha
\`\`\`

## Melhorias Futuras

- [ ] Adicionar força da senha (fraca/média/forte)
- [ ] Histórico de senhas (não permitir reutilização)
- [ ] Autenticação de dois fatores (2FA)
- [ ] Notificação de mudança de senha por email
- [ ] Logs de auditoria de mudanças de senha
- [ ] Customização avançada do template de email

## Referências

- [Supabase Auth - Password Reset](https://supabase.com/docs/guides/auth/passwords)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Documentação do Projeto](./README.md)
