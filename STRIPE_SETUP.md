# Configuração do Stripe

## Produtos e Preços

Para que a integração com Stripe funcione corretamente, você precisa criar os produtos no Stripe Dashboard e atualizar os IDs no código.

### Passo 1: Criar Produtos no Stripe

1. Acesse o [Stripe Dashboard](https://dashboard.stripe.com)
2. Vá em **Products** → **Add Product**
3. Crie os seguintes produtos:

#### Produto 1: Starter
- **Nome**: FalaZap Starter
- **Descrição**: Para quem recebe poucos áudios por semana
- **Preço**: R$ 19,99 / mês
- **ID do Preço**: Copie o ID que começa com `price_...`

#### Produto 2: Pro
- **Nome**: FalaZap Pro
- **Descrição**: Para usuários que precisam de mais capacidade
- **Preço**: R$ 49,99 / mês
- **ID do Preço**: Copie o ID que começa com `price_...`

#### Produto 3: Business
- **Nome**: FalaZap Business
- **Descrição**: Solução completa para equipes e empresas
- **Preço**: R$ 99,99 / mês
- **ID do Preço**: Copie o ID que começa com `price_...`

### Passo 2: Configurar Trial Period

Para cada produto, configure:
- **Trial period**: 3 dias
- **Billing cycle**: Mensal

### Passo 3: Atualizar o Código

Depois de criar os produtos, você precisa atualizar o arquivo `app/actions/stripe.ts` com os IDs reais dos preços:

\`\`\`typescript
const priceIds: Record<string, string> = {
  starter: "price_XXXXXXXXXXXXXXXX", // Substitua pelo ID real
  pro: "price_XXXXXXXXXXXXXXXX",     // Substitua pelo ID real
  business: "price_XXXXXXXXXXXXXXXX", // Substitua pelo ID real
}
\`\`\`

### Passo 4: Configurar Webhook

1. No Stripe Dashboard, vá em **Developers** → **Webhooks**
2. Clique em **Add endpoint**
3. URL do endpoint: `https://seu-dominio.vercel.app/api/webhooks/stripe`
4. Selecione os eventos:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copie o **Signing secret** (começa com `whsec_...`)
6. Adicione como variável de ambiente `STRIPE_WEBHOOK_SECRET`

### Passo 5: Testar

1. Faça login na aplicação
2. Vá para a página de assinatura
3. Clique em "Começar grátis" ou "Assinar plano"
4. Complete o checkout de teste
5. Verifique se a subscription foi criada no banco de dados

## Modo de Teste

O Stripe tem dois modos:
- **Test mode**: Use cartões de teste (4242 4242 4242 4242)
- **Live mode**: Cartões reais e cobranças reais

Certifique-se de estar no modo correto antes de fazer testes!
