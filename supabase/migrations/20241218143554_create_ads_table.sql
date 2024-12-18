-- Create ads table
create table ads (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  external_id text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  -- Ad content
  image_url text not null,
  caption text not null,
  deal_text text,

  -- Product details
  product_name text not null,
  original_price decimal(10,2) not null,
  discount_amount decimal(5,2),
  description text not null,
  variants text[] not null default '{}',

  -- Metadata
  ad_placement text not null,
  target_audience text[] not null default '{}',
  ad_objective text not null,
  campaign_type text not null
);

-- Create indexes
create index ads_user_id_idx on ads(user_id);
create index ads_external_id_idx on ads(external_id);

-- Create trigger to automatically update updated_at
create trigger update_ads_updated_at
  before update on ads
  for each row
  execute function update_updated_at_column();