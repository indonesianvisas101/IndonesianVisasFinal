-- ==========================================
-- SUPER ADMIN DELETION FIX & CASCADE SETUP
-- ==========================================

-- 1. ENABLE RLS (Row Level Security)
-- Ensure security policies are active
ALTER TABLE "conversations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "messages" ENABLE ROW LEVEL SECURITY;

-- 2. CREATE ADMIN DELETE POLICIES
-- Allow users with role='admin' to DELETE ANY conversation
DROP POLICY IF EXISTS "Admins can delete any conversation" ON "conversations";
CREATE POLICY "Admins can delete any conversation"
ON "conversations" FOR DELETE
USING (
  (SELECT role FROM "users" WHERE id = auth.uid()) = 'admin'
);

-- Allow users with role='admin' to DELETE ANY message
DROP POLICY IF EXISTS "Admins can delete any message" ON "messages";
CREATE POLICY "Admins can delete any message"
ON "messages" FOR DELETE
USING (
  (SELECT role FROM "users" WHERE id = auth.uid()) = 'admin'
);


-- 3. FIX CASCADE DELETION (Foreign Key)
-- This ensures deleting a conversation automatically wipes its messages
-- First, drop the old constraint if it exists (ignoring errors if not found requires DO block, but simple DROP is safer here if known name)
ALTER TABLE "messages"
DROP CONSTRAINT IF EXISTS "messages_conversation_id_fkey";

-- Re-add with ON DELETE CASCADE
ALTER TABLE "messages"
ADD CONSTRAINT "messages_conversation_id_fkey"
FOREIGN KEY ("conversation_id")
REFERENCES "conversations"("id")
ON DELETE CASCADE;

-- 4. GRANT PERMISSIONS (Just in case standard roles need it)
GRANT DELETE ON "conversations" TO authenticated;
GRANT DELETE ON "messages" TO authenticated;

-- Confirmation
SELECT 'Admin Deletion Policies Applied Successfully' as status;
