-- Seed users data
insert into users (
  id,
  username,
  full_name,
  avatar_url,
  website_url,
  instagram_handle
) values (
  'e12e6f9d-8f8e-4f9c-b9e2-8f8e4f9cb9e2',
  'donnes',
  'Donald Silveira',
  'https://avatar.vercel.sh/donnes.svg?text=DS',
  NULL,
  '@donnes'
),
(
  '2d81d8d7-6c6b-4c7b-9cb9-5b8f1d5f5e9a',
  'dailygem',
  'Daily Gem',
  'https://avatar.vercel.sh/dailygem.svg?text=GEM',
  'https://dailygem.com'
  '@dailygem'
),
(
  '3f92d8e8-7d7c-5d8c-ada0-6c9f2e6f6f0b',
  'trycreate',
  'Create',
  'https://avatar.vercel.sh/dailygem.svg?text=C',
  'https://trycreate.co'
  '@trycreate'
),
(
  '4fa3e9f9-8e8d-6e9d-beb1-7d0f3f7f7f1c',
  'safiyaa',
  'Safiyaa',
  'https://avatar.vercel.sh/dailygem.svg?text=S',
  'https://www.safiyaa.com'
  '@safiyaa'
);

-- Seed ads data
insert into ads (
  user_id,
  external_id,
  image_url,
  caption,
  deal_text,
  product_name,
  original_price,
  discount_amount,
  description,
  variants,
  ad_placement,
  target_audience,
  ad_objective,
  campaign_type
) values
(
  '2d81d8d7-6c6b-4c7b-9cb9-5b8f1d5f5e9a', -- Daily Gem user_id
  'ad_001',
  'https://dailygem.com/cdn/shop/files/gembite.png?v=1734023617&width=576',
  'Fuel your day naturally 🌱. Meet GEM Bites – a bite-sized powerhouse of vitamins and superfoods.',
  'Reply and save 15% on your first order!',
  'GEM Bites',
  39.99,
  20.00,
  'GEM Bites are nutrient-dense, plant-based bites that provide essential vitamins and minerals in one delicious chew.',
  array['Cacao', 'Lemon', 'Cinnamon'],
  'Instagram Story',
  array['Health-conscious adults', 'Plant-based eaters', 'Busy professionals'],
  'Brand Awareness',
  'First Order Promotion'
),
(
  '3f92d8e8-7d7c-5d8c-ada0-6c9f2e6f6f0b', -- Create user_id
  'ad_002',
  'https://trycreate.co/cdn/shop/files/SHOT1-create-october-20246125-v2.jpg?v=1730225234&width=1000',
  'Elevate your performance 🏋️. CREATE Creatine is pure, effective, and made for serious athletes.',
  'Reply to buy with 15% off',
  'CREATE Creatine Monohydrate',
  29.99,
  15.00,
  'A clean, high-quality creatine supplement to enhance strength, endurance, and recovery.',
  array['Watermelon', 'Sour Green'],
  'Instagram Story',
  array['Fitness enthusiasts', 'Athletes', 'Gym-goers'],
  'Conversions',
  'Product Launch'
),
(
  '4fa3e9f9-8e8d-6e9d-beb1-7d0f3f7f7f1c', -- Safiyaa user_id
  'ad_003',
  'https://www.safiyaa.com/cdn/shop/files/RS25_DL1085.1_MS-BLACK_ECOM_fr_2500x2500_square.jpg?v=1730197568&width=823',
  'Elegance redefined ✨. Discover the timeless Safiyaa dress collection for your special moments.',
  'reply for 15% off on your first order',
  'Safiyaa Signature Dress',
  1200.00,
  10.00,
  'A beautifully tailored, luxury dress that combines modern design with timeless elegance.',
  array['Black', 'Navy Blue', 'Emerald Green'],
  'Instagram Story',
  array['Luxury shoppers', 'Fashion enthusiasts', 'Event attendees'],
  'Engagement',
  'Limited-Time Offer'
);
