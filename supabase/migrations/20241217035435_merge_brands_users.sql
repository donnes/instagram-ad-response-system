-- Add website_url to users table
alter table users
add column website_url text;

-- Copy brand data to users table
insert into users (id, username, full_name, avatar_url, website_url, instagram_handle)
select
  id,
  slug as username,
  name as full_name,
  'https://avatar.vercel.sh/' || slug || '.svg?text=' || upper(left(name, 1)) as avatar_url,
  website_url,
  '@' || slug as instagram_handle
from brands
on conflict (id) do update set
  website_url = excluded.website_url;

-- Update ads table to reference user_id instead of brand_id
alter table ads
add column user_id uuid references users(id);

-- Copy brand_id to user_id
update ads
set user_id = brand_id;

-- Make user_id not null and drop brand_id
alter table ads
alter column user_id set not null,
drop column brand_id;

-- Drop the brands table
drop table brands cascade;

-- Create indexes if they don't exist
create index if not exists ads_user_id_idx on ads(user_id);
create index if not exists ads_external_id_idx on ads(external_id);
create index if not exists messages_sender_id_idx on messages(sender_id);
create index if not exists messages_receiver_id_idx on messages(receiver_id);
create index if not exists messages_created_at_idx on messages(created_at desc);
create index if not exists messages_conversation_idx on messages(sender_id, receiver_id, created_at desc);