# Histórico de Migrações do Banco de Dados

Este documento lista todas as migrações aplicadas ao banco de dados em ordem cronológica.

## Scripts SQL

Execute os scripts na ordem listada abaixo:

### 001_create_tables.sql
**Data:** Inicial
**Descrição:** Criação das tabelas principais do sistema

**Tabelas criadas:**
- `profiles` - Perfis de usuários
- `subscriptions` - Assinaturas e planos
- `devices` - Dispositivos WhatsApp conectados
- `verification_codes` - Códigos de verificação de email

**Índices criados:**
- Índices em foreign keys para performance
- Índices em campos de busca frequente (email, status, etc)

---

### 002_create_profile_trigger.sql
**Data:** Inicial
**Descrição:** Trigger para criar perfil automaticamente no signup

**Função criada:**
- `handle_new_user()` - Função que cria o perfil quando um usuário se registra

**Trigger criado:**
- `on_auth_user_created` - Trigger que executa após INSERT em auth.users

**Comportamento:**
- Quando um usuário se registra via Supabase Auth
- O trigger automaticamente cria um registro na tabela `profiles`
- Copia o email do auth.users para o profile

---

### 003_enable_rls.sql
**Data:** Inicial
**Descrição:** Habilita Row Level Security e cria políticas de segurança

**Políticas criadas:**

**profiles:**
- `Users can view own profile` - Usuários podem ver seu próprio perfil
- `Users can update own profile` - Usuários podem atualizar seu próprio perfil

**subscriptions:**
- `Users can view own subscription` - Usuários podem ver sua própria subscription
- `Service role can insert subscriptions` - Apenas service_role pode criar subscriptions
- `Service role can update subscriptions` - Apenas service_role pode atualizar subscriptions

**devices:**
- `Users can view own devices` - Usuários podem ver seus próprios devices
- `Users can insert own devices` - Usuários podem criar seus próprios devices
- `Users can update own devices` - Usuários podem atualizar seus próprios devices
- `Users can delete own devices` - Usuários podem deletar seus próprios devices

**verification_codes:**
- `Anyone can read verification codes` - Acesso público para leitura (necessário para verificação)
- `Service role can insert codes` - Apenas service_role pode criar códigos

---

### 004_create_updated_at_trigger.sql
**Data:** Inicial
**Descrição:** Trigger para atualizar automaticamente o campo updated_at

**Função criada:**
- `update_updated_at_column()` - Atualiza updated_at para NOW()

**Triggers criados:**
- `update_profiles_updated_at` - Trigger na tabela profiles
- `update_subscriptions_updated_at` - Trigger na tabela subscriptions
- `update_devices_updated_at` - Trigger na tabela devices

**Comportamento:**
- Sempre que um registro é atualizado (UPDATE)
- O campo `updated_at` é automaticamente atualizado para a data/hora atual

---

### 005_add_subscription_columns.sql
**Data:** Correção crítica
**Descrição:** Adiciona colunas faltantes na tabela subscriptions

**Problema identificado:**
- O webhook do Stripe estava tentando inserir dados em colunas que não existiam
- Causava erro "column does not exist" ao processar pagamentos

**Colunas adicionadas:**
- `stripe_customer_id` (TEXT) - ID do cliente no Stripe
- `stripe_subscription_id` (TEXT, UNIQUE) - ID da subscription no Stripe
- `current_period_start` (TIMESTAMPTZ) - Início do período de cobrança
- `current_period_end` (TIMESTAMPTZ) - Fim do período de cobrança
- `cancel_at_period_end` (BOOLEAN) - Flag de cancelamento

**Índices adicionados:**
- INDEX em `stripe_customer_id` - Para buscar subscriptions por cliente
- INDEX em `stripe_subscription_id` - Para buscar subscriptions por ID do Stripe

**Impacto:**
- Resolve o problema de subscriptions não sendo criadas após pagamento
- Permite rastreamento completo do ciclo de vida da subscription
- Melhora performance de queries relacionadas ao Stripe

---

### 006_add_etapa_funil.sql
**Data:** Janeiro 2025
**Descrição:** Adiciona coluna etapa_funil para rastreamento do funil de vendas

**Problema identificado:**
- Necessidade de segmentar usuários por estágio no funil
- Dificuldade em analisar conversão entre etapas
- Falta de automação para marketing baseado em estágio

**Tipo ENUM criado:**
\`\`\`sql
CREATE TYPE etapa_funil_type AS ENUM ('Lead', 'Trial', 'User', 'Churn');
\`\`\`

**Coluna adicionada:**
- `etapa_funil` (etapa_funil_type) - Estágio do usuário no funil
  - Default: 'Lead'
  - NOT NULL

**Índice adicionado:**
- INDEX em `etapa_funil` - Para queries de segmentação rápidas

**Função criada:**
- `update_etapa_funil()` - Atualiza etapa_funil baseado na subscription

**Trigger criado:**
- `update_etapa_funil_trigger` - Executa após INSERT/UPDATE em subscriptions

**Lógica de Transição:**
- Lead → Trial: Quando cria subscription com trial
- Trial → User: Quando trial termina e continua pagando
- Trial → Churn: Quando cancela durante trial
- User → Churn: Quando cancela ou pagamento falha
- Lead → User: Se assinar direto sem trial

**Impacto:**
- Facilita segmentação de usuários para marketing
- Permite análise de conversão em cada etapa
- Simplifica queries para dashboards e relatórios
- Útil para automações (emails, notificações)

**Queries úteis:**
\`\`\`sql
-- Contar usuários por etapa
SELECT etapa_funil, COUNT(*) FROM profiles GROUP BY etapa_funil;

-- Taxa de conversão Lead → Trial
SELECT 
  (COUNT(*) FILTER (WHERE etapa_funil IN ('Trial', 'User')) * 100.0 / 
   COUNT(*) FILTER (WHERE etapa_funil != 'Lead')) as taxa_conversao
FROM profiles;
\`\`\`

---

## Como Executar as Migrações

### Opção 1: Via v0 UI
1. Vá para Project Settings (ícone de engrenagem no topo direito)
2. Clique em "Integrations"
3. Selecione "Supabase"
4. Clique em "Run Script"
5. Execute cada script na ordem (001 → 006)

### Opção 2: Via Supabase Dashboard
1. Acesse o Supabase Dashboard
2. Vá para "SQL Editor"
3. Cole o conteúdo de cada script
4. Execute na ordem (001 → 006)

### Opção 3: Via CLI
\`\`\`bash
# Instale o Supabase CLI
npm install -g supabase

# Execute cada script
supabase db execute --file scripts/001_create_tables.sql
supabase db execute --file scripts/002_create_profile_trigger.sql
supabase db execute --file scripts/003_enable_rls.sql
supabase db execute --file scripts/004_create_updated_at_trigger.sql
supabase db execute --file scripts/005_add_subscription_columns.sql
supabase db execute --file scripts/006_add_etapa_funil.sql
\`\`\`

---

## Verificação

Após executar todas as migrações, verifique se tudo está correto:

\`\`\`sql
-- Verificar se todas as tabelas existem
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'subscriptions', 'devices', 'verification_codes');

-- Verificar se RLS está habilitado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'subscriptions', 'devices', 'verification_codes');

-- Verificar colunas da tabela subscriptions
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'subscriptions' 
AND table_schema = 'public';

-- Verificar coluna etapa_funil na tabela profiles
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public' 
AND column_name = 'etapa_funil';
\`\`\`

Todas as queries acima devem retornar os resultados esperados.
