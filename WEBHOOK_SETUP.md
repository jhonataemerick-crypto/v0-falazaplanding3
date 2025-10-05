# Configuração do Webhook do Stripe

## Problema Identificado

Após o usuário completar o pagamento no Stripe, a tabela `subscriptions` não está sendo atualizada. Isso acontece porque o webhook do Stripe não está configurado ou não está funcionando corretamente.

## Como Funciona

1. Usuário completa o checkout no Stripe
2. Stripe envia um evento `checkout.session.completed` para o webhook
3. Nossa aplicação recebe o evento e cria/atualiza a subscription no banco de dados
4. Usuário pode acessar o dashboard com a subscription ativa

## Configuração do Webhook no Stripe

### Passo 1: Acessar o Dashboard do Stripe

1. Acesse [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Vá em **Developers** → **Webhooks**

### Passo 2: Criar um Novo Webhook

1. Clique em **Add endpoint**
2. Configure o endpoint:
   - **Endpoint URL**: `https://seu-dominio.vercel.app/api/webhooks/stripe`
   - Para desenvolvimento local: Use [Stripe CLI](https://stripe.com/docs/stripe-cli) para testar

### Passo 3: Selecionar Eventos

Selecione os seguintes eventos para escutar:

- ✅ `checkout.session.completed` - Quando o checkout é completado
- ✅ `customer.subscription.updated` - Quando a subscription é atualizada
- ✅ `customer.subscription.deleted` - Quando a subscription é cancelada
- ✅ `invoice.payment_succeeded` - Quando o pagamento é bem-sucedido
- ✅ `invoice.payment_failed` - Quando o pagamento falha

### Passo 4: Obter o Webhook Secret

1. Após criar o webhook, copie o **Signing secret**
2. Adicione ao arquivo `.env` ou nas variáveis de ambiente da Vercel:
   \`\`\`
   STRIPE_WEBHOOK_SECRET=whsec_...
   \`\`\`

### Passo 5: Testar o Webhook

#### Opção 1: Usar Stripe CLI (Desenvolvimento Local)

\`\`\`bash
# Instalar Stripe CLI
brew install stripe/stripe-cli/stripe

# Login no Stripe
stripe login

# Escutar eventos e encaminhar para localhost
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Em outro terminal, fazer um teste
stripe trigger checkout.session.completed
\`\`\`

#### Opção 2: Testar em Produção

1. Vá em **Developers** → **Webhooks** no Stripe Dashboard
2. Clique no webhook que você criou
3. Clique em **Send test webhook**
4. Selecione `checkout.session.completed`
5. Clique em **Send test webhook**

### Passo 6: Verificar Logs

Após enviar um evento de teste, verifique:

1. **Logs da Vercel**: Vá em [vercel.com](https://vercel.com) → Seu projeto → Logs
2. Procure por logs que começam com `[v0]`
3. Você deve ver:
   \`\`\`
   [v0] Webhook received - starting processing
   [v0] Received Stripe webhook event: checkout.session.completed
   [v0] ✅ Subscription created successfully in database for user: ...
   \`\`\`

## Troubleshooting

### Webhook não está sendo chamado

1. Verifique se a URL do webhook está correta
2. Verifique se o webhook está ativo no Stripe Dashboard
3. Verifique se os eventos corretos estão selecionados

### Erro "Invalid signature"

1. Verifique se o `STRIPE_WEBHOOK_SECRET` está correto
2. Certifique-se de que está usando o secret do webhook correto (test vs production)

### Erro ao criar subscription no banco

1. Execute o script SQL `005_add_subscription_columns.sql` para adicionar as colunas faltantes
2. Verifique se as políticas RLS estão configuradas corretamente
3. Verifique os logs para ver o erro específico

## Verificação Rápida

Para verificar se o webhook está funcionando:

1. Faça um checkout de teste
2. Verifique os logs da Vercel
3. Verifique a tabela `subscriptions` no Supabase:
   \`\`\`sql
   SELECT * FROM subscriptions ORDER BY created_at DESC LIMIT 5;
   \`\`\`

## Ambiente de Desenvolvimento vs Produção

### Desenvolvimento

- Use Stripe CLI para encaminhar eventos para localhost
- Use chaves de teste do Stripe (`sk_test_...`)
- Use webhook secret de teste

### Produção

- Configure o webhook no Stripe Dashboard com a URL de produção
- Use chaves de produção do Stripe (`sk_live_...`)
- Use webhook secret de produção

## Próximos Passos

Após configurar o webhook:

1. Execute o script SQL `005_add_subscription_columns.sql`
2. Configure o webhook no Stripe Dashboard
3. Adicione o `STRIPE_WEBHOOK_SECRET` nas variáveis de ambiente
4. Faça um teste de checkout
5. Verifique se a subscription foi criada no banco de dados
