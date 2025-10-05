# Fluxo de Pagamento e Assinaturas

Este documento descreve o fluxo completo de pagamento usando Stripe, desde a escolha do plano até a atualização da subscription no banco de dados.

## Visão Geral

O FalaZap usa **Stripe** para processar pagamentos e gerenciar assinaturas. O fluxo inclui:
1. Escolha do plano
2. Checkout no Stripe
3. Processamento do pagamento
4. Webhook atualiza banco de dados
5. Usuário acessa funcionalidades

---

## 1. Planos Disponíveis

### Starter - R$ 19,99/mês
- 1 dispositivo WhatsApp
- Mensagens ilimitadas
- Suporte por email

### Pro - R$ 49,99/mês
- 3 dispositivos WhatsApp
- Mensagens ilimitadas
- Suporte prioritário
- Relatórios avançados

### Business - R$ 99,99/mês
- 10 dispositivos WhatsApp
- Mensagens ilimitadas
- Suporte 24/7
- API dedicada
- Gerente de conta

---

## 2. Fluxo Completo de Pagamento

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│  USUÁRIO ACESSA /assinatura                                 │
│  - Vê os 3 planos disponíveis                               │
│  - Compara features                                         │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  USUÁRIO CLICA EM "Assinar Plano"                           │
│  - Escolhe: Starter, Pro ou Business                        │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  CLIENTE: startCheckoutSession()                            │
│  - Envia: planId, userId                                    │
│  - Server Action cria sessão no Stripe                      │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  STRIPE API: checkout.sessions.create()                     │
│  - mode: 'subscription'                                     │
│  - line_items: [{ price: price_xxx, quantity: 1 }]         │
│  - metadata: { userId, planName, planPrice }               │
│  - subscription_data: { trial_period_days: 3 }             │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  STRIPE RETORNA:                                            │
│  - sessionId                                                │
│  - clientSecret                                             │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  EMBEDDED CHECKOUT ABRE                                     │
│  - Formulário de pagamento do Stripe                        │
│  - Usuário preenche dados do cartão                         │
│  - Aceita termos                                            │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  USUÁRIO CONFIRMA PAGAMENTO                                 │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  STRIPE PROCESSA PAGAMENTO                                  │
│  1. Valida cartão                                           │
│  2. Cria customer no Stripe                                 │
│  3. Cria subscription no Stripe                             │
│  4. Inicia período de teste (3 dias)                        │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  STRIPE ENVIA WEBHOOK                                       │
│  - Evento: checkout.session.completed                       │
│  - URL: /api/webhooks/stripe                                │
│  - Payload: session data + metadata                         │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  WEBHOOK HANDLER: /api/webhooks/stripe/route.ts            │
│  1. Verifica assinatura do webhook                          │
│  2. Extrai dados do evento                                  │
│  3. Insere/atualiza tabela subscriptions                    │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  BANCO DE DADOS ATUALIZADO                                  │
│  - Nova linha em subscriptions                              │
│  - status: 'trialing'                                       │
│  - trial_ends_at: NOW() + 3 days                            │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  USUÁRIO REDIRECIONADO                                      │
│  - Vai para /dashboard                                      │
│  - Vê mensagem de sucesso                                   │
│  - Pode começar a usar o sistema                            │
└─────────────────────────────────────────────────────────────┘
\`\`\`

---

## 3. Código do Checkout

### Server Action: app/actions/stripe.ts

\`\`\`typescript
export async function startCheckoutSession(planId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Usuário não autenticado')
  
  // Mapeia planId para price_id do Stripe
  const priceId = PLAN_PRICE_IDS[planId]
  
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{
      price: priceId,
      quantity: 1
    }],
    metadata: {
      userId: user.id,
      planName: planId,
      planPrice: PLAN_PRICES[planId]
    },
    subscription_data: {
      trial_period_days: 3,
      metadata: {
        userId: user.id
      }
    },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/assinatura`
  })
  
  return { sessionId: session.id, clientSecret: session.client_secret }
}
\`\`\`

---

## 4. Webhook do Stripe

### Eventos Processados

#### checkout.session.completed
**Quando:** Pagamento concluído com sucesso
**Ação:** Cria nova subscription no banco

\`\`\`typescript
const session = event.data.object
const userId = session.metadata.userId
const customerId = session.customer
const subscriptionId = session.subscription

await createSubscription({
  user_id: userId,
  stripe_customer_id: customerId,
  stripe_subscription_id: subscriptionId,
  plan_name: session.metadata.planName,
  plan_price: parseFloat(session.metadata.planPrice),
  status: 'trialing',
  trial_ends_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
})
\`\`\`

#### customer.subscription.updated
**Quando:** Subscription é atualizada (renovação, mudança de plano, fim do trial)
**Ação:** Atualiza subscription existente

\`\`\`typescript
const subscription = event.data.object

await updateSubscriptionByStripeId(subscription.id, {
  status: subscription.status,
  current_period_start: new Date(subscription.current_period_start * 1000),
  current_period_end: new Date(subscription.current_period_end * 1000),
  cancel_at_period_end: subscription.cancel_at_period_end
})
\`\`\`

#### customer.subscription.deleted
**Quando:** Subscription é cancelada
**Ação:** Marca subscription como cancelada

\`\`\`typescript
const subscription = event.data.object

await updateSubscriptionByStripeId(subscription.id, {
  status: 'canceled'
})
\`\`\`

#### invoice.payment_failed
**Quando:** Falha no pagamento da renovação
**Ação:** Marca subscription como past_due

\`\`\`typescript
const invoice = event.data.object

await updateSubscriptionByStripeId(invoice.subscription, {
  status: 'past_due'
})
\`\`\`

---

## 5. Status da Subscription

### Status Possíveis

| Status | Descrição | Acesso ao Sistema |
|--------|-----------|-------------------|
| `trialing` | Período de teste (3 dias) | ✅ Acesso completo |
| `active` | Assinatura ativa e paga | ✅ Acesso completo |
| `past_due` | Pagamento falhou | ⚠️ Acesso limitado |
| `canceled` | Assinatura cancelada | ❌ Sem acesso |
| `incomplete` | Pagamento pendente | ❌ Sem acesso |

### Verificação de Acesso

\`\`\`typescript
// Verifica se usuário tem acesso
const hasAccess = (subscription: Subscription) => {
  if (!subscription) return false
  
  const validStatuses = ['trialing', 'active']
  return validStatuses.includes(subscription.status)
}
\`\`\`

---

## 6. Período de Teste (Trial)

### Configuração

- **Duração:** 3 dias
- **Cartão necessário:** Sim (para evitar abuse)
- **Cobrança automática:** Após 3 dias, se não cancelar

### Implementação

\`\`\`typescript
subscription_data: {
  trial_period_days: 3,
  trial_settings: {
    end_behavior: {
      missing_payment_method: 'cancel'
    }
  }
}
\`\`\`

### Cálculo do Fim do Trial

\`\`\`sql
-- No banco de dados
trial_ends_at = NOW() + INTERVAL '3 days'

-- No código
const trialEndsAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
\`\`\`

---

## 7. Configuração do Webhook

### URL do Webhook

\`\`\`
https://seu-dominio.vercel.app/api/webhooks/stripe
\`\`\`

### Eventos para Escutar

No Stripe Dashboard, configure os seguintes eventos:

- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_failed`
- `invoice.payment_succeeded`

### Webhook Secret

\`\`\`env
STRIPE_WEBHOOK_SECRET=whsec_xxx...
\`\`\`

### Verificação de Assinatura

\`\`\`typescript
const sig = request.headers.get('stripe-signature')
const event = stripe.webhooks.constructEvent(
  body,
  sig,
  process.env.STRIPE_WEBHOOK_SECRET
)
\`\`\`

---

## 8. Variáveis de Ambiente

\`\`\`env
# Stripe
STRIPE_SECRET_KEY=sk_test_xxx...
STRIPE_PUBLISHABLE_KEY=pk_test_xxx...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx...
STRIPE_WEBHOOK_SECRET=whsec_xxx...

# Site URL (para redirects)
NEXT_PUBLIC_SITE_URL=https://seu-dominio.vercel.app
\`\`\`

---

## 9. Troubleshooting

### Subscription não é criada após pagamento

**Possíveis causas:**
1. Webhook não está configurado no Stripe
2. URL do webhook está incorreta
3. Webhook secret está incorreto
4. Tabela subscriptions não tem as colunas necessárias

**Solução:**
1. Verificar logs do webhook no Stripe Dashboard
2. Executar script `005_add_subscription_columns.sql`
3. Verificar variável `STRIPE_WEBHOOK_SECRET`
4. Testar webhook com Stripe CLI

### Erro: "column does not exist"

**Causa:** Tabela subscriptions não tem todas as colunas
**Solução:** Executar `scripts/005_add_subscription_columns.sql`

### Pagamento aprovado mas status é "incomplete"

**Causa:** Webhook não processou o evento corretamente
**Solução:** Verificar logs do webhook e reprocessar evento manualmente

---

## 10. Testes

### Cartões de Teste do Stripe

\`\`\`
Sucesso: 4242 4242 4242 4242
Falha: 4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155

CVV: Qualquer 3 dígitos
Data: Qualquer data futura
\`\`\`

### Testar Webhook Localmente

\`\`\`bash
# Instalar Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Escutar webhooks
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger evento de teste
stripe trigger checkout.session.completed
