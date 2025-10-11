-- Script para corrigir e adicionar logs ao trigger de etapa_funil

-- Remover trigger e função existentes se houver
DROP TRIGGER IF EXISTS trigger_update_etapa_funil ON subscriptions;
DROP FUNCTION IF EXISTS update_etapa_funil();

-- Criar função melhorada com logs
CREATE OR REPLACE FUNCTION update_etapa_funil()
RETURNS TRIGGER AS $$
DECLARE
  old_etapa etapa_funil_type;
  new_etapa etapa_funil_type;
BEGIN
  -- Buscar etapa atual do usuário
  SELECT etapa_funil INTO old_etapa
  FROM profiles
  WHERE id = NEW.user_id;

  -- Determinar nova etapa baseado no status da subscription
  IF NEW.status = 'trialing' THEN
    new_etapa := 'Trial';
  ELSIF NEW.status = 'active' THEN
    new_etapa := 'User';
  ELSIF NEW.status IN ('canceled', 'past_due', 'unpaid') THEN
    new_etapa := 'Churn';
  ELSE
    -- Se status não reconhecido, manter como está
    RETURN NEW;
  END IF;

  -- Atualizar etapa_funil apenas se mudou
  IF old_etapa IS DISTINCT FROM new_etapa THEN
    UPDATE profiles
    SET etapa_funil = new_etapa,
        updated_at = NOW()
    WHERE id = NEW.user_id;
    
    -- Log da mudança (aparecerá nos logs do Supabase)
    RAISE NOTICE 'Etapa funil atualizada para user_id %: % -> % (subscription status: %)', 
      NEW.user_id, old_etapa, new_etapa, NEW.status;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger
CREATE TRIGGER trigger_update_etapa_funil
AFTER INSERT OR UPDATE OF status ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_etapa_funil();

-- Comentários
COMMENT ON FUNCTION update_etapa_funil() IS 'Atualiza etapa_funil do profile quando subscription muda de status';
COMMENT ON TRIGGER trigger_update_etapa_funil ON subscriptions IS 'Trigger que chama update_etapa_funil() quando subscription é criada ou atualizada';

-- Atualizar etapa_funil dos usuários existentes baseado nas subscriptions atuais
DO $$
DECLARE
  updated_count INTEGER;
BEGIN
  WITH updates AS (
    UPDATE profiles p
    SET etapa_funil = CASE
      WHEN s.status = 'trialing' THEN 'Trial'::etapa_funil_type
      WHEN s.status = 'active' THEN 'User'::etapa_funil_type
      WHEN s.status IN ('canceled', 'past_due', 'unpaid') THEN 'Churn'::etapa_funil_type
      ELSE p.etapa_funil
    END,
    updated_at = NOW()
    FROM subscriptions s
    WHERE p.id = s.user_id
      AND p.etapa_funil IS DISTINCT FROM CASE
        WHEN s.status = 'trialing' THEN 'Trial'::etapa_funil_type
        WHEN s.status = 'active' THEN 'User'::etapa_funil_type
        WHEN s.status IN ('canceled', 'past_due', 'unpaid') THEN 'Churn'::etapa_funil_type
        ELSE p.etapa_funil
      END
    RETURNING 1
  )
  SELECT COUNT(*) INTO updated_count FROM updates;
  
  RAISE NOTICE 'Atualizados % perfis com base nas subscriptions existentes', updated_count;
END $$;

-- Verificar configuração
SELECT 
  'Trigger configurado corretamente' as status,
  COUNT(*) as total_subscriptions,
  COUNT(DISTINCT user_id) as usuarios_com_subscription
FROM subscriptions;

SELECT 
  'Distribuição de etapas' as info,
  etapa_funil,
  COUNT(*) as total
FROM profiles
GROUP BY etapa_funil
ORDER BY etapa_funil;
