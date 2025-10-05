# Relacionamentos entre Tabelas

Este documento descreve os relacionamentos entre as tabelas do banco de dados.

## Diagrama ER (Entity Relationship)

\`\`\`
┌─────────────────────┐
│   auth.users        │
│  (Supabase Auth)    │
│                     │
│  - id (PK)          │
│  - email            │
│  - encrypted_pass   │
│  - email_confirmed  │
└──────────┬──────────┘
           │
           │ 1:1
           │
┌──────────▼──────────┐
│     profiles        │
│                     │
│  - id (PK, FK)      │
│  - email            │
│  - name             │
│  - created_at       │
│  - updated_at       │
└─────────────────────┘

┌─────────────────────┐
│   auth.users        │
└──────────┬──────────┘
           │
           │ 1:1
           │
┌──────────▼──────────┐
│   subscriptions     │
│                     │
│  - id (PK)          │
│  - user_id (FK)     │◄─── UNIQUE (um usuário = uma subscription)
│  - stripe_cust_id   │
│  - stripe_sub_id    │
│  - plan_name        │
│  - plan_price       │
│  - status           │
│  - trial_ends_at    │
│  - period_start     │
│  - period_end       │
│  - cancel_at_end    │
└─────────────────────┘

┌─────────────────────┐
│   auth.users        │
└──────────┬──────────┘
           │
           │ 1:N
           │
┌──────────▼──────────┐
│      devices        │
│                     │
│  - id (PK)          │
│  - user_id (FK)     │◄─── Múltiplos devices por usuário
│  - phone_number     │
│  - country_code     │
│  - status           │
│  - last_sync        │
└─────────────────────┘
\`\`\`

## Detalhes dos Relacionamentos

### 1. auth.users → profiles (1:1)

**Tipo:** One-to-One (Um para Um)

**Descrição:**
- Cada usuário autenticado tem exatamente um perfil
- O perfil é criado automaticamente quando o usuário se registra
- O ID do perfil é o mesmo ID do usuário (auth.users.id)

**Implementação:**
\`\`\`sql
profiles.id REFERENCES auth.users(id) ON DELETE CASCADE
\`\`\`

**Trigger:**
\`\`\`sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
\`\`\`

**Comportamento:**
- Quando um usuário é deletado, o perfil é deletado automaticamente (CASCADE)
- O trigger garante que o perfil é criado imediatamente após o registro

---

### 2. auth.users → subscriptions (1:1)

**Tipo:** One-to-One (Um para Um)

**Descrição:**
- Cada usuário pode ter no máximo uma subscription ativa
- A subscription é criada quando o usuário completa o pagamento no Stripe
- O relacionamento é garantido pela constraint UNIQUE em user_id

**Implementação:**
\`\`\`sql
subscriptions.user_id REFERENCES auth.users(id) ON DELETE CASCADE
ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_user_id_key UNIQUE (user_id);
\`\`\`

**Comportamento:**
- Quando um usuário é deletado, a subscription é deletada automaticamente (CASCADE)
- Não é possível criar duas subscriptions para o mesmo usuário (UNIQUE)
- Se o usuário mudar de plano, a subscription existente é atualizada (não cria nova)

---

### 3. auth.users → devices (1:N)

**Tipo:** One-to-Many (Um para Muitos)

**Descrição:**
- Cada usuário pode ter múltiplos dispositivos WhatsApp conectados
- Cada device pertence a exatamente um usuário
- Não há limite de devices por usuário (depende do plano)

**Implementação:**
\`\`\`sql
devices.user_id REFERENCES auth.users(id) ON DELETE CASCADE
\`\`\`

**Comportamento:**
- Quando um usuário é deletado, todos os seus devices são deletados automaticamente (CASCADE)
- Usuários podem adicionar/remover devices livremente
- O status de cada device é independente

---

## Integridade Referencial

### Cascading Deletes

Todas as tabelas usam `ON DELETE CASCADE` para garantir integridade:

\`\`\`sql
-- Se um usuário é deletado:
DELETE FROM auth.users WHERE id = 'user-uuid';

-- Automaticamente deleta:
-- 1. O perfil do usuário (profiles)
-- 2. A subscription do usuário (subscriptions)
-- 3. Todos os devices do usuário (devices)
\`\`\`

### Constraints de Unicidade

**subscriptions.user_id (UNIQUE):**
- Garante que um usuário tenha apenas uma subscription
- Previne duplicação de assinaturas

**subscriptions.stripe_subscription_id (UNIQUE):**
- Garante que cada subscription do Stripe seja única no sistema
- Previne processamento duplicado de webhooks

---

## Queries Comuns

### Buscar todos os dados de um usuário

\`\`\`sql
-- Perfil + Subscription + Devices
SELECT 
  u.id,
  u.email,
  p.name,
  s.plan_name,
  s.status as subscription_status,
  COUNT(d.id) as total_devices
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
LEFT JOIN subscriptions s ON s.user_id = u.id
LEFT JOIN devices d ON d.user_id = u.id
WHERE u.id = 'user-uuid'
GROUP BY u.id, u.email, p.name, s.plan_name, s.status;
\`\`\`

### Buscar usuários com subscription ativa

\`\`\`sql
SELECT 
  u.id,
  u.email,
  s.plan_name,
  s.current_period_end
FROM auth.users u
INNER JOIN subscriptions s ON s.user_id = u.id
WHERE s.status = 'active'
AND s.current_period_end > NOW();
\`\`\`

### Buscar devices de um usuário

\`\`\`sql
SELECT 
  d.id,
  d.phone_number,
  d.country_code,
  d.status,
  d.last_sync
FROM devices d
WHERE d.user_id = 'user-uuid'
ORDER BY d.created_at DESC;
\`\`\`

---

## Considerações de Performance

### Índices Importantes

\`\`\`sql
-- Buscar subscription por user_id (muito frequente)
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);

-- Buscar subscription por stripe_subscription_id (webhooks)
CREATE INDEX idx_subscriptions_stripe_sub_id ON subscriptions(stripe_subscription_id);

-- Buscar devices por user_id (dashboard)
CREATE INDEX idx_devices_user_id ON devices(user_id);

-- Buscar devices por status (monitoramento)
CREATE INDEX idx_devices_status ON devices(status);
\`\`\`

Estes índices garantem que as queries mais comuns sejam rápidas mesmo com milhares de registros.
