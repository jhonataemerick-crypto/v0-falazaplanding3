-- Script de diagnóstico para verificar o estado das subscriptions e etapas do funil

-- 1. Verificar se o trigger existe
SELECT 
  'TRIGGER STATUS' as check_type,
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'trigger_update_etapa_funil';

-- 2. Verificar subscriptions existentes
SELECT 
  'SUBSCRIPTIONS' as check_type,
  COUNT(*) as total,
  COUNT(DISTINCT user_id) as usuarios_unicos,
  COUNT(DISTINCT stripe_subscription_id) as subscriptions_stripe_unicas
FROM subscriptions;

-- 3. Verificar distribuição de status nas subscriptions
SELECT 
  'STATUS DISTRIBUTION' as check_type,
  status,
  COUNT(*) as total
FROM subscriptions
GROUP BY status
ORDER BY total DESC;

-- 4. Verificar distribuição de etapas do funil
SELECT 
  'ETAPA FUNIL DISTRIBUTION' as check_type,
  etapa_funil,
  COUNT(*) as total
FROM profiles
GROUP BY etapa_funil
ORDER BY 
  CASE etapa_funil
    WHEN 'Lead' THEN 1
    WHEN 'Trial' THEN 2
    WHEN 'User' THEN 3
    WHEN 'Churn' THEN 4
  END;

-- 5. Verificar usuários com subscription mas etapa errada
SELECT 
  'INCONSISTENCIAS' as check_type,
  p.id,
  p.email,
  p.etapa_funil as etapa_atual,
  s.status as subscription_status,
  CASE
    WHEN s.status = 'trialing' THEN 'Trial'
    WHEN s.status = 'active' THEN 'User'
    WHEN s.status IN ('canceled', 'past_due', 'unpaid') THEN 'Churn'
    ELSE 'Lead'
  END as etapa_esperada
FROM profiles p
LEFT JOIN subscriptions s ON p.id = s.user_id
WHERE s.id IS NOT NULL
  AND p.etapa_funil::text != CASE
    WHEN s.status = 'trialing' THEN 'Trial'
    WHEN s.status = 'active' THEN 'User'
    WHEN s.status IN ('canceled', 'past_due', 'unpaid') THEN 'Churn'
    ELSE 'Lead'
  END;

-- 6. Verificar últimas subscriptions criadas
SELECT 
  'ULTIMAS SUBSCRIPTIONS' as check_type,
  s.id,
  s.user_id,
  p.email,
  s.stripe_subscription_id,
  s.status,
  p.etapa_funil,
  s.created_at
FROM subscriptions s
JOIN profiles p ON s.user_id = p.id
ORDER BY s.created_at DESC
LIMIT 10;

-- 7. Verificar usuários sem subscription
SELECT 
  'USUARIOS SEM SUBSCRIPTION' as check_type,
  COUNT(*) as total,
  COUNT(CASE WHEN etapa_funil = 'Lead' THEN 1 END) as leads,
  COUNT(CASE WHEN etapa_funil != 'Lead' THEN 1 END) as outros
FROM profiles p
LEFT JOIN subscriptions s ON p.id = s.user_id
WHERE s.id IS NULL;
