-- Criar usuário de teste para desenvolvimento
-- Email: teste@teste.com
-- Senha: teste123

-- Nota: Este script cria um usuário de teste diretamente na tabela auth.users
-- Em produção, sempre use supabase.auth.signUp() para criar usuários

-- Primeiro, verificar se o usuário já existe
DO $$
DECLARE
  test_user_id uuid := '00000000-0000-0000-0000-000000000001';
  test_email text := 'teste@teste.com';
  -- Senha: teste123 (hash bcrypt)
  test_password_hash text := '$2a$10$rqiU8HqZGVZGVZGVZGVZGe7YqZGVZGVZGVZGVZGVZGVZGVZGVZGVZ';
BEGIN
  -- Inserir usuário de teste se não existir
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role,
    aud,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
  )
  VALUES (
    test_user_id,
    '00000000-0000-0000-0000-000000000000',
    test_email,
    crypt('teste123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Usuário Teste"}',
    false,
    'authenticated',
    'authenticated',
    '',
    '',
    '',
    ''
  )
  ON CONFLICT (id) DO NOTHING;

  -- Criar perfil para o usuário de teste
  INSERT INTO public.profiles (id, name, email, created_at, updated_at)
  VALUES (
    test_user_id,
    'Usuário Teste',
    test_email,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

  -- Criar assinatura de teste (Plano PRO)
  INSERT INTO public.subscriptions (
    id,
    user_id,
    plan_name,
    plan_price,
    status,
    created_at,
    updated_at,
    trial_ends_at
  )
  VALUES (
    gen_random_uuid(),
    test_user_id,
    'PRO',
    99.90,
    'active',
    NOW(),
    NOW(),
    NOW() + INTERVAL '30 days'
  )
  ON CONFLICT (user_id) DO NOTHING;

END $$;
