-- 1. Create a function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public."User" (id, email, name, avatar, role, "updatedAt")
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    'user', -- Default role
    NOW()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the trigger to call the function on new auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Backfill existing users from auth.users to public."User"
-- This ensures your current login works and you exist in the table
INSERT INTO public."User" (id, email, name, role, "updatedAt")
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'full_name', 'User'), 
  'user',
  NOW()
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 4. Promote specific email to ADMIN
-- REPLACE 'damnbayu@gmail.com' with your actual email if different
UPDATE public."User"
SET role = 'admin'
WHERE email = 'damnbayu@icloud.com' OR email = 'damnbayu@gmail.com';  -- Covering both likely emails
