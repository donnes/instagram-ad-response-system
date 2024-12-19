-- Drop existing trigger and function
drop trigger if exists update_conversation_last_message_at on messages;
drop function if exists update_conversation_last_message_at();

-- Recreate function with schema qualification
create or replace function public.update_conversation_last_message_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  update public.conversations
  set last_message_at = new.created_at
  where id = new.conversation_id;
  return new;
end;
$$;

-- Recreate trigger
create trigger update_conversation_last_message_at
after insert on public.messages
for each row
execute function public.update_conversation_last_message_at();