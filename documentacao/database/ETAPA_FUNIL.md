# Etapa do Funil - Documentação

## Visão Geral

A coluna `etapa_funil` na tabela `profiles` rastreia o estágio do usuário no funil de vendas, facilitando segmentação, análise e automações.

## Status Disponíveis

### 1. Lead
**Definição:** Usuário que criou conta mas não assinou nenhum plano

**Características:**
- Completou o signup
- Confirmou email
- Não tem subscription ativa
- Pode estar explorando a plataforma

**Ações sugeridas:**
- Enviar emails de onboarding
- Mostrar benefícios dos planos
- Oferecer trial gratuito
- Remarketing

### 2. Trial
**Definição:** Usuário em período de teste (3 dias)

**Características:**
- Iniciou subscription com trial
- Tem acesso completo às funcionalidades
- Ainda não foi cobrado
- Trial expira em 3 dias

**Ações sugeridas:**
- Emails de engajamento durante trial
- Lembretes antes do trial expirar
- Tutoriais e dicas de uso
- Suporte proativo

### 3. User
**Definição:** Usuário ativo pagante

**Características:**
- Passou do trial e continua pagando
- OU assinou direto sem trial
- Subscription status = 'active'
- Pagamentos em dia

**Ações sugeridas:**
- Emails de valor e novidades
- Upsell para planos superiores
- Programa de indicação
- Pesquisas de satisfação

### 4. Churn
**Definição:** Usuário que cancelou ou parou de pagar

**Características:**
- Era usuário ativo (Trial ou User)
- Cancelou a subscription
- OU pagamento falhou/atrasado
- Subscription status = 'canceled', 'past_due', 'unpaid'

**Ações sugeridas:**
- Pesquisa de motivo do cancelamento
- Ofertas de reativação
- Desconto para voltar
- Win-back campaigns

## Fluxo de Transição

\`\`\`
┌──────┐
│ Lead │ (Cadastro inicial)
└──┬───┘
   │
   ├─────────────────┐
   │                 │
   ▼                 ▼
┌───────┐        ┌──────┐
│ Trial │        │ User │ (Assina direto sem trial)
└───┬───┘        └───┬──┘
    │                │
    ├────────────────┤
    │                │
    ▼                ▼
┌───────┐        ┌───────┐
│ User  │        │ Churn │
└───┬───┘        └───────┘
    │
    ▼
┌───────┐
│ Churn │
└───────┘
\`\`\`

## Atualização Automática

A coluna `etapa_funil` é atualizada **automaticamente** via trigger quando:

1. **Subscription é criada:**
   - Status 'trialing' → etapa_funil = 'Trial'
   - Status 'active' → etapa_funil = 'User'

2. **Subscription é atualizada:**
   - Status muda para 'active' → etapa_funil = 'User'
   - Status muda para 'canceled', 'past_due', 'unpaid' → etapa_funil = 'Churn'

3. **Usuário cria conta:**
   - Default → etapa_funil = 'Lead'

## Queries Úteis

### Contar usuários por etapa
\`\`\`sql
SELECT etapa_funil, COUNT(*) as total
FROM profiles
GROUP BY etapa_funil
ORDER BY total DESC;
\`\`\`

### Usuários em trial que expiram em breve
\`\`\`sql
SELECT p.*, s.trial_ends_at
FROM profiles p
JOIN subscriptions s ON p.id = s.user_id
WHERE p.etapa_funil = 'Trial'
  AND s.trial_ends_at <= NOW() + INTERVAL '1 day'
ORDER BY s.trial_ends_at;
\`\`\`

### Taxa de conversão Lead → Trial
\`\`\`sql
WITH stats AS (
  SELECT 
    COUNT(*) FILTER (WHERE etapa_funil = 'Lead') as leads,
    COUNT(*) FILTER (WHERE etapa_funil IN ('Trial', 'User')) as converted
  FROM profiles
)
SELECT 
  leads,
  converted,
  ROUND((converted::numeric / NULLIF(leads, 0)) * 100, 2) as conversion_rate
FROM stats;
\`\`\`

### Taxa de churn
\`\`\`sql
WITH stats AS (
  SELECT 
    COUNT(*) FILTER (WHERE etapa_funil IN ('User', 'Churn')) as total_users,
    COUNT(*) FILTER (WHERE etapa_funil = 'Churn') as churned
  FROM profiles
)
SELECT 
  total_users,
  churned,
  ROUND((churned::numeric / NULLIF(total_users, 0)) * 100, 2) as churn_rate
FROM stats;
\`\`\`

## Métricas Importantes

### KPIs por Etapa
- **Lead → Trial:** Taxa de conversão para trial
- **Trial → User:** Taxa de conversão de trial para pagante
- **User → Churn:** Taxa de churn
- **Churn → User:** Taxa de reativação

### Tempo Médio em Cada Etapa
\`\`\`sql
-- Adicionar coluna para rastrear quando mudou de etapa (futura melhoria)
ALTER TABLE profiles ADD COLUMN etapa_funil_updated_at TIMESTAMP DEFAULT NOW();
\`\`\`

## Integrações

### Marketing
- Segmentar campanhas por etapa
- Automações de email baseadas em etapa
- Remarketing para Leads e Churns

### Analytics
- Dashboards de funil
- Análise de conversão
- Previsão de receita

### CRM
- Sincronizar etapa com CRM
- Alertas para equipe de vendas
- Follow-up automatizado

## Manutenção

### Verificar consistência
\`\`\`sql
-- Verificar se há inconsistências entre etapa_funil e subscription status
SELECT 
  p.id,
  p.email,
  p.etapa_funil,
  s.status as subscription_status
FROM profiles p
LEFT JOIN subscriptions s ON p.id = s.user_id
WHERE 
  (p.etapa_funil = 'Trial' AND s.status != 'trialing')
  OR (p.etapa_funil = 'User' AND s.status != 'active')
  OR (p.etapa_funil = 'Churn' AND s.status NOT IN ('canceled', 'past_due', 'unpaid'));
\`\`\`

### Corrigir inconsistências
\`\`\`sql
-- Executar a função de atualização manualmente se necessário
UPDATE profiles p
SET etapa_funil = CASE
  WHEN s.status = 'trialing' THEN 'Trial'::etapa_funil_type
  WHEN s.status = 'active' THEN 'User'::etapa_funil_type
  WHEN s.status IN ('canceled', 'past_due', 'unpaid') THEN 'Churn'::etapa_funil_type
  ELSE 'Lead'::etapa_funil_type
END
FROM subscriptions s
WHERE p.id = s.user_id;
