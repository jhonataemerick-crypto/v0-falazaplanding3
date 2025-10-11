# Configuração do Webhook do Stripe - Guia Completo

## Problema Identificado

A tabela `subscriptions` não está sendo atualizada e os usuários permanecem como "Lead" mesmo após completar o pagamento. Isso acontece porque:

1. O webhook do Stripe não está configurado
2. Sem webhook, o Stripe não notifica nossa aplicação sobre pagamentos
3. Sem notificação, nenhuma subscription é criada no banco
4. Sem subscription, o trigger não atualiza a etapa_funil

## Como Funciona o Fluxo Completo

\`\`\`
1. Usuário clica em "Assinar" → Cria checkout session no Stripe
2. Usuário completa pagamento → Stripe processa pagamento
3. Stripe envia webhook → Nossa API recebe evento
4. API cria subscription → Insere na tabela subscriptions
5. Trigger SQL dispara → Atualiza etapa_funil de Lead para Trial/User
6. Usuário acessa dashboard → Vê conteúdo premium
\`\`\`

## Configuração Passo a Passo

### Passo 1: Verificar Estado Atual

Execute o script de diagnóstico para ver o estado atual:

\`\`\`sql
-- No Supabase SQL Editor, execute:
\i scripts/008_diagnostico_subscriptions.sql
\`\`\`

Isso mostrará:
- Se o trigger existe
- Quantas subscriptions existem
- Distribuição de etapas do funil
- Inconsistências entre subscriptions e etapas

### Passo 2: Corrigir Trigger (se necessário)

Se o diagnóstico mostrar problemas com o trigger, execute:

\`\`\`sql
-- No Supabase SQL Editor, execute:
\i scripts/007_fix_etapa_funil_trigger.sql
\`\`\`

Este script:
- Recria o trigger com logs melhorados
- Atualiza etapas dos usuários existentes
- Verifica a configuração

### Passo 3: Configurar Webhook no Stripe

#### 3.1. Acessar Dashboard do Stripe

1. Acesse [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Certifique-se de estar no modo correto (Test ou Live)
3. Vá em **Developers** → **Webhooks**

#### 3.2. Criar Endpoint

1. Clique em **Add endpoint**
2. Configure:
   - **Endpoint URL**: `https://SEU_DOMINIO.vercel.app/api/webhooks/stripe`
   - Substitua `SEU_DOMINIO` pelo domínio real da sua aplicação
   - Exemplo: `https://falazaplanding3.vercel.app/api/webhooks/stripe`

#### 3.3. Selecionar Eventos

Marque APENAS estes eventos (não marque todos):

- ✅ `checkout.session.completed` - Quando checkout é completado
- ✅ `customer.subscription.updated` - Quando subscription muda
- ✅ `customer.subscription.deleted` - Quando subscription é cancelada
- ✅ `invoice.payment_succeeded` - Pagamento bem-sucedido
- ✅ `invoice.payment_failed` - Pagamento falhou

#### 3.4. Obter Webhook Secret

1. Após criar, copie o **Signing secret** (começa com `whsec_`)
2. Adicione nas variáveis de ambiente da Vercel:
   - Vá em [vercel.com](https://vercel.com) → Seu projeto → Settings → Environment Variables
   - Adicione: `STRIPE_WEBHOOK_SECRET` = `whsec_...`
   - Importante: Adicione para Production, Preview e Development

#### 3.5. Fazer Redeploy

Após adicionar a variável de ambiente:
1. Vá em Deployments
2. Clique nos três pontos da última deployment
3. Clique em "Redeploy"

### Passo 4: Testar o Webhook

#### Opção A: Teste Rápido no Stripe Dashboard

1. No Stripe Dashboard, vá em **Developers** → **Webhooks**
2. Clique no webhook que você criou
3. Clique em **Send test webhook**
4. Selecione `checkout.session.completed`
5. Edite o JSON para incluir metadata:
\`\`\`json
{
  "metadata": {
    "userId": "SEU_USER_ID_AQUI",
    "planName": "Starter",
    "planPrice": "97"
  }
}
\`\`\`
6. Clique em **Send test webhook**

#### Opção B: Teste Real com Checkout

1. Acesse sua aplicação
2. Faça login
3. Vá para a página de assinatura
4. Use um cartão de teste do Stripe:
   - Número: `4242 4242 4242 4242`
   - Data: Qualquer data futura
   - CVC: Qualquer 3 dígitos
5. Complete o checkout

### Passo 5: Verificar Logs

#### 5.1. Logs da Vercel

1. Vá em [vercel.com](https://vercel.com) → Seu projeto → Logs
2. Filtre por `/api/webhooks/stripe`
3. Procure por logs que começam com `[v0]`

Logs esperados de sucesso:
\`\`\`
[v0] ========== STRIPE WEBHOOK RECEIVED ==========
[v0] ✅ Webhook signature verified successfully
[v0] Event Type: checkout.session.completed
[v0] 💳 CHECKOUT SESSION COMPLETED
[v0] ✅ Retrieved subscription from Stripe: sub_xxx
[v0] Creating subscription in database with data: {...}
[v0] ✅✅✅ SUBSCRIPTION CREATED SUCCESSFULLY ✅✅✅
[v0] ========== WEBHOOK PROCESSED SUCCESSFULLY ==========
\`\`\`

#### 5.2. Logs do Supabase

1. Vá no Supabase Dashboard → Logs → Postgres Logs
2. Procure por mensagens do trigger:
\`\`\`
Etapa funil atualizada para user_id xxx: Lead -> Trial (subscription status: trialing)
\`\`\`

### Passo 6: Verificar Banco de Dados

Execute estas queries no Supabase SQL Editor:

\`\`\`sql
-- Ver subscriptions criadas
SELECT 
  s.*,
  p.email,
  p.etapa_funil
FROM subscriptions s
JOIN profiles p ON s.user_id = p.id
ORDER BY s.created_at DESC
LIMIT 5;

-- Ver distribuição de etapas
SELECT 
  etapa_funil,
  COUNT(*) as total
FROM profiles
GROUP BY etapa_funil;
\`\`\`

## Troubleshooting

### Problema: Webhook não está sendo chamado

**Sintomas:**
- Checkout completa mas nenhum log aparece na Vercel
- Tabela subscriptions não é atualizada

**Soluções:**
1. Verifique se a URL do webhook está correta no Stripe
2. Verifique se o webhook está "Enabled" no Stripe Dashboard
3. Teste com "Send test webhook" no Stripe
4. Verifique se não há firewall bloqueando o Stripe

### Problema: Erro "Invalid signature"

**Sintomas:**
\`\`\`
[v0] ❌ Webhook signature verification failed
\`\`\`

**Soluções:**
1. Verifique se `STRIPE_WEBHOOK_SECRET` está correto
2. Certifique-se de usar o secret do ambiente correto (test vs live)
3. Copie o secret novamente do Stripe Dashboard
4. Faça redeploy após atualizar a variável

### Problema: Subscription criada mas etapa_funil não muda

**Sintomas:**
- Subscription aparece na tabela
- Usuário continua como "Lead"

**Soluções:**
1. Execute o script de diagnóstico:
\`\`\`sql
\i scripts/008_diagnostico_subscriptions.sql
\`\`\`

2. Se o trigger não existir, execute:
\`\`\`sql
\i scripts/007_fix_etapa_funil_trigger.sql
\`\`\`

3. Verifique os logs do Postgres no Supabase

4. Atualize manualmente se necessário:
\`\`\`sql
UPDATE profiles
SET etapa_funil = 'Trial'
WHERE id IN (
  SELECT user_id 
  FROM subscriptions 
  WHERE status = 'trialing'
);
\`\`\`

### Problema: Múltiplas subscriptions para o mesmo usuário

**Sintomas:**
- Tabela subscriptions tem várias linhas para o mesmo user_id

**Causa:**
- Webhook sendo chamado múltiplas vezes
- Checkout sendo completado múltiplas vezes

**Solução:**
O código já verifica se a subscription existe antes de criar. Se ainda assim houver duplicatas:

\`\`\`sql
-- Ver duplicatas
SELECT 
  user_id,
  COUNT(*) as total
FROM subscriptions
GROUP BY user_id
HAVING COUNT(*) > 1;

-- Manter apenas a mais recente
DELETE FROM subscriptions
WHERE id NOT IN (
  SELECT DISTINCT ON (user_id) id
  FROM subscriptions
  ORDER BY user_id, created_at DESC
);
\`\`\`

## Desenvolvimento Local

Para testar webhooks localmente:

### 1. Instalar Stripe CLI

\`\`\`bash
# macOS
brew install stripe/stripe-cli/stripe

# Windows
scoop install stripe

# Linux
# Baixe de https://github.com/stripe/stripe-cli/releases
\`\`\`

### 2. Login no Stripe

\`\`\`bash
stripe login
\`\`\`

### 3. Escutar Webhooks

\`\`\`bash
# Encaminhar eventos para localhost
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Copie o webhook secret que aparece (whsec_...)
# Adicione ao .env.local:
# STRIPE_WEBHOOK_SECRET=whsec_...
\`\`\`

### 4. Testar

Em outro terminal:

\`\`\`bash
# Disparar evento de teste
stripe trigger checkout.session.completed
\`\`\`

## Checklist Final

Antes de considerar a configuração completa, verifique:

- [ ] Webhook criado no Stripe Dashboard
- [ ] Eventos corretos selecionados
- [ ] `STRIPE_WEBHOOK_SECRET` adicionado na Vercel
- [ ] Redeploy feito após adicionar variável
- [ ] Script 007 executado no Supabase
- [ ] Teste de checkout realizado
- [ ] Logs da Vercel mostram webhook recebido
- [ ] Subscription criada na tabela
- [ ] Etapa_funil atualizada de Lead para Trial/User
- [ ] Usuário consegue acessar dashboard

## Próximos Passos

Após configurar tudo:

1. Monitore os logs por alguns dias
2. Verifique se novos usuários estão sendo criados corretamente
3. Configure alertas para erros de webhook
4. Documente qualquer comportamento inesperado

## Suporte

Se ainda houver problemas:

1. Execute o script de diagnóstico e compartilhe os resultados
2. Compartilhe os logs da Vercel (últimos 50 linhas)
3. Compartilhe os logs do Postgres no Supabase
4. Verifique se há erros no Stripe Dashboard → Developers → Events
