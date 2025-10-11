# Fluxo Completo de Subscriptions e Etapas do Funil

## Visão Geral

Este documento descreve o fluxo completo desde o cadastro do usuário até a ativação da subscription e atualização da etapa do funil.

## Etapas do Funil

\`\`\`
Lead → Trial → User → Churn
\`\`\`

- **Lead**: Usuário cadastrado mas não assinou
- **Trial**: Usuário em período de teste (trial)
- **User**: Usuário pagante ativo
- **Churn**: Usuário que cancelou ou está com pagamento atrasado

## Fluxo Detalhado

### 1. Cadastro do Usuário

\`\`\`
Usuário preenche formulário → Supabase Auth cria usuário → Trigger cria profile
\`\`\`

**Tabelas afetadas:**
- `auth.users` (Supabase Auth)
- `public.profiles` (via trigger)

**Estado inicial:**
- `profiles.etapa_funil` = 'Lead'

**Código:**
- `app/auth/signup/page.tsx`
- `scripts/001_create_profiles_table.sql` (trigger)

### 2. Seleção de Plano

\`\`\`
Usuário faz login → Acessa /subscription → Escolhe plano → Clica em "Assinar"
\`\`\`

**Código:**
- `app/subscription/page.tsx`
- `components/subscription-plans.tsx`

**Logs esperados:**
\`\`\`
[v0] Opening checkout for plan: starter User: xxx
[v0] Starting checkout session for product: starter
\`\`\`

### 3. Criação do Checkout

\`\`\`
Cliente chama API → API cria session no Stripe → Redireciona para Stripe Checkout
\`\`\`

**Código:**
- `app/api/checkout/route.ts`

**Dados enviados ao Stripe:**
\`\`\`typescript
{
  mode: 'subscription',
  customer_email: user.email,
  metadata: {
    userId: user.id,
    planName: 'Starter',
    planPrice: '97'
  },
  subscription_data: {
    trial_period_days: 7
  }
}
\`\`\`

**Logs esperados:**
\`\`\`
[v0] Creating checkout session for user: xxx product: starter
[v0] Checkout session created successfully: cs_test_xxx
\`\`\`

### 4. Pagamento no Stripe

\`\`\`
Usuário preenche dados → Stripe processa → Stripe cria subscription
\`\`\`

**O que acontece no Stripe:**
1. Valida cartão
2. Cria customer (se não existir)
3. Cria subscription com status 'trialing' (se tem trial) ou 'active'
4. Dispara webhook `checkout.session.completed`

### 5. Webhook Recebe Evento

\`\`\`
Stripe envia POST → /api/webhooks/stripe → Verifica assinatura → Processa evento
\`\`\`

**Código:**
- `app/api/webhooks/stripe/route.ts`

**Logs esperados:**
\`\`\`
[v0] ========== STRIPE WEBHOOK RECEIVED ==========
[v0] ✅ Webhook signature verified successfully
[v0] Event Type: checkout.session.completed
[v0] 💳 CHECKOUT SESSION COMPLETED
[v0] Session ID: cs_test_xxx
[v0] Customer: cus_xxx
[v0] Subscription: sub_xxx
\`\`\`

### 6. Criação da Subscription no Banco

\`\`\`
Webhook extrai dados → Chama createSubscription() → Insere na tabela subscriptions
\`\`\`

**Código:**
- `lib/supabase/subscriptions.ts`

**Dados inseridos:**
\`\`\`typescript
{
  user_id: 'xxx',
  stripe_customer_id: 'cus_xxx',
  stripe_subscription_id: 'sub_xxx',
  plan_name: 'Starter',
  plan_price: 97,
  status: 'trialing', // ou 'active'
  trial_ends_at: '2025-01-15T00:00:00Z',
  current_period_start: '2025-01-08T00:00:00Z',
  current_period_end: '2025-02-08T00:00:00Z'
}
\`\`\`

**Logs esperados:**
\`\`\`
[v0] ✅ Retrieved subscription from Stripe: sub_xxx
[v0] Subscription status: trialing
[v0] Trial end: 2025-01-15T00:00:00.000Z
[v0] Creating subscription in database with data: {...}
[v0] ✅✅✅ SUBSCRIPTION CREATED SUCCESSFULLY ✅✅✅
\`\`\`

### 7. Trigger Atualiza Etapa do Funil

\`\`\`
INSERT em subscriptions → Trigger dispara → Atualiza profiles.etapa_funil
\`\`\`

**Código:**
- `scripts/007_fix_etapa_funil_trigger.sql`

**Lógica do trigger:**
\`\`\`sql
IF NEW.status = 'trialing' THEN
  UPDATE profiles SET etapa_funil = 'Trial'
ELSIF NEW.status = 'active' THEN
  UPDATE profiles SET etapa_funil = 'User'
ELSIF NEW.status IN ('canceled', 'past_due', 'unpaid') THEN
  UPDATE profiles SET etapa_funil = 'Churn'
END IF
\`\`\`

**Logs esperados (Postgres):**
\`\`\`
NOTICE: Etapa funil atualizada para user_id xxx: Lead -> Trial (subscription status: trialing)
\`\`\`

### 8. Usuário Acessa Dashboard

\`\`\`
Usuário volta ao site → Middleware verifica auth → Busca subscription → Permite acesso
\`\`\`

**Código:**
- `middleware.ts`
- `app/dashboard/page.tsx`

**Verificações:**
- Usuário está autenticado?
- Subscription existe e está ativa?
- Etapa do funil permite acesso?

## Diagrama de Sequência

\`\`\`
Usuário          App              Stripe           Webhook          Database
   |              |                 |                 |                 |
   |--Cadastro-|                 |                 |                 |
   |              |--Create User-|                 |                 |
   |              |                 |                 |--Insert Profile->|
   |              |                 |                 |  (etapa=Lead)   |
   |              |                 |                 |                 |
   |--Assinar--|                 |                 |                 |
   |              |--Create Session>|                 |                 |
   |              |<--Session URL---|                 |                 |
   |              |                 |                 |                 |
   |--Pagar----|--------------|                 |                 |
   |              |                 |--Process-----|                 |
   |              |                 |                 |                 |
   |              |                 |--Webhook Event->|                 |
   |              |                 |                 |--Insert Sub--|
   |              |                 |                 |                 |
   |              |                 |                 |<--Trigger-------|
   |              |                 |                 |  (Update etapa) |
   |              |                 |                 |                 |
   |<-Redirect----|                 |                 |                 |
   |              |                 |                 |                 |
   |--Dashboard|                 |                 |                 |
   |              |--Check Sub---|                 |                 |
   |              |<--Sub Active----|                 |                 |
   |<--Content----|                 |                 |                 |
\`\`\`

## Estados Possíveis

### Subscription Status (Stripe)

- `trialing`: Em período de teste
- `active`: Ativa e pagando
- `past_due`: Pagamento atrasado
- `canceled`: Cancelada
- `unpaid`: Não paga

### Etapa Funil (Nossa App)

- `Lead`: Cadastrado, sem subscription
- `Trial`: Subscription com status 'trialing'
- `User`: Subscription com status 'active'
- `Churn`: Subscription cancelada ou com problemas

## Transições de Estado

\`\`\`
Lead --[cria subscription trialing] Trial
Lead --[cria subscription active]-- User
Trial --[trial termina e paga]----- User
Trial --[cancela durante trial]---- Churn
User --[cancela subscription]------ Churn
User --[pagamento falha]----------- Churn
Churn --[reativa subscription]----- User
\`\`\`

## Verificações e Diagnósticos

### Verificar estado atual de um usuário

\`\`\`sql
SELECT 
  p.id,
  p.email,
  p.etapa_funil,
  s.status as subscription_status,
  s.stripe_subscription_id,
  s.trial_ends_at,
  s.current_period_end
FROM profiles p
LEFT JOIN subscriptions s ON p.id = s.user_id
WHERE p.email = 'usuario@exemplo.com';
\`\`\`

### Verificar inconsistências

\`\`\`sql
-- Usuários com subscription mas etapa errada
SELECT 
  p.email,
  p.etapa_funil,
  s.status,
  CASE
    WHEN s.status = 'trialing' THEN 'Trial'
    WHEN s.status = 'active' THEN 'User'
    ELSE 'Churn'
  END as etapa_esperada
FROM profiles p
JOIN subscriptions s ON p.id = s.user_id
WHERE p.etapa_funil::text != CASE
  WHEN s.status = 'trialing' THEN 'Trial'
  WHEN s.status = 'active' THEN 'User'
  ELSE 'Churn'
END;
\`\`\`

### Corrigir inconsistências

\`\`\`sql
-- Atualizar etapas baseado nas subscriptions
UPDATE profiles p
SET etapa_funil = CASE
  WHEN s.status = 'trialing' THEN 'Trial'::etapa_funil_type
  WHEN s.status = 'active' THEN 'User'::etapa_funil_type
  WHEN s.status IN ('canceled', 'past_due', 'unpaid') THEN 'Churn'::etapa_funil_type
  ELSE p.etapa_funil
END
FROM subscriptions s
WHERE p.id = s.user_id;
\`\`\`

## Monitoramento

### Métricas Importantes

1. **Taxa de conversão Lead → Trial**
\`\`\`sql
SELECT 
  COUNT(CASE WHEN etapa_funil = 'Lead' THEN 1 END) as leads,
  COUNT(CASE WHEN etapa_funil = 'Trial' THEN 1 END) as trials,
  ROUND(
    COUNT(CASE WHEN etapa_funil = 'Trial' THEN 1 END)::numeric / 
    NULLIF(COUNT(CASE WHEN etapa_funil = 'Lead' THEN 1 END), 0) * 100,
    2
  ) as taxa_conversao
FROM profiles;
\`\`\`

2. **Taxa de conversão Trial → User**
\`\`\`sql
SELECT 
  COUNT(CASE WHEN etapa_funil = 'Trial' THEN 1 END) as trials,
  COUNT(CASE WHEN etapa_funil = 'User' THEN 1 END) as users,
  ROUND(
    COUNT(CASE WHEN etapa_funil = 'User' THEN 1 END)::numeric / 
    NULLIF(COUNT(CASE WHEN etapa_funil = 'Trial' THEN 1 END), 0) * 100,
    2
  ) as taxa_conversao
FROM profiles;
\`\`\`

3. **Taxa de Churn**
\`\`\`sql
SELECT 
  COUNT(CASE WHEN etapa_funil = 'Churn' THEN 1 END) as churned,
  COUNT(*) as total,
  ROUND(
    COUNT(CASE WHEN etapa_funil = 'Churn' THEN 1 END)::numeric / 
    COUNT(*) * 100,
    2
  ) as taxa_churn
FROM profiles;
\`\`\`

## Troubleshooting Comum

### Problema: Subscription criada mas etapa não muda

**Diagnóstico:**
\`\`\`sql
-- Verificar se trigger existe
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'trigger_update_etapa_funil';

-- Ver logs do Postgres
-- (No Supabase Dashboard → Logs → Postgres Logs)
\`\`\`

**Solução:**
\`\`\`sql
-- Recriar trigger
\i scripts/007_fix_etapa_funil_trigger.sql
\`\`\`

### Problema: Múltiplas subscriptions para mesmo usuário

**Diagnóstico:**
\`\`\`sql
SELECT user_id, COUNT(*) 
FROM subscriptions 
GROUP BY user_id 
HAVING COUNT(*) > 1;
\`\`\`

**Solução:**
\`\`\`sql
-- Manter apenas a mais recente
DELETE FROM subscriptions
WHERE id NOT IN (
  SELECT DISTINCT ON (user_id) id
  FROM subscriptions
  ORDER BY user_id, created_at DESC
);
\`\`\`

### Problema: Webhook não está sendo chamado

**Diagnóstico:**
1. Verificar logs da Vercel
2. Verificar eventos no Stripe Dashboard
3. Testar com "Send test webhook"

**Solução:**
Ver `WEBHOOK_SETUP.md` para configuração completa
