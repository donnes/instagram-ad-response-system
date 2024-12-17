-- Create messages table
create table messages (
  id uuid primary key default uuid_generate_v4(),
  sender_id uuid not null references users(id) on delete cascade,
  receiver_id uuid not null references users(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for common queries
create index messages_sender_id_idx on messages(sender_id);
create index messages_receiver_id_idx on messages(receiver_id);
create index messages_created_at_idx on messages(created_at desc);

-- Create composite index for conversation queries
create index messages_conversation_idx on messages(sender_id, receiver_id, created_at desc);

-- Create trigger to automatically update updated_at
create trigger update_messages_updated_at
  before update on messages
  for each row
  execute function update_updated_at_column();