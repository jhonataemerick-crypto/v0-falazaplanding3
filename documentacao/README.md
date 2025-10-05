# Documentação FalaZap

Bem-vindo à documentação completa do projeto FalaZap. Esta pasta contém toda a documentação técnica, schemas de banco de dados, fluxos de negócio e guias de configuração.

## Estrutura da Documentação

### 📊 Database
- [Schema do Banco de Dados](./database/SCHEMA.md) - Estrutura completa das tabelas
- [Migrações](./database/MIGRATIONS.md) - Histórico de alterações no banco
- [Relacionamentos](./database/RELATIONSHIPS.md) - Diagrama de relacionamentos entre tabelas

### 🔄 Fluxos de Negócio
- [Autenticação](./fluxos/AUTENTICACAO.md) - Fluxo completo de login, signup e confirmação de email
- [Pagamento](./fluxos/PAGAMENTO.md) - Fluxo de assinatura e integração com Stripe
- [WhatsApp](./fluxos/WHATSAPP.md) - Fluxo de conexão de dispositivos WhatsApp

### ⚙️ Configuração
- [Supabase](./configuracao/SUPABASE.md) - Configuração do Supabase e variáveis de ambiente
- [Stripe](./configuracao/STRIPE.md) - Configuração do Stripe e webhooks
- [Ambiente](./configuracao/ENVIRONMENT.md) - Todas as variáveis de ambiente necessárias

### 🐛 Troubleshooting
- [Problemas Comuns](./troubleshooting/PROBLEMAS_COMUNS.md) - Soluções para erros frequentes
- [Logs e Debug](./troubleshooting/LOGS.md) - Como interpretar logs e fazer debug

### 📝 Histórico
- [Correções Aplicadas](./historico/CORRECOES.md) - Todas as correções e melhorias implementadas
- [Changelog](./historico/CHANGELOG.md) - Histórico de versões e mudanças

## Início Rápido

1. Leia o [Schema do Banco de Dados](./database/SCHEMA.md) para entender a estrutura
2. Configure o [Supabase](./configuracao/SUPABASE.md) e [Stripe](./configuracao/STRIPE.md)
3. Execute os scripts SQL na ordem correta (veja [Migrações](./database/MIGRATIONS.md))
4. Consulte os [Fluxos de Negócio](./fluxos/) para entender como o sistema funciona

## Suporte

Para problemas técnicos, consulte primeiro o [Troubleshooting](./troubleshooting/PROBLEMAS_COMUNS.md).
Para questões de billing ou suporte, acesse [vercel.com/help](https://vercel.com/help).
