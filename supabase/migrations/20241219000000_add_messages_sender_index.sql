-- Create an index on the sender_id column to improve foreign key performance
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages (sender_id);