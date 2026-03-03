-- Enable Realtime for these tables
alter publication supabase_realtime add table conversations;
alter publication supabase_realtime add table messages;

-- 1. Conversation Policies
alter table conversations enable row level security;

-- Users can only see their own conversations
create policy "Users can view own conversations"
on conversations for select
to authenticated
using (user_id = auth.uid());

-- Users can create their own conversation
create policy "Users can insert own conversation"
on conversations for insert
to authenticated
with check (user_id = auth.uid());

-- Admins can view all conversations
-- (Assuming admins have a specific role or we check a public.users role field matches 'admin')
-- For simplicity/robustness, we'll check the public.users table or a specific claim.
-- Here we assume we check against public.users table for role='admin'
create policy "Admins can view all conversations"
on conversations for select
to authenticated
using (
  exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin'
  )
);

-- Admins can update conversations (e.g. assign/close)
create policy "Admins can update conversations"
on conversations for update
to authenticated
using (
  exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin'
  )
);


-- 2. Message Policies
alter table messages enable row level security;

-- Users can view messages in their own conversations
create policy "Users can view messages in own conversation"
on messages for select
to authenticated
using (
  exists (
    select 1 from conversations
    where id = messages.conversation_id
    and user_id = auth.uid()
  )
);

-- Users can insert messages into their own conversations
create policy "Users can insert messages in own conversation"
on messages for insert
to authenticated
with check (
  exists (
    select 1 from conversations
    where id = conversation_id
    and user_id = auth.uid()
  )
);

-- Admins can view all messages
create policy "Admins can view all messages"
on messages for select
to authenticated
using (
  exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin'
  )
);

-- Admins can reply (insert messages)
create policy "Admins can insert messages"
on messages for insert
to authenticated
with check (
  exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin'
  )
);
