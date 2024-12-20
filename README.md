# Instagram Ad Response System

A system for managing and responding to Instagram ad comments using AI.

## Database Schema

### Tables

#### Users
- `id` (uuid, PK): Primary identifier
- `username` (text, unique): User's username
- `full_name` (text): User's full name
- `avatar_url` (text, nullable): URL to user's avatar
- `website_url` (text, nullable): User's website URL
- `instagram_handle` (text, unique, nullable): Instagram username
- `is_business` (boolean): Whether the user is a business account
- `created_at` (timestamp with timezone): Account creation timestamp
- `updated_at` (timestamp with timezone): Last update timestamp

#### Ads
- `id` (uuid, PK): Primary identifier
- `user_id` (uuid, FK): Reference to Users table
- `external_id` (text, unique): External ad identifier
- `created_at` (timestamp with timezone): Ad creation timestamp
- `updated_at` (timestamp with timezone): Last update timestamp
- `image_url` (text): URL to ad image
- `caption` (text): Ad caption
- `deal_text` (text, nullable): Deal information
- `product_name` (text): Name of the product
- `original_price` (decimal(10,2)): Original product price
- `discount_amount` (decimal(5,2), nullable): Discount amount
- `description` (text): Product description
- `variants` (text[]): Product variants
- `ad_placement` (text): Where the ad is placed
- `target_audience` (text[]): Target audience segments
- `ad_objective` (text): Ad objective
- `campaign_type` (text): Type of campaign

#### Conversations
- `id` (uuid, PK): Primary identifier
- `created_at` (timestamp with timezone): Conversation creation timestamp
- `last_message_at` (timestamp with timezone): Timestamp of last message

#### Conversation Participants
- `conversation_id` (uuid, FK): Reference to Conversations table
- `user_id` (uuid, FK): Reference to Users table
- `last_read_at` (timestamp with timezone): When user last read the conversation
- Primary Key: (conversation_id, user_id)

#### Messages
- `id` (uuid, PK): Primary identifier
- `conversation_id` (uuid, FK): Reference to Conversations table
- `sender_id` (uuid, FK): Reference to Users table
- `content` (text): Message content
- `type` (message_type enum): Either 'text' or 'ad_action'
- `ad_id` (uuid, FK, nullable): Reference to Ads table
- `created_at` (timestamp with timezone): Message creation timestamp

#### Typing Status
- `conversation_id` (uuid, FK): Reference to Conversations table
- `user_id` (uuid, FK): Reference to Users table
- `is_typing` (boolean): Whether user is currently typing
- `updated_at` (timestamp with timezone): Last status update timestamp
- Primary Key: (conversation_id, user_id)

### Relationships

1. Users → Ads
   - One-to-Many: A user can have multiple ads
   - Foreign Key: `ads.user_id` references `users.id`

2. Users ↔ Conversations (through Conversation Participants)
   - Many-to-Many: Users can participate in multiple conversations
   - Foreign Keys:
     - `conversation_participants.user_id` references `users.id`
     - `conversation_participants.conversation_id` references `conversations.id`

3. Messages → Conversations
   - One-to-Many: A conversation can have multiple messages
   - Foreign Key: `messages.conversation_id` references `conversations.id`

4. Messages → Users
   - Many-to-One: Messages are sent by users
   - Foreign Key: `messages.sender_id` references `users.id`

5. Messages → Ads
   - Many-to-One: Messages can reference ads
   - Foreign Key: `messages.ad_id` references `ads.id`

### Indexes

- `ads_user_id_idx`: Index on ads(user_id)
- `ads_external_id_idx`: Index on ads(external_id)
- `idx_conversations_last_message_at`: Index on conversations(last_message_at desc)
- `idx_conversation_participants_user_id`: Index on conversation_participants(user_id)
- `idx_messages_conversation_id_created_at`: Index on messages(conversation_id, created_at desc)
- `idx_messages_ad_id`: Index on messages(ad_id)
- `idx_messages_sender_id`: Index on messages(sender_id)
- `idx_typing_status_updated_at`: Index on typing_status(updated_at desc)
- `idx_typing_status_user_id`: Index on typing_status(user_id)

### Enums

- `message_type`:
  - 'text': Regular text message
  - 'ad_action': Message related to an ad action

### Triggers

1. Update Updated Timestamp
   - Automatically updates `updated_at` column when records are modified
   - Applied to: users, ads

2. Update Conversation Last Message
   - Updates `last_message_at` in conversations when new messages are added
   - Trigger: After insert on messages

3. Update Typing Status Timestamp
   - Updates `updated_at` in typing_status when status changes
   - Trigger: Before update on typing_status

### Realtime Enabled Tables
- messages
- typing_status
