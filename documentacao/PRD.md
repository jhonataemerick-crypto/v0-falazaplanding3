# Product Requirements Document (PRD)
# FalaZap - Assistente Virtual WhatsApp com IA

**Versão:** 1.0  
**Data:** Janeiro 2025  
**Status:** Em Desenvolvimento  
**Autor:** Equipe FalaZap

---

## 1. Visão Geral do Produto

### 1.1 Proposta de Valor

**FalaZap** é uma plataforma SaaS que permite empresas automatizarem conversas no WhatsApp usando inteligência artificial avançada. A solução oferece respostas instantâneas 24/7, integração nativa com WhatsApp Business API e setup simplificado em menos de 5 minutos.

### 1.2 Problema que Resolve

- **Atendimento limitado:** Empresas não conseguem responder clientes 24/7
- **Custos altos:** Equipes de atendimento são caras e difíceis de escalar
- **Tempo de resposta:** Clientes esperam respostas imediatas no WhatsApp
- **Perda de vendas:** Leads não atendidos rapidamente são perdidos
- **Complexidade técnica:** Integrar IA com WhatsApp é complexo e caro

### 1.3 Solução Proposta

Uma plataforma completa que:
- Conecta números do WhatsApp em minutos
- Usa IA treinada em português para conversas naturais
- Automatiza atendimento, vendas e suporte
- Fornece analytics e insights sobre conversas
- Integra com CRMs e ferramentas existentes

### 1.4 Público-Alvo

**Primário:**
- Pequenas e médias empresas (PMEs)
- E-commerces
- Prestadores de serviços
- Profissionais liberais

**Secundário:**
- Grandes empresas
- Agências de marketing
- Empresas de atendimento ao cliente

---

## 2. Objetivos e Métricas

### 2.1 Objetivos de Negócio

1. **Aquisição:** 1.000 usuários ativos nos primeiros 3 meses
2. **Conversão:** Taxa de conversão free → paid de 15%
3. **Retenção:** Churn mensal < 5%
4. **Receita:** MRR de R$ 50.000 em 6 meses

### 2.2 Métricas de Sucesso

**Métricas de Produto:**
- Tempo médio de setup < 5 minutos
- Taxa de sucesso na conexão WhatsApp > 95%
- Uptime do serviço > 99.5%
- Tempo de resposta da IA < 2 segundos

**Métricas de Usuário:**
- NPS > 50
- Satisfação do cliente > 4.5/5
- Mensagens processadas por usuário/mês
- Taxa de automação (% de conversas sem intervenção humana)

---

## 3. Personas

### Persona 1: Maria - Dona de E-commerce

**Perfil:**
- 35 anos, empreendedora
- Vende roupas online via Instagram e WhatsApp
- Recebe 50-100 mensagens/dia
- Não tem equipe de atendimento

**Dores:**
- Perde vendas por não responder rápido
- Passa o dia inteiro respondendo mensagens repetitivas
- Não consegue atender fora do horário comercial

**Objetivos:**
- Automatizar perguntas frequentes (preço, tamanho, entrega)
- Atender clientes 24/7
- Focar em fechar vendas, não em responder dúvidas básicas

### Persona 2: João - Gerente de Atendimento

**Perfil:**
- 42 anos, gerente em empresa de serviços
- Gerencia equipe de 5 atendentes
- Empresa recebe 500+ mensagens/dia no WhatsApp
- Usa CRM para gestão de clientes

**Dores:**
- Equipe sobrecarregada com perguntas repetitivas
- Dificuldade em medir performance do atendimento
- Alto custo operacional da equipe
- Falta de integração entre WhatsApp e CRM

**Objetivos:**
- Reduzir carga de trabalho da equipe em 50%
- Ter analytics detalhado de conversas
- Integrar WhatsApp com CRM existente
- Melhorar tempo de resposta

---

## 4. Arquitetura da Solução

### 4.1 Stack Tecnológico

**Frontend:**
- Next.js 15 (App Router)
- React 18
- TypeScript
- Tailwind CSS v4
- shadcn/ui components

**Backend:**
- Next.js API Routes
- Server Actions
- Supabase (PostgreSQL)
- Supabase Auth

**Integrações:**
- Stripe (Pagamentos)
- WhatsApp Business API
- Resend (Emails transacionais)

**Infraestrutura:**
- Vercel (Hosting e Deploy)
- Supabase (Database e Auth)
- Stripe (Billing)

### 4.2 Arquitetura de Dados

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                     CAMADA DE APRESENTAÇÃO                   │
│  Landing Page │ Dashboard │ Auth Pages │ Settings           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     CAMADA DE APLICAÇÃO                      │
│  Server Actions │ API Routes │ Client Components            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     CAMADA DE DADOS                          │
│  Supabase Client │ Supabase Server │ Helper Functions       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     BANCO DE DADOS                           │
│  profiles │ subscriptions │ devices │ verification_codes    │
└─────────────────────────────────────────────────────────────┘
\`\`\`

---

## 5. Telas e Funcionalidades

### 5.1 Landing Page (`/`)

**Objetivo:** Converter visitantes em usuários cadastrados

**Seções:**

1. **Header**
   - Logo FalaZap
   - Menu: Benefícios, Como Funciona, Preços, FAQ
   - Botões: "Entrar" e "Começar Grátis"

2. **Hero Section**
   - Headline: "IA que fala com você no zap"
   - Subheadline: Proposta de valor clara
   - CTA primário: "Começar Grátis"
   - CTA secundário: "Ver Demo"
   - Badge: "Novo: Integração com WhatsApp Business API"
   - Demonstração visual: Chat simulado mostrando IA em ação

3. **Who Benefits Section**
   - Título: "Quem se beneficia do FalaZap?"
   - Cards para diferentes personas:
     - E-commerces
     - Prestadores de Serviços
     - Empresas de Atendimento
     - Profissionais Liberais

4. **How It Works Section**
   - Título: "Como funciona?"
   - 3 passos simples:
     1. Conecte seu WhatsApp
     2. Configure a IA
     3. Comece a automatizar

5. **Social Proof Section**
   - Depoimentos de clientes
   - Estatísticas de uso
   - Logos de empresas clientes

6. **Pricing Section**
   - 3 planos:
     - **Gratuito:** R$ 0/mês - 100 mensagens
     - **Pro:** R$ 97/mês - 5.000 mensagens (Mais Popular)
     - **Enterprise:** Personalizado - Ilimitado
   - Comparação de features
   - CTAs para cada plano

7. **FAQ Section**
   - Perguntas frequentes
   - Accordion com respostas

8. **CTA Section**
   - Última chamada para ação
   - "Comece grátis hoje"

9. **Footer**
   - Links úteis
   - Redes sociais
   - Informações de contato

10. **Chat Widget**
    - Widget flutuante no canto inferior direito
    - Permite conversar com suporte

**Funcionalidades:**
- Navegação suave entre seções
- Animações ao scroll
- Responsivo (mobile-first)
- CTAs estrategicamente posicionados

---

### 5.2 Página de Cadastro (`/auth/signup`)

**Objetivo:** Criar conta de usuário

**Elementos:**
- Formulário de cadastro
  - Nome completo
  - Email
  - Senha (mínimo 6 caracteres)
- Botão "Criar conta"
- Texto informativo: "Você receberá um email de confirmação"
- Link para login: "Já tem uma conta? Entre aqui"

**Fluxo:**
1. Usuário preenche formulário
2. Sistema valida dados
3. Cria usuário no Supabase Auth
4. Trigger automático cria profile na tabela `profiles`
5. Envia email de confirmação
6. Redireciona para `/auth/verify-email`

**Validações:**
- Email válido e único
- Senha com mínimo 6 caracteres
- Nome não vazio

**Mensagens de Erro:**
- "Este email já está cadastrado"
- "Senha muito curta"
- "Erro ao criar conta. Tente novamente"

---

### 5.3 Página de Verificação de Email (`/auth/verify-email`)

**Objetivo:** Informar usuário sobre necessidade de confirmar email

**Elementos:**
- Ícone de email
- Título: "Verifique seu email"
- Descrição: Instruções claras sobre o processo
- Botão "Reenviar email de confirmação"
- Link "Voltar para login"
- Link "Ir para página inicial"

**Fluxo:**
1. Usuário chega após signup
2. Vê instruções sobre verificação
3. Verifica email e clica no link
4. Supabase confirma email
5. Middleware redireciona para `/dashboard`

**Funcionalidades:**
- Reenviar email de confirmação
- Feedback visual ao reenviar
- Contador de tempo para reenvio (evitar spam)

---

### 5.4 Página de Login (`/auth/login`)

**Objetivo:** Autenticar usuários existentes

**Elementos:**
- Formulário de login
  - Email
  - Senha
- Botão "Entrar"
- Link "Esqueceu a senha?"
- Link "Criar conta nova"

**Fluxo:**
1. Usuário preenche credenciais
2. Sistema valida com Supabase Auth
3. Se sucesso: redireciona para `/dashboard`
4. Se erro: mostra mensagem apropriada

**Mensagens de Erro:**
- "Credenciais inválidas"
- "Email não confirmado. Verifique sua caixa de entrada"
- "Erro ao fazer login. Tente novamente"

**Tratamento Especial:**
- Se erro for "Email not confirmed": mostra botão para reenviar confirmação
- Se erro for "Invalid credentials": sugere criar conta

---

### 5.5 Página de Assinatura (`/assinatura`)

**Objetivo:** Converter usuário free em pagante

**Elementos:**
- Header da aplicação (com perfil do usuário)
- Título: "Escolha seu plano"
- Cards dos planos (mesmo da landing)
- Stripe Embedded Checkout
- Comparação de features

**Fluxo:**
1. Usuário clica em "Assinar plano"
2. Sistema cria sessão de checkout no Stripe
3. Stripe Embedded Checkout é exibido
4. Usuário preenche dados de pagamento
5. Stripe processa pagamento
6. Webhook atualiza tabela `subscriptions`
7. Redireciona para `/dashboard?session_id=xxx`
8. Dashboard mostra mensagem de sucesso

**Integração Stripe:**
- Embedded Checkout (não redireciona para Stripe)
- Metadata enviada:
  - `userId`: ID do usuário
  - `planName`: Nome do plano
  - `planPrice`: Preço do plano
- Trial de 3 dias incluído
- Webhook processa eventos:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_failed`

---

### 5.6 Dashboard (`/dashboard`)

**Objetivo:** Central de controle do usuário

**Elementos:**

1. **Header da Aplicação**
   - Logo FalaZap
   - Dropdown de perfil do usuário:
     - Nome e email
     - "Minha Conta"
     - "Home"
     - "Sair"

2. **Saudação**
   - "Olá, [Nome do Usuário]"
   - Botão "Atualizar" (refresh)

3. **Mensagem de Sucesso** (condicional)
   - Aparece quando `?session_id` está na URL
   - "Assinatura ativada com sucesso!"
   - Pode ser fechada

4. **Card: Conectar WhatsApp** (se não tem devices)
   - Ícone de smartphone
   - Título: "Conecte seu WhatsApp"
   - Descrição: "Adicione seu primeiro dispositivo"
   - Botão: "Adicionar WhatsApp +"
   - Abre modal de conexão

5. **Card: Consumo do Mês**
   - Ícone de gráfico
   - Minutos usados / Total de minutos
   - Barra de progresso visual
   - Texto: "Você ainda tem X minutos disponíveis"
   - Botão: "Fazer upgrade de plano"

6. **Card: Assistente Virtual**
   - Ícone de mensagem
   - Título: "Fale com o assistente virtual"
   - Lista de funcionalidades:
     - Suporte ao usuário
     - Transcrição de áudios
     - Sugestões e reclamações
     - Consulta de saldo
   - Número do WhatsApp: +55 (83) 99111-9781
   - Botão para abrir conversa

7. **Card: Assinatura Ativa** (se tem subscription)
   - Título: "Assinatura Ativa"
   - Nome do plano
   - Preço mensal
   - Badge de status (Ativo/Trialing/Cancelado)
   - Informação sobre trial (se aplicável)

**Funcionalidades:**
- Refresh manual dos dados
- Modal de conexão WhatsApp
- Navegação para outras páginas
- Logout

**Estados:**
- Loading: Spinner centralizado
- Sem subscription: Mostra apenas cards básicos
- Com subscription: Mostra todos os cards
- Sem devices: Mostra card de conexão WhatsApp

---

### 5.7 Modal de Conexão WhatsApp

**Objetivo:** Conectar número do WhatsApp do usuário

**Fluxo Multi-Step:**

**Step 1: Número do WhatsApp**
- Input para número de telefone
- Formato: +55 (XX) XXXXX-XXXX
- Validação de formato
- Botão "Continuar"

**Step 2: Permissões**
- Lista de permissões necessárias:
  - Enviar e receber mensagens
  - Ler contatos
  - Acessar mídia
- Checkbox "Aceito os termos"
- Botão "Aceitar e Continuar"

**Step 3: QR Code**
- Título: "Escaneie o QR Code"
- QR Code grande (placeholder)
- Instruções:
  1. Abra o WhatsApp no seu celular
  2. Toque em Menu > Aparelhos conectados
  3. Toque em Conectar um aparelho
  4. Aponte seu celular para esta tela
- Botão "Gerar novo código"
- Status: "Aguardando conexão..."

**Step 4: Sucesso**
- Ícone de check verde
- Título: "WhatsApp conectado!"
- Mensagem de sucesso
- Botão "Ir para o Dashboard"

**Integração:**
- Salva device na tabela `devices`
- Associa ao usuário logado
- Atualiza lista de devices no dashboard

---

### 5.8 Página Minha Conta (`/conta`)

**Objetivo:** Gerenciar informações do perfil

**Elementos:**

1. **Header da Aplicação**

2. **Título:** "Minha Conta"

3. **Card: Informações Pessoais**
   - Nome completo (editável)
   - Email (não editável)
   - Botão "Salvar alterações"

4. **Card: Assinatura**
   - Plano atual
   - Status
   - Próxima cobrança
   - Botão "Gerenciar assinatura"
   - Botão "Cancelar assinatura"

5. **Card: Segurança**
   - Botão "Alterar senha"
   - Última alteração de senha

6. **Card: Dispositivos Conectados**
   - Lista de números WhatsApp conectados
   - Status de cada device
   - Botão "Desconectar" para cada

**Funcionalidades:**
- Editar nome
- Atualizar profile no banco
- Gerenciar assinatura (redireciona para Stripe Portal)
- Cancelar assinatura
- Desconectar devices

---

## 6. Fluxos de Usuário Detalhados

### 6.1 Fluxo de Cadastro e Onboarding

\`\`\`
┌─────────────────┐
│  Landing Page   │
│   (Visitante)   │
└────────┬────────┘
         │ Clica "Começar Grátis"
         ▼
┌─────────────────┐
│  Signup Page    │
│  Preenche form  │
└────────┬────────┘
         │ Submete formulário
         ▼
┌─────────────────┐
│  Supabase Auth  │
│  Cria usuário   │
└────────┬────────┘
         │ Trigger automático
         ▼
┌─────────────────┐
│  Tabela Profile │
│  Cria registro  │
└────────┬────────┘
         │ Envia email
         ▼
┌─────────────────┐
│ Verify Email    │
│ Aguarda confirm │
└────────┬────────┘
         │ Usuário clica link no email
         ▼
┌─────────────────┐
│  Email Confirm  │
│  Supabase       │
└────────┬────────┘
         │ Redireciona
         ▼
┌─────────────────┐
│   Dashboard     │
│  (Autenticado)  │
└─────────────────┘
\`\`\`

**Pontos de Atenção:**
- Email de confirmação é obrigatório
- Sem confirmação, usuário não consegue fazer login
- Trigger cria profile automaticamente
- RLS protege dados do usuário

---

### 6.2 Fluxo de Pagamento e Assinatura

\`\`\`
┌─────────────────┐
│   Dashboard     │
│  Sem assinatura │
└────────┬────────┘
         │ Clica "Fazer upgrade"
         ▼
┌─────────────────┐
│ Página Assinatu │
│ Escolhe plano   │
└────────┬────────┘
         │ Clica "Assinar"
         ▼
┌─────────────────┐
│ Server Action   │
│ Cria sessão     │
└────────┬────────┘
         │ Retorna clientSecret
         ▼
┌─────────────────┐
│ Stripe Checkout │
│ Preenche dados  │
└────────┬────────┘
         │ Processa pagamento
         ▼
┌─────────────────┐
│  Stripe Webhook │
│ checkout.compl  │
└────────┬────────┘
         │ Insere na tabela
         ▼
┌─────────────────┐
│  Subscriptions  │
│  Novo registro  │
└────────┬────────┘
         │ Redireciona
         ▼
┌─────────────────┐
│   Dashboard     │
│ Mostra sucesso  │
└─────────────────┘
\`\`\`

**Dados Salvos na Subscription:**
- `user_id`: UUID do usuário
- `stripe_customer_id`: ID do cliente no Stripe
- `stripe_subscription_id`: ID da subscription
- `plan_name`: Nome do plano
- `plan_price`: Preço
- `status`: active/trialing/canceled
- `trial_ends_at`: Data fim do trial
- `current_period_start`: Início do período
- `current_period_end`: Fim do período

**Eventos do Stripe Processados:**
- `checkout.session.completed`: Cria subscription
- `customer.subscription.updated`: Atualiza status
- `customer.subscription.deleted`: Marca como cancelada
- `invoice.payment_failed`: Marca como past_due

---

### 6.3 Fluxo de Conexão WhatsApp

\`\`\`
┌─────────────────┐
│   Dashboard     │
│  Sem devices    │
└────────┬────────┘
         │ Clica "Adicionar WhatsApp"
         ▼
┌─────────────────┐
│  Modal Step 1   │
│  Insere número  │
└────────┬────────┘
         │ Clica "Continuar"
         ▼
┌─────────────────┐
│  Modal Step 2   │
│  Aceita termos  │
└────────┬────────┘
         │ Clica "Aceitar"
         ▼
┌─────────────────┐
│  Modal Step 3   │
│  Mostra QR Code │
└────────┬────────┘
         │ Usuário escaneia
         ▼
┌─────────────────┐
│ WhatsApp API    │
│ Valida conexão  │
└────────┬────────┘
         │ Salva no banco
         ▼
┌─────────────────┐
│  Tabela Devices │
│  Novo registro  │
└────────┬────────┘
         │ Mostra sucesso
         ▼
┌─────────────────┐
│  Modal Step 4   │
│  Sucesso!       │
└────────┬────────┘
         │ Fecha modal
         ▼
┌─────────────────┐
│   Dashboard     │
│  Com device     │
└─────────────────┘
\`\`\`

**Dados Salvos no Device:**
- `user_id`: UUID do usuário
- `phone_number`: Número do WhatsApp
- `device_name`: Nome do dispositivo
- `status`: connected/disconnected
- `last_seen`: Última vez online

---

### 6.4 Fluxo de Login

\`\`\`
┌─────────────────┐
│  Login Page     │
│  Insere dados   │
└────────┬────────┘
         │ Clica "Entrar"
         ▼
┌─────────────────┐
│  Supabase Auth  │
│  Valida         │
└────────┬────────┘
         │
         ├─ Email não confirmado
         │  └─> Mostra erro + botão reenviar
         │
         ├─ Credenciais inválidas
         │  └─> Mostra erro + link criar conta
         │
         └─ Sucesso
            └─> Redireciona Dashboard
\`\`\`

---

## 7. Regras de Negócio

### 7.1 Autenticação

- Email de confirmação é obrigatório
- Senha mínima de 6 caracteres
- Sessão expira após 7 dias de inatividade
- Refresh token válido por 30 dias
- Middleware protege rotas privadas

### 7.2 Assinaturas

- Trial de 3 dias em todos os planos pagos
- Cobrança recorrente mensal
- Cancelamento a qualquer momento
- Acesso mantido até fim do período pago
- Downgrade só no próximo ciclo
- Upgrade imediato com pro-rata

### 7.3 Limites por Plano

**Gratuito:**
- 100 mensagens/mês
- 1 número WhatsApp
- IA básica
- Suporte por email

**Pro (R$ 97/mês):**
- 5.000 mensagens/mês
- 3 números WhatsApp
- IA avançada
- Integração CRM
- Analytics
- Suporte prioritário

**Enterprise (Personalizado):**
- Mensagens ilimitadas
- Números ilimitados
- IA personalizada
- Integrações customizadas
- Gerente de conta
- SLA garantido

### 7.4 Segurança

- Row Level Security (RLS) em todas as tabelas
- Usuário só acessa seus próprios dados
- Tokens JWT para autenticação
- HTTPS obrigatório
- Webhook Stripe com validação de assinatura
- Rate limiting em APIs públicas

---

## 8. Integrações

### 8.1 Supabase

**Autenticação:**
- Email/Password
- Confirmação de email obrigatória
- Reset de senha
- Refresh tokens

**Banco de Dados:**
- PostgreSQL
- 4 tabelas principais
- RLS habilitado
- Triggers automáticos

**Tabelas:**
- `profiles`: Dados do usuário
- `subscriptions`: Assinaturas ativas
- `devices`: Números WhatsApp conectados
- `verification_codes`: Códigos de verificação

### 8.2 Stripe

**Produtos:**
- Gratuito (sem cobrança)
- Pro: R$ 97/mês
- Enterprise: Personalizado

**Webhooks:**
- URL: `/api/webhooks/stripe`
- Eventos processados:
  - checkout.session.completed
  - customer.subscription.updated
  - customer.subscription.deleted
  - invoice.payment_failed

**Embedded Checkout:**
- Não redireciona para Stripe
- Experiência integrada
- Customizável

### 8.3 Resend (Email)

**Emails Transacionais:**
- Confirmação de email
- Reset de senha
- Notificações de pagamento
- Alertas de uso

**Configuração:**
- Domínio verificado
- Templates customizados
- Tracking de abertura

---

## 9. Roadmap e Prioridades

### 9.1 Implementado ✅

- Landing page completa
- Sistema de autenticação
- Confirmação de email
- Integração Stripe
- Dashboard básico
- Página de assinatura
- Página minha conta
- Modal conexão WhatsApp (UI)
- Banco de dados com RLS
- Webhooks Stripe

### 9.2 Urgente 🔴 (Próximas 2 semanas)

**1. Corrigir Webhook Stripe**
- Adicionar colunas faltantes na tabela subscriptions
- Testar fluxo completo de pagamento
- Validar atualização de status
- Documentar configuração

**2. Integração WhatsApp Real**
- Conectar com WhatsApp Business API
- Implementar geração de QR Code real
- Validar conexão de dispositivos
- Salvar tokens de autenticação

**3. Sistema de Mensagens**
- Receber mensagens do WhatsApp
- Processar com IA
- Enviar respostas
- Salvar histórico

### 9.3 Importante 🟡 (Próximo mês)

**1. Analytics e Métricas**
- Dashboard de analytics
- Gráficos de uso
- Relatórios de conversas
- Exportação de dados

**2. Integração IA**
- Conectar com OpenAI/Anthropic
- Treinar modelo em português
- Personalização por empresa
- Contexto de conversas

**3. Gestão de Limites**
- Contador de mensagens
- Alertas de limite
- Bloqueio ao atingir limite
- Upgrade automático

**4. CRM Básico**
- Lista de contatos
- Histórico de conversas
- Tags e segmentação
- Notas sobre clientes

### 9.4 Desejável 🟢 (Próximos 3 meses)

**1. Integrações Externas**
- Zapier
- Make (Integromat)
- Google Sheets
- HubSpot
- RD Station

**2. Automações Avançadas**
- Fluxos de conversa
- Condicionais
- Agendamento de mensagens
- Respostas rápidas

**3. Multi-idioma**
- Interface em inglês
- IA em inglês e espanhol
- Detecção automática de idioma

**4. App Mobile**
- iOS
- Android
- Notificações push
- Responder conversas

**5. Recursos Enterprise**
- Multi-usuário
- Permissões granulares
- White-label
- API pública
- Webhooks customizados

---

## 10. Considerações Técnicas

### 10.1 Performance

- Server-side rendering (SSR) para SEO
- Client-side rendering para interatividade
- Lazy loading de componentes
- Otimização de imagens
- Cache de queries do banco
- CDN para assets estáticos

### 10.2 Escalabilidade

- Arquitetura serverless (Vercel)
- Database connection pooling
- Rate limiting
- Queue para processamento assíncrono
- Horizontal scaling automático

### 10.3 Monitoramento

- Logs estruturados
- Error tracking (Sentry)
- Performance monitoring
- Uptime monitoring
- Analytics de uso

### 10.4 Backup e Recuperação

- Backup diário do banco
- Point-in-time recovery
- Disaster recovery plan
- Testes de recuperação mensais

---

## 11. Documentação Adicional

Para mais detalhes técnicos, consulte:

- **Schema do Banco:** `documentacao/database/SCHEMA.md`
- **Migrações:** `documentacao/database/MIGRATIONS.md`
- **Relacionamentos:** `documentacao/database/RELATIONSHIPS.md`
- **Fluxo de Autenticação:** `documentacao/fluxos/AUTENTICACAO.md`
- **Fluxo de Pagamento:** `documentacao/fluxos/PAGAMENTO.md`
- **Setup Stripe:** `STRIPE_SETUP.md`
- **Setup Webhook:** `WEBHOOK_SETUP.md`

---

## 12. Glossário

- **MRR:** Monthly Recurring Revenue (Receita Recorrente Mensal)
- **Churn:** Taxa de cancelamento de assinaturas
- **NPS:** Net Promoter Score (Métrica de satisfação)
- **RLS:** Row Level Security (Segurança em nível de linha)
- **SSR:** Server-Side Rendering
- **API:** Application Programming Interface
- **CRM:** Customer Relationship Management
- **SLA:** Service Level Agreement
- **JWT:** JSON Web Token

---

**Última atualização:** Janeiro 2025  
**Próxima revisão:** Fevereiro 2025
