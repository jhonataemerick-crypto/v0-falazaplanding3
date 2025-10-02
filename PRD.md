# PRD - FalaZap: Plataforma de Atendimento WhatsApp com IA

## 📋 Índice

1. [Visão Geral do Produto](#visão-geral-do-produto)
2. [Objetivos e Metas](#objetivos-e-metas)
3. [Personas e Casos de Uso](#personas-e-casos-de-uso)
4. [Arquitetura da Solução](#arquitetura-da-solução)
5. [Fluxos de Usuário](#fluxos-de-usuário)
6. [Schemas de Banco de Dados](#schemas-de-banco-de-dados)
7. [Stack Tecnológico](#stack-tecnológico)
8. [Roadmap de Implementação](#roadmap-de-implementação)
9. [Métricas de Sucesso](#métricas-de-sucesso)

---

## 🎯 Visão Geral do Produto

### O que é FalaZap?

FalaZap é uma plataforma SaaS que permite empresas brasileiras automatizarem seu atendimento no WhatsApp usando Inteligência Artificial. A solução oferece respostas automáticas inteligentes, gestão de múltiplos números, analytics e integrações com CRM.

### Proposta de Valor

- **Para Pequenas Empresas**: Atendimento 24/7 sem contratar equipe adicional
- **Para Empresas em Crescimento**: Escala de atendimento com qualidade e personalização
- **Para Grandes Empresas**: Automação completa com integrações customizadas

### Diferencial Competitivo

1. IA treinada especificamente para português brasileiro
2. Interface simples e intuitiva (sem curva de aprendizado)
3. Preços acessíveis para o mercado brasileiro
4. Integração nativa com WhatsApp Business API

---

## 🎯 Objetivos e Metas

### Objetivos de Negócio

1. **Curto Prazo (3 meses)**
   - Alcançar 100 usuários ativos
   - Taxa de conversão de trial para pago: 20%
   - NPS acima de 50

2. **Médio Prazo (6 meses)**
   - 500 usuários ativos
   - MRR de R$ 50.000
   - Churn rate abaixo de 5%

3. **Longo Prazo (12 meses)**
   - 2.000 usuários ativos
   - MRR de R$ 200.000
   - Expansão para outros países da América Latina

### Objetivos Técnicos

1. Uptime de 99.9%
2. Tempo de resposta da IA < 2 segundos
3. Suporte a 10.000 mensagens simultâneas
4. Integração com 5+ CRMs populares

---

## 👥 Personas e Casos de Uso

### Persona 1: Maria - Dona de E-commerce

**Perfil:**
- 35 anos, dona de loja online de roupas
- Recebe 200+ mensagens/dia no WhatsApp
- Não tem equipe de atendimento
- Orçamento limitado

**Necessidades:**
- Responder perguntas sobre produtos automaticamente
- Enviar link de pagamento
- Confirmar pedidos
- Atender fora do horário comercial

**Caso de Uso:**
Cliente pergunta "Tem essa blusa no tamanho M?" → IA consulta estoque → Responde automaticamente → Envia link de compra

---

### Persona 2: João - Gerente de Vendas

**Perfil:**
- 42 anos, gerente de equipe de vendas (10 pessoas)
- Empresa de serviços B2B
- Precisa de métricas e controle
- Orçamento médio

**Necessidades:**
- Qualificar leads automaticamente
- Distribuir conversas para vendedores
- Acompanhar métricas de atendimento
- Integrar com CRM (RD Station, HubSpot)

**Caso de Uso:**
Lead entra em contato → IA qualifica (orçamento, urgência) → Distribui para vendedor certo → Registra no CRM

---

### Persona 3: Ana - Diretora de Atendimento

**Perfil:**
- 38 anos, diretora de CS em empresa de tecnologia
- Gerencia 50+ atendentes
- Precisa de automação em escala
- Orçamento alto

**Necessidades:**
- Automação de perguntas frequentes
- Roteamento inteligente de conversas
- Analytics avançado
- Integrações customizadas
- SLA garantido

**Caso de Uso:**
Cliente com problema técnico → IA identifica tipo de problema → Roteia para especialista → Registra ticket → Acompanha resolução

---

## 🏗️ Arquitetura da Solução

### Diagrama de Arquitetura

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  Next.js 15 + React + TypeScript + Tailwind CSS             │
│  - Landing Page                                              │
│  - Dashboard                                                 │
│  - Configurações                                             │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                     API LAYER                                │
│  Next.js API Routes + Server Actions                         │
│  - Autenticação (Supabase Auth)                             │
│  - Gestão de Dispositivos                                   │
│  - Gestão de Assinaturas (Stripe)                           │
│  - Webhooks (Stripe, WhatsApp)                              │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                            │
│  Supabase (PostgreSQL)                                       │
│  - profiles                                                  │
│  - devices                                                   │
│  - subscriptions                                             │
│  - verification_codes                                        │
│  - messages (futuro)                                         │
│  - conversations (futuro)                                    │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                 EXTERNAL SERVICES                            │
│  - WhatsApp Business API                                     │
│  - OpenAI / Anthropic (IA)                                   │
│  - Stripe (Pagamentos)                                       │
│  - Resend (Emails)                                           │
│  - CRMs (RD Station, HubSpot, etc)                          │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### Componentes Principais

#### 1. Frontend (Next.js)
- **Landing Page**: Marketing e conversão
- **Dashboard**: Gestão de dispositivos e mensagens
- **Configurações**: Perfil, assinatura, integrações

#### 2. Backend (Next.js API Routes)
- **Autenticação**: Supabase Auth (email/senha)
- **Gestão de Dispositivos**: CRUD de números WhatsApp
- **Pagamentos**: Integração com Stripe
- **Webhooks**: Processamento de eventos

#### 3. Banco de Dados (Supabase)
- **PostgreSQL**: Dados estruturados
- **Row Level Security**: Segurança por usuário
- **Realtime**: Atualizações em tempo real

#### 4. Serviços Externos
- **WhatsApp Business API**: Envio/recebimento de mensagens
- **OpenAI**: Processamento de linguagem natural
- **Stripe**: Processamento de pagamentos
- **Resend**: Envio de emails transacionais

---

## 🔄 Fluxos de Usuário

### Fluxo 1: Cadastro e Onboarding

\`\`\`
┌─────────────┐
│   Landing   │
│    Page     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Signup    │
│   (Email)   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Verificar  │
│    Email    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Escolher   │
│    Plano    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Pagamento  │
│   (Stripe)  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Dashboard  │
│  (Conectar  │
│  WhatsApp)  │
└─────────────┘
\`\`\`

**Detalhamento:**

1. **Landing Page**
   - Usuário navega pelas seções
   - Clica em "Começar Grátis" ou "Começar Teste Grátis"

2. **Signup**
   - Preenche email e senha
   - Sistema cria conta no Supabase Auth
   - Trigger automático cria profile na tabela profiles

3. **Verificação de Email**
   - Supabase envia email de confirmação
   - Usuário clica no link
   - Conta é ativada

4. **Escolha de Plano**
   - Usuário visualiza planos (Gratuito, Pro, Enterprise)
   - Seleciona plano desejado
   - Plano Gratuito: vai direto para dashboard
   - Plano Pro: vai para pagamento

5. **Pagamento (Stripe)**
   - Stripe Embedded Checkout
   - Usuário preenche dados do cartão
   - Webhook do Stripe confirma pagamento
   - Sistema cria registro na tabela subscriptions

6. **Dashboard**
   - Usuário vê tela de boas-vindas
   - Botão para conectar primeiro número WhatsApp
   - Modal de conexão com QR Code

---

### Fluxo 2: Conexão de Dispositivo WhatsApp

\`\`\`
┌─────────────┐
│  Dashboard  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Clicar    │
│  "Conectar  │
│  WhatsApp"  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Modal    │
│  Inserir    │
│   Número    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Sistema   │
│    Gera     │
│   QR Code   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Usuário   │
│   Escaneia  │
│   QR Code   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  WhatsApp   │
│   Conecta   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Status    │
│   Muda p/   │
│   "active"  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Dashboard  │
│   Atualiza  │
└─────────────┘
\`\`\`

**Detalhamento:**

1. **Dashboard**
   - Usuário vê lista de dispositivos (vazia inicialmente)
   - Botão "Conectar Novo Número"

2. **Modal de Conexão**
   - Usuário insere número com código do país
   - Valida formato do número
   - Cria registro na tabela devices com status "pending"

3. **Geração de QR Code**
   - Sistema chama WhatsApp Business API
   - Gera QR Code único para o número
   - Exibe QR Code no modal

4. **Escaneamento**
   - Usuário abre WhatsApp no celular
   - Vai em Dispositivos Conectados
   - Escaneia QR Code

5. **Conexão**
   - WhatsApp Business API confirma conexão
   - Webhook atualiza status para "active"
   - Dashboard atualiza em tempo real (Supabase Realtime)

6. **Dashboard Atualizado**
   - Dispositivo aparece como "Conectado"
   - Usuário pode começar a receber mensagens

---

### Fluxo 3: Atendimento Automático com IA

\`\`\`
┌─────────────┐
│   Cliente   │
│   Envia     │
│  Mensagem   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  WhatsApp   │
│     API     │
│   Recebe    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Webhook   │
│  Processa   │
│  Mensagem   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Salva     │
│  Mensagem   │
│     no      │
│    Banco    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│     IA      │
│  Analisa    │
│  Contexto   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│     IA      │
│    Gera     │
│  Resposta   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Envia     │
│  Resposta   │
│     via     │
│  WhatsApp   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Cliente   │
│   Recebe    │
│  Resposta   │
└─────────────┘
\`\`\`

**Detalhamento:**

1. **Cliente Envia Mensagem**
   - Cliente envia mensagem para número conectado
   - Exemplo: "Quanto custa o plano Pro?"

2. **WhatsApp API Recebe**
   - WhatsApp Business API recebe mensagem
   - Envia webhook para nosso servidor

3. **Webhook Processa**
   - API route /api/webhooks/whatsapp recebe evento
   - Valida autenticidade do webhook
   - Extrai dados da mensagem

4. **Salva no Banco**
   - Cria registro na tabela messages
   - Atualiza ou cria conversation
   - Registra timestamp

5. **IA Analisa Contexto**
   - Busca histórico da conversa
   - Busca informações do cliente
   - Identifica intenção da mensagem

6. **IA Gera Resposta**
   - Usa OpenAI/Anthropic para gerar resposta
   - Aplica tom de voz da marca
   - Inclui informações relevantes

7. **Envia Resposta**
   - Chama WhatsApp Business API
   - Envia mensagem para cliente
   - Salva resposta no banco

8. **Cliente Recebe**
   - Cliente recebe resposta instantânea
   - Pode continuar a conversa

---

### Fluxo 4: Gestão de Assinatura

\`\`\`
┌─────────────┐
│  Dashboard  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Página    │
│    Conta    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Seção     │
│ Assinatura  │
└──────┬──────┘
       │
       ├─────────────┐
       │             │
       ▼             ▼
┌─────────────┐ ┌─────────────┐
│   Upgrade   │ │  Cancelar   │
│    Plano    │ │ Assinatura  │
└──────┬──────┘ └──────┬──────┘
       │             │
       ▼             ▼
┌─────────────┐ ┌─────────────┐
│   Stripe    │ │   Stripe    │
│  Checkout   │ │   Portal    │
└──────┬──────┘ └──────┬──────┘
       │             │
       ▼             ▼
┌─────────────┐ ┌─────────────┐
│   Webhook   │ │   Webhook   │
│  Atualiza   │ │  Atualiza   │
│    Banco    │ │    Banco    │
└──────┬──────┘ └──────┬──────┘
       │             │
       └──────┬──────┘
              ▼
       ┌─────────────┐
       │  Dashboard  │
       │  Atualiza   │
       └─────────────┘
\`\`\`

**Detalhamento:**

**Upgrade de Plano:**
1. Usuário vai em Conta → Assinatura
2. Clica em "Fazer Upgrade"
3. Redirecionado para Stripe Checkout
4. Completa pagamento
5. Webhook atualiza subscription no banco
6. Dashboard reflete novo plano

**Cancelamento:**
1. Usuário clica em "Cancelar Assinatura"
2. Redirecionado para Stripe Customer Portal
3. Confirma cancelamento
4. Webhook marca cancel_at_period_end = true
5. Assinatura continua até fim do período
6. Dashboard mostra aviso de cancelamento

---

## 🗄️ Schemas de Banco de Dados

### Diagrama ER (Entity Relationship)

\`\`\`
┌─────────────────────┐
│      profiles       │
├─────────────────────┤
│ id (PK)             │◄─────┐
│ email               │      │
│ name                │      │
│ phone               │      │
│ company             │      │
│ created_at          │      │
│ updated_at          │      │
└─────────────────────┘      │
                             │
                             │
┌─────────────────────┐      │
│      devices        │      │
├─────────────────────┤      │
│ id (PK)             │      │
│ user_id (FK)        │──────┘
│ phone_number        │
│ country_code        │
│ status              │
│ last_sync           │
│ created_at          │
│ updated_at          │
└─────────────────────┘
         │
         │
         │
┌─────────────────────┐      ┌─────────────────────┐
│   subscriptions     │      │ verification_codes  │
├─────────────────────┤      ├─────────────────────┤
│ id (PK)             │      │ id (PK)             │
│ user_id (FK)        │──────┤ user_id (FK)        │
│ stripe_customer_id  │      │ code                │
│ stripe_sub_id       │      │ type                │
│ plan_name           │      │ expires_at          │
│ plan_price          │      │ used                │
│ status              │      │ created_at          │
│ trial_ends_at       │      └─────────────────────┘
│ current_period_start│
│ current_period_end  │
│ cancel_at_period_end│
│ created_at          │
│ updated_at          │
└─────────────────────┘
\`\`\`

---

### Tabela: profiles

**Descrição**: Armazena informações do perfil do usuário

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| id | UUID | PRIMARY KEY | ID do usuário (mesmo do auth.users) |
| email | TEXT | NOT NULL, UNIQUE | Email do usuário |
| name | TEXT | NULL | Nome completo |
| phone | TEXT | NULL | Telefone de contato |
| company | TEXT | NULL | Nome da empresa |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Data de criação |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Data de atualização |

**Índices:**
- PRIMARY KEY (id)
- UNIQUE (email)

**RLS Policies:**
- SELECT: Usuário pode ver apenas seu próprio perfil
- UPDATE: Usuário pode atualizar apenas seu próprio perfil
- INSERT: Apenas via trigger (signup)
- DELETE: Não permitido

**Trigger:**
- `on_auth_user_created`: Cria profile automaticamente quando usuário se registra

---

### Tabela: devices

**Descrição**: Armazena números WhatsApp conectados

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| id | UUID | PRIMARY KEY | ID único do dispositivo |
| user_id | UUID | NOT NULL, FOREIGN KEY | ID do usuário dono |
| phone_number | TEXT | NOT NULL | Número do WhatsApp |
| country_code | TEXT | NOT NULL | Código do país (+55) |
| status | TEXT | NOT NULL | pending, active, inactive, disconnected |
| last_sync | TIMESTAMPTZ | NULL | Última sincronização |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Data de criação |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Data de atualização |

**Índices:**
- PRIMARY KEY (id)
- INDEX (user_id)
- UNIQUE (phone_number, country_code)

**RLS Policies:**
- SELECT: Usuário vê apenas seus dispositivos
- INSERT: Usuário pode criar dispositivos
- UPDATE: Usuário pode atualizar seus dispositivos
- DELETE: Usuário pode deletar seus dispositivos

**Constraints:**
- status deve ser um dos valores: pending, active, inactive, disconnected
- phone_number + country_code devem ser únicos

---

### Tabela: subscriptions

**Descrição**: Armazena assinaturas e planos dos usuários

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| id | UUID | PRIMARY KEY | ID único da assinatura |
| user_id | UUID | NOT NULL, FOREIGN KEY | ID do usuário |
| stripe_customer_id | TEXT | NULL | ID do cliente no Stripe |
| stripe_subscription_id | TEXT | NULL, UNIQUE | ID da assinatura no Stripe |
| plan_name | TEXT | NOT NULL | Nome do plano (Gratuito, Pro, Enterprise) |
| plan_price | NUMERIC | NOT NULL | Preço do plano em centavos |
| status | TEXT | NOT NULL | active, canceled, past_due, trialing |
| trial_ends_at | TIMESTAMPTZ | NULL | Data de fim do trial |
| current_period_start | TIMESTAMPTZ | NULL | Início do período atual |
| current_period_end | TIMESTAMPTZ | NULL | Fim do período atual |
| cancel_at_period_end | BOOLEAN | NOT NULL, DEFAULT FALSE | Se vai cancelar no fim do período |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Data de criação |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Data de atualização |

**Índices:**
- PRIMARY KEY (id)
- INDEX (user_id)
- UNIQUE (stripe_subscription_id)
- INDEX (status)

**RLS Policies:**
- SELECT: Usuário vê apenas sua assinatura
- INSERT: Apenas via API (webhook Stripe)
- UPDATE: Apenas via API (webhook Stripe)
- DELETE: Não permitido

**Constraints:**
- status deve ser um dos valores: active, canceled, past_due, trialing, incomplete
- plan_price deve ser >= 0

---

### Tabela: verification_codes

**Descrição**: Armazena códigos de verificação temporários

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| id | UUID | PRIMARY KEY | ID único do código |
| user_id | UUID | NOT NULL, FOREIGN KEY | ID do usuário |
| code | TEXT | NOT NULL | Código de verificação |
| type | TEXT | NOT NULL | email, phone, whatsapp |
| expires_at | TIMESTAMPTZ | NOT NULL | Data de expiração |
| used | BOOLEAN | NOT NULL, DEFAULT FALSE | Se foi usado |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Data de criação |

**Índices:**
- PRIMARY KEY (id)
- INDEX (user_id)
- INDEX (code)
- INDEX (expires_at)

**RLS Policies:**
- SELECT: Usuário vê apenas seus códigos
- INSERT: Usuário pode criar códigos
- UPDATE: Usuário pode marcar como usado
- DELETE: Automático após expiração

**Constraints:**
- type deve ser um dos valores: email, phone, whatsapp
- expires_at deve ser no futuro

---

### Tabelas Futuras (Roadmap)

#### messages

**Descrição**: Armazena todas as mensagens trocadas

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | ID único da mensagem |
| conversation_id | UUID | ID da conversa |
| device_id | UUID | ID do dispositivo |
| sender_type | TEXT | user, customer, ai |
| sender_id | TEXT | ID do remetente |
| content | TEXT | Conteúdo da mensagem |
| media_url | TEXT | URL de mídia (imagem, vídeo) |
| status | TEXT | sent, delivered, read, failed |
| created_at | TIMESTAMPTZ | Data de envio |

#### conversations

**Descrição**: Agrupa mensagens em conversas

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | ID único da conversa |
| device_id | UUID | ID do dispositivo |
| customer_phone | TEXT | Telefone do cliente |
| customer_name | TEXT | Nome do cliente |
| status | TEXT | open, closed, archived |
| last_message_at | TIMESTAMPTZ | Última mensagem |
| assigned_to | UUID | ID do atendente |
| tags | TEXT[] | Tags da conversa |
| created_at | TIMESTAMPTZ | Data de criação |

#### ai_training_data

**Descrição**: Dados para treinar a IA

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | ID único |
| user_id | UUID | ID do usuário |
| question | TEXT | Pergunta |
| answer | TEXT | Resposta esperada |
| context | JSONB | Contexto adicional |
| active | BOOLEAN | Se está ativo |
| created_at | TIMESTAMPTZ | Data de criação |

---

## 🛠️ Stack Tecnológico

### Frontend

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Next.js | 15.x | Framework React |
| React | 19.x | Biblioteca UI |
| TypeScript | 5.x | Tipagem estática |
| Tailwind CSS | 4.x | Estilização |
| shadcn/ui | Latest | Componentes UI |
| Lucide React | Latest | Ícones |
| SWR | Latest | Data fetching |

### Backend

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Next.js API Routes | 15.x | API REST |
| Server Actions | 15.x | Mutations |
| Supabase | Latest | Backend as a Service |
| PostgreSQL | 15.x | Banco de dados |

### Integrações

| Serviço | Uso |
|---------|-----|
| Supabase Auth | Autenticação |
| Stripe | Pagamentos |
| Resend | Emails transacionais |
| WhatsApp Business API | Mensagens WhatsApp |
| OpenAI / Anthropic | IA conversacional |

### DevOps

| Ferramenta | Uso |
|------------|-----|
| Vercel | Hospedagem e deploy |
| GitHub | Controle de versão |
| Vercel Analytics | Métricas de uso |

---

## 📅 Roadmap de Implementação

### 🔴 URGENTE (Implementar Imediatamente)

#### 1. Executar Scripts SQL
**Prioridade**: CRÍTICA
**Tempo estimado**: 5 minutos

**Tarefas:**
- [ ] Executar scripts/001_create_tables.sql
- [ ] Executar scripts/002_create_profile_trigger.sql
- [ ] Executar scripts/003_enable_rls.sql
- [ ] Executar scripts/004_create_updated_at_trigger.sql

**Por quê é urgente:**
- Sem RLS, dados dos usuários não estão protegidos (risco de segurança)
- Sem trigger, profiles não são criados automaticamente (quebra signup)

---

#### 2. Configurar Produtos no Stripe
**Prioridade**: CRÍTICA
**Tempo estimado**: 30 minutos

**Tarefas:**
- [ ] Criar produto "Plano Pro" no Stripe
- [ ] Criar produto "Plano Enterprise" no Stripe
- [ ] Copiar Price IDs
- [ ] Atualizar IDs no código (components/pricing-section.tsx)
- [ ] Configurar webhook do Stripe
- [ ] Testar fluxo de pagamento

**Por quê é urgente:**
- Sem isso, usuários não conseguem assinar planos pagos
- Pagamentos não funcionam

**Documentação**: Ver STRIPE_SETUP.md

---

#### 3. Integrar WhatsApp Business API
**Prioridade**: ALTA
**Tempo estimado**: 2-3 dias

**Tarefas:**
- [ ] Criar conta no WhatsApp Business API
- [ ] Obter credenciais de API
- [ ] Implementar geração de QR Code
- [ ] Implementar webhook para receber mensagens
- [ ] Testar conexão de dispositivo
- [ ] Testar envio/recebimento de mensagens

**Por quê é urgente:**
- É a funcionalidade core do produto
- Sem isso, o produto não funciona

---

#### 4. Implementar Sistema de IA
**Prioridade**: ALTA
**Tempo estimado**: 3-5 dias

**Tarefas:**
- [ ] Escolher provider (OpenAI vs Anthropic)
- [ ] Criar prompts base em português
- [ ] Implementar processamento de mensagens
- [ ] Implementar geração de respostas
- [ ] Criar sistema de contexto (histórico)
- [ ] Testar qualidade das respostas
- [ ] Implementar fallback para atendente humano

**Por quê é urgente:**
- É a funcionalidade core do produto
- Diferencial competitivo

---

### 🟡 IMPORTANTE (Implementar em 2-4 semanas)

#### 5. Dashboard de Mensagens
**Prioridade**: ALTA
**Tempo estimado**: 1 semana

**Tarefas:**
- [ ] Criar tabelas messages e conversations
- [ ] Implementar listagem de conversas
- [ ] Implementar visualização de mensagens
- [ ] Implementar envio manual de mensagens
- [ ] Implementar busca de conversas
- [ ] Implementar filtros (abertas, fechadas, etc)

**Por quê é importante:**
- Usuários precisam ver histórico de conversas
- Necessário para suporte e qualidade

---

#### 6. Analytics e Métricas
**Prioridade**: MÉDIA
**Tempo estimado**: 1 semana

**Tarefas:**
- [ ] Implementar tracking de mensagens
- [ ] Criar dashboard de métricas
- [ ] Métricas: total de mensagens, tempo de resposta, satisfação
- [ ] Gráficos de evolução
- [ ] Exportação de relatórios

**Por quê é importante:**
- Usuários precisam medir ROI
- Dados para melhorar o produto

---

#### 7. Sistema de Treinamento da IA
**Prioridade**: MÉDIA
**Tempo estimado**: 1 semana

**Tarefas:**
- [ ] Criar tabela ai_training_data
- [ ] Interface para adicionar perguntas/respostas
- [ ] Sistema de importação (CSV, FAQ)
- [ ] Integração com IA (fine-tuning ou RAG)
- [ ] Testes de qualidade

**Por quê é importante:**
- Permite personalização da IA
- Melhora qualidade das respostas

---

#### 8. Integrações com CRM
**Prioridade**: MÉDIA
**Tempo estimado**: 2 semanas

**Tarefas:**
- [ ] Integração com RD Station
- [ ] Integração com HubSpot
- [ ] Integração com Pipedrive
- [ ] Sistema de webhooks para outras integrações
- [ ] Documentação de API

**Por quê é importante:**
- Diferencial competitivo
- Necessário para empresas maiores

---

### 🟢 DESEJÁVEL (Implementar em 1-3 meses)

#### 9. App Mobile
**Prioridade**: BAIXA
**Tempo estimado**: 1 mês

**Tarefas:**
- [ ] Decidir tecnologia (React Native vs Flutter)
- [ ] Implementar autenticação
- [ ] Implementar visualização de conversas
- [ ] Implementar notificações push
- [ ] Publicar na App Store e Google Play

**Por quê é desejável:**
- Conveniência para usuários
- Notificações em tempo real

---

#### 10. Sistema de Agendamento
**Prioridade**: BAIXA
**Tempo estimado**: 1 semana

**Tarefas:**
- [ ] Criar tabela scheduled_messages
- [ ] Interface para agendar mensagens
- [ ] Sistema de envio automático
- [ ] Campanhas de marketing

**Por quê é desejável:**
- Funcionalidade adicional
- Aumenta valor do produto

---

#### 11. Chatbot Visual Builder
**Prioridade**: BAIXA
**Tempo estimado**: 3 semanas

**Tarefas:**
- [ ] Interface drag-and-drop
- [ ] Sistema de fluxos
- [ ] Condicionais e variáveis
- [ ] Integração com IA

**Por quê é desejável:**
- Diferencial competitivo
- Permite automações complexas

---

#### 12. Suporte a Múltiplos Idiomas
**Prioridade**: BAIXA
**Tempo estimado**: 2 semanas

**Tarefas:**
- [ ] Implementar i18n no frontend
- [ ] Traduzir interface (inglês, espanhol)
- [ ] IA multilíngue
- [ ] Documentação em outros idiomas

**Por quê é desejável:**
- Expansão internacional
- Mercado maior

---

## 📊 Métricas de Sucesso

### Métricas de Produto

| Métrica | Meta | Como Medir |
|---------|------|------------|
| Usuários Ativos Mensais (MAU) | 500 em 6 meses | Vercel Analytics |
| Taxa de Conversão Trial → Pago | 20% | Stripe + Supabase |
| Churn Rate | < 5% | Stripe |
| NPS (Net Promoter Score) | > 50 | Pesquisa in-app |
| Tempo Médio de Resposta da IA | < 2 segundos | Logs de performance |
| Uptime | 99.9% | Vercel Status |

### Métricas de Negócio

| Métrica | Meta | Como Medir |
|---------|------|------------|
| MRR (Monthly Recurring Revenue) | R$ 50k em 6 meses | Stripe |
| CAC (Customer Acquisition Cost) | < R$ 200 | Ads + MRR |
| LTV (Lifetime Value) | > R$ 1.000 | Stripe |
| LTV/CAC Ratio | > 3 | LTV / CAC |

### Métricas de Engajamento

| Métrica | Meta | Como Medir |
|---------|------|------------|
| Mensagens Processadas/Dia | 10.000 | Banco de dados |
| Dispositivos Conectados/Usuário | 1.5 | Banco de dados |
| Taxa de Satisfação do Cliente | > 80% | Feedback in-app |
| Tempo Médio na Plataforma | > 10 min/dia | Vercel Analytics |

---

## 🔒 Segurança e Compliance

### Medidas de Segurança Implementadas

1. **Row Level Security (RLS)**
   - Todos os dados isolados por usuário
   - Políticas de acesso granulares

2. **Autenticação Segura**
   - Supabase Auth com JWT
   - Tokens com expiração
   - Refresh tokens

3. **Criptografia**
   - HTTPS em todas as conexões
   - Dados em trânsito criptografados
   - Senhas com hash bcrypt

4. **Validação de Dados**
   - Validação no frontend e backend
   - Sanitização de inputs
   - Proteção contra SQL injection

### Compliance

1. **LGPD (Lei Geral de Proteção de Dados)**
   - [ ] Política de privacidade
   - [ ] Termos de uso
   - [ ] Consentimento explícito
   - [ ] Direito ao esquecimento
   - [ ] Portabilidade de dados

2. **WhatsApp Business Policy**
   - [ ] Seguir diretrizes do WhatsApp
   - [ ] Opt-in obrigatório
   - [ ] Opt-out fácil
   - [ ] Não enviar spam

---

## 📝 Conclusão

Este PRD define a visão completa do FalaZap, desde a arquitetura técnica até o roadmap de implementação. As prioridades estão claras:

**Urgente (Fazer Agora):**
1. Executar scripts SQL (segurança)
2. Configurar Stripe (monetização)
3. Integrar WhatsApp API (core)
4. Implementar IA (core)

**Importante (2-4 semanas):**
5. Dashboard de mensagens
6. Analytics
7. Treinamento da IA
8. Integrações CRM

**Desejável (1-3 meses):**
9. App mobile
10. Agendamento
11. Visual builder
12. Múltiplos idiomas

Com este roadmap, o FalaZap estará pronto para lançamento em 4-6 semanas, com funcionalidades core completas e diferencial competitivo claro.
