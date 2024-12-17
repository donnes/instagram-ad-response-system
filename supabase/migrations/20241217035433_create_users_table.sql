-- Create users table
create table users (
  id uuid primary key default uuid_generate_v4(),
  username text unique not null,
  full_name text not null,
  avatar_url text,
  instagram_handle text unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create trigger to automatically update updated_at
create trigger update_users_updated_at
  before update on users
  for each row
  execute function update_updated_at_column();