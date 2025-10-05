# Schema do Banco de Dados

Este documento descreve a estrutura completa do banco de dados do FalaZap.

## Tabelas Principais

### 1. profiles

Armazena informações dos perfis de usuários.

\`\`\`sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

**Colunas:**
- `id` (UUID, PK): ID do usuário (referência para auth.users)
- `email` (TEXT): Email do usuário
- `name` (TEXT): Nome do usuário
- `created_at` (TIMESTAMPTZ): Data de criação
- `updated_at` (TIMESTAMPTZ): Data da última atualização

**Índices:**
- PRIMARY KEY em `id`
- INDEX em `email`

**RLS (Row Level Security):**
- Usuários podem ler apenas seu próprio perfil
- Usuários podem atualizar apenas seu próprio perfil

**Trigger:**
- `create_profile_on_signup`: Cria automaticamente um perfil quando um usuário se registra

---

### 2. subscriptions

Armazena informações sobre as assinaturas dos usuários.

\`\`\`sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  plan_name TEXT NOT NULL,
  plan_price NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  trial_ends_at TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

**Colunas:**
- `id` (UUID, PK): ID único da subscription
- `user_id` (UUID, UNIQUE, FK): ID do usuário (um usuário = uma subscription)
- `stripe_customer_id` (TEXT): ID do cliente no Stripe
- `stripe_subscription_id` (TEXT, UNIQUE): ID da subscription no Stripe
- `plan_name` (TEXT): Nome do plano (Starter, Pro, Business)
- `plan_price` (NUMERIC): Preço do plano
- `status` (TEXT): Status da subscription (active, trialing, past_due, canceled)
- `trial_ends_at` (TIMESTAMPTZ): Data de fim do período de teste
- `current_period_start` (TIMESTAMPTZ): Início do período atual de cobrança
- `current_period_end` (TIMESTAMPTZ): Fim do período atual de cobrança
- `cancel_at_period_end` (BOOLEAN): Se a subscription será cancelada no fim do período
- `created_at` (TIMESTAMPTZ): Data de criação
- `updated_at` (TIMESTAMPTZ): Data da última atualização

**Índices:**
- PRIMARY KEY em `id`
- UNIQUE em `user_id`
- UNIQUE em `stripe_subscription_id`
- INDEX em `stripe_customer_id`
- INDEX em `status`

**RLS (Row Level Security):**
- Usuários podem ler apenas sua própria subscription
- Apenas o sistema (service_role) pode criar/atualizar subscriptions

---

### 3. devices

Armazena informações sobre os dispositivos WhatsApp conectados.

\`\`\`sql
CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_number TEXT,
  country_code TEXT,
  status TEXT DEFAULT 'disconnected',
  last_sync TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

**Colunas:**
- `id` (UUID, PK): ID único do device
- `user_id` (UUID, FK): ID do usuário dono do device
- `phone_number` (TEXT): Número de telefone do WhatsApp
- `country_code` (TEXT): Código do país (+55, +1, etc)
- `status` (TEXT): Status da conexão (connected, disconnected, connecting)
- `last_sync` (TIMESTAMPTZ): Data da última sincronização
- `created_at` (TIMESTAMPTZ): Data de criação
- `updated_at` (TIMESTAMPTZ): Data da última atualização

**Índices:**
- PRIMARY KEY em `id`
- INDEX em `user_id`
- INDEX em `status`

**RLS (Row Level Security):**
- Usuários podem ler apenas seus próprios devices
- Usuários podem criar/atualizar apenas seus próprios devices

---

### 4. verification_codes

Armazena códigos de verificação para confirmação de email.

\`\`\`sql
CREATE TABLE verification_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

**Colunas:**
- `id` (UUID, PK): ID único do código
- `email` (TEXT): Email para o qual o código foi enviado
- `code` (TEXT): Código de verificação
- `expires_at` (TIMESTAMPTZ): Data de expiração do código
- `verified` (BOOLEAN): Se o código já foi usado
- `created_at` (TIMESTAMPTZ): Data de criação

**Índices:**
- PRIMARY KEY em `id`
- INDEX em `email`
- INDEX em `code`

**RLS (Row Level Security):**
- Acesso público para leitura (necessário para verificação)
- Apenas o sistema pode criar códigos

---

## Tabelas de Webhook (Evolution API)

Estas tabelas armazenam dados dos webhooks da Evolution API para integração com WhatsApp.

### webhook_logs
Logs gerais de webhooks recebidos.

### qrcode_events
Eventos de QR Code para conexão de dispositivos.

### global_messages
Mensagens globais do sistema.

### monitoring_events
Eventos de monitoramento do sistema.

---

## Diagrama de Relacionamentos

\`\`\`
auth.users (Supabase Auth)
    |
    |-- profiles (1:1)
    |
    |-- subscriptions (1:1)
    |
    |-- devices (1:N)
\`\`\`

**Relacionamentos:**
- Um usuário tem um perfil (1:1)
- Um usuário tem uma subscription (1:1)
- Um usuário pode ter múltiplos devices (1:N)

---

## Políticas de Segurança (RLS)

Todas as tabelas principais têm Row Level Security (RLS) habilitado para garantir que:
- Usuários só podem acessar seus próprios dados
- Operações críticas (criar subscriptions) só podem ser feitas pelo sistema
- Dados sensíveis são protegidos

Para mais detalhes sobre RLS, veja o script `003_enable_rls.sql`.
