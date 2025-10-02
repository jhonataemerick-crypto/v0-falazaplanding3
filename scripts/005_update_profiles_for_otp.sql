-- Update profiles table to work with Supabase Auth OTP
-- The profile will be created automatically by the trigger when user signs in

-- Add a function to handle user metadata sync
CREATE OR REPLACE FUNCTION public.sync_user_metadata()
RETURNS TRIGGER AS $$
BEGIN
  -- Update profile with user metadata if it exists
  UPDATE public.profiles
  SET 
    name = COALESCE(NEW.raw_user_meta_data->>'name', name),
    updated_at = NOW()
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to sync metadata on auth user updates
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_user_metadata();
