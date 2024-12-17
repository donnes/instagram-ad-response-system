-- Create enum for message types
create type message_type as enum ('text', 'ad_action');

-- Create conversations table
create table conversations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  last_message_at timestamp with time zone default now(),
  ad_id uuid references ads(id)
);

-- Create conversation_participants table
create table conversation_participants (
  conversation_id uuid not null references conversations(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  last_read_at timestamp with time zone default now(),
  primary key (conversation_id, user_id)
);

-- Drop existing messages table constraints
alter table messages
  drop constraint if exists messages_sender_id_fkey,
  drop constraint if exists messages_receiver_id_fkey;

-- Modify messages table
alter table messages
  drop column receiver_id,
  add column conversation_id uuid references conversations(id) on delete cascade,
  add column type message_type not null default 'text';

-- Add foreign key for sender_id
alter table messages
  add constraint messages_sender_id_fkey
  foreign key (sender_id)
  references users(id)
  on delete cascade;

-- Create indexes for better query performance
create index idx_conversations_last_message_at on conversations(last_message_at desc);
create index idx_conversation_participants_user_id on conversation_participants(user_id);
create index idx_messages_conversation_id on messages(conversation_id);

-- Function to update conversation last_message_at
create or replace function update_conversation_last_message_at()
returns trigger as $$
begin
  update conversations
  set last_message_at = new.created_at
  where id = new.conversation_id;
  return new;
end;
$$ language plpgsql;

-- Trigger to update conversation last_message_at
create trigger update_conversation_last_message_at
after insert on messages
for each row
execute function update_conversation_last_message_at();
