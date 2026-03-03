-- 1. DROP the existing foreign key constraint (which prevents deletion)
-- Note: 'messages_conversation_id_fkey' is the default name. If it fails, check your specific constraint name.
ALTER TABLE messages
DROP CONSTRAINT IF EXISTS messages_conversation_id_fkey;

-- 2. ADD the constraint back with ON DELETE CASCADE
-- This ensures that when a Conversation is deleted, all its Messages are automatically deleted.
ALTER TABLE messages
ADD CONSTRAINT messages_conversation_id_fkey
FOREIGN KEY (conversation_id)
REFERENCES conversations(id)
ON DELETE CASCADE;

-- 3. (Optional) RLS Policy to allow Users to delete their own messages
-- Ensure RLS is enabled on messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it conflicts (optional, safe to run)
DROP POLICY IF EXISTS "Users can delete their own messages" ON messages;

-- Create policy allowing deletion if the user owns the conversation
CREATE POLICY "Users can delete their own messages"
ON messages FOR DELETE
USING (
  auth.uid() IN (
    SELECT user_id FROM conversations WHERE id = conversation_id
  )
);
