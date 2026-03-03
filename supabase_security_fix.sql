-- Fix for "Function Search Path Mutable"
-- We must drop the trigger first because it depends on the function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate the function with a fixed search_path
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role, status)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'name', 
    COALESCE(new.raw_user_meta_data->>'role', 'user'),
    'active'
  );
  RETURN new;
END;
$$;

-- Re-enable the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
