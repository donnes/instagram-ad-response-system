-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create brands table
create table brands (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null, -- e.g., 'dailygem', 'trycreate', 'safiyaa'
  name text not null,       -- e.g., 'Daily Gem', 'Create', 'Safiyaa'
  website_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create function to automatically update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create trigger to automatically update updated_at
create trigger update_brands_updated_at
  before update on brands
  for each row
  execute function update_updated_at_column();