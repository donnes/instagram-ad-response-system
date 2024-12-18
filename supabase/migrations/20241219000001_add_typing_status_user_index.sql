-- Create an index on the user_id column to improve foreign key performance
CREATE INDEX IF NOT EXISTS idx_typing_status_user_id ON public.typing_status (user_id);