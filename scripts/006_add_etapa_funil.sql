-- Adiciona coluna etapa_funil na tabela profiles para rastrear estágio do usuário no funil

-- Criar ENUM type para os status do funil
CREATE TYPE etapa_funil_type AS ENUM ('Lead', 'Trial', 'User', 'Churn');

-- Adicionar coluna etapa_funil na tabela profiles
ALTER TABLE profiles
ADD COLUMN etapa_funil etapa_funil_type NOT NULL DEFAULT 'Lead';

-- Adicionar índice para queries rápidas
CREATE INDEX idx_profiles_etapa_funil ON profiles(etapa_funil);

-- Comentários para documentação
COMMENT ON COLUMN profiles.etapa_funil IS 'Estágio do usuário no funil de vendas';
COMMENT ON TYPE etapa_funil_type IS 'Lead: cadastrou mas não assinou | Trial: em período de teste | User: pagante ativo | Churn: cancelou ou parou de pagar';

-- Função para atualizar etapa_funil baseado na subscription
CREATE OR REPLACE FUNCTION update_etapa_funil()
RETURNS TRIGGER AS $$
BEGIN
  -- Se criou subscription com trial
  IF NEW.status = 'trialing' THEN
    UPDATE profiles
    SET etapa_funil = 'Trial'
    WHERE id = NEW.user_id;
  
  -- Se subscription está ativa (passou do trial ou assinou direto)
  ELSIF NEW.status = 'active' THEN
    UPDATE profiles
    SET etapa_funil = 'User'
    WHERE id = NEW.user_id;
  
  -- Se subscription foi cancelada ou está com pagamento atrasado
  ELSIF NEW.status IN ('canceled', 'past_due', 'unpaid') THEN
    UPDATE profiles
    SET etapa_funil = 'Churn'
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para atualizar etapa_funil quando subscription muda
CREATE TRIGGER trigger_update_etapa_funil
AFTER INSERT OR UPDATE OF status ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_etapa_funil();

-- Atualizar etapa_funil dos usuários existentes baseado nas subscriptions atuais
UPDATE profiles p
SET etapa_funil = CASE
  WHEN s.status = 'trialing' THEN 'Trial'::etapa_funil_type
  WHEN s.status = 'active' THEN 'User'::etapa_funil_type
  WHEN s.status IN ('canceled', 'past_due', 'unpaid') THEN 'Churn'::etapa_funil_type
  ELSE 'Lead'::etapa_funil_type
END
FROM subscriptions s
WHERE p.id = s.user_id;
