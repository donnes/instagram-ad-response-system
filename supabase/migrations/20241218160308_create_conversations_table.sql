-- Create message types enum
create type message_type as enum ('text', 'ad_action');

-- Create conversations table (one conversation per user pair)
create table conversations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  last_message_at timestamp with time zone default now()
);

-- Create conversation participants table (who's in the conversation)
create table conversation_participants (
  conversation_id uuid not null references conversations(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  last_read_at timestamp with time zone default now(),
  primary key (conversation_id, user_id)
);

-- Create messages table
create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id uuid not null references users(id) on delete cascade,
  content text not null,
  type message_type not null default 'text',
  ad_id uuid references ads(id),
  created_at timestamp with time zone default now()
);

-- Create typing status table
create table typing_status (
  conversation_id uuid not null references conversations(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  is_typing boolean not null default false,
  updated_at timestamp with time zone default now(),
  primary key (conversation_id, user_id)
);

-- Add indexes for better query performance
create index idx_conversations_last_message_at on conversations(last_message_at desc);
create index idx_conversation_participants_user_id on conversation_participants(user_id);
create index idx_messages_conversation_id_created_at on messages(conversation_id, created_at desc);
create index idx_messages_ad_id on messages(ad_id);
create index idx_typing_status_updated_at on typing_status(updated_at desc);

-- Function to update conversation last_message_at
create function update_conversation_last_message_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  update conversations
  set last_message_at = new.created_at
  where id = new.conversation_id;
  return new;
end;
$$;

-- Trigger to update conversation last_message_at
create trigger update_conversation_last_message_at
after insert on messages
for each row
execute function update_conversation_last_message_at();

-- Function to auto-update typing_status updated_at
create function update_typing_status_timestamp()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Trigger to auto-update typing_status timestamp
create trigger update_typing_status_timestamp
before update on typing_status
for each row
execute function update_typing_status_timestamp();

-- Enable realtime for messages
alter publication supabase_realtime add table messages;

-- Enable realtime for typing_status
alter publication supabase_realtime add table typing_status;