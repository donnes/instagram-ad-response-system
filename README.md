# Instagram Ad Response System

A system for managing and responding to Instagram ad comments using AI.

## 🏗 Architecture

### Frontend Architecture
- **Next.js 15**: Leveraging React Server Components for optimal performance
- **TypeScript**: Full type safety across the application
- **Server Components**: Maximizing performance with RSC architecture
- **Server Actions**: Type-safe server-side operations

### Backend Architecture
- **Route Handlers**: API routes using Next.js App Router
- **WebSocket Integration**: Real-time message updates
- **Webhook Handler**: Processing AI responses asynchronously

## 📚 Main Libraries

### Core Dependencies
- `next`: ^15.0.0
- `react`: ^18.0.0
- `typescript`: ^5.0.0

### UI & Styling
- `shadcn/ui`: Pre-built accessible components
- `tailwindcss`: Utility-first CSS framework

### State Management & Data Fetching
- `@supabase/supabase-js`: Supabase client
- `next-safe-action`: Type-safe server actions
- `zod`: Runtime type validation

### AI & Real-time
- Anthropic API integration
- WebSocket for real-time updates
- Server-Sent Events for streaming responses

## 🔌 Supabase Integration

### Real-time & Webhooks
- **Real-time Message Handling**
    - Postgres Changes feature for instant message updates
    - Realtime subscriptions for typing indicators and presence
    - Automatic broadcasting of AI responses to all participants

- **Webhook Processing Flow**
    - Instagram messages trigger webhook endpoint
    - Messages stored in Supabase with pending status
    - AI processing through edge functions
    - Results broadcasted via realtime channels
    - Automatic conversation updates through database triggers

## 🗄 Database Structure

### Users Table

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | uuid | Primary identifier | PK |
| username | text | User's username | unique |
| full_name | text | User's full name | |
| avatar_url | text | URL to user's avatar | nullable |
| website_url | text | User's website URL | nullable |
| instagram_handle | text | Instagram username | unique, nullable |
| is_business | boolean | Business account flag | |
| created_at | timestamptz | Account creation time | |
| updated_at | timestamptz | Last update time | |

### Ads Table

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | uuid | Primary identifier | PK |
| user_id | uuid | Reference to Users | FK |
| external_id | text | External ad identifier | unique |
| image_url | text | URL to ad image | |
| caption | text | Ad caption | |
| deal_text | text | Deal information | nullable |
| product_name | text | Name of the product | |
| original_price | decimal(10,2) | Original price | |
| discount_amount | decimal(5,2) | Discount amount | nullable |
| description | text | Product description | |
| variants | text[] | Product variants | |
| created_at | timestamptz | Creation timestamp | |
| updated_at | timestamptz | Update timestamp | |

### Conversations Table

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | uuid | Primary identifier | PK |
| created_at | timestamptz | Creation timestamp | |
| last_message_at | timestamptz | Last message time | |

### Conversation Participants Table

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| conversation_id | uuid | Reference to Conversations | FK |
| user_id | uuid | Reference to Users | FK |
| last_read_at | timestamptz | Last read timestamp | |
| PK | | | (conversation_id, user_id) |

### Messages Table

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | uuid | Primary identifier | PK |
| conversation_id | uuid | Reference to Conversations | FK |
| sender_id | uuid | Reference to Users | FK |
| content | text | Message content | |
| type | message_type | Message type enum | |
| ad_id | uuid | Reference to Ads | FK, nullable |
| created_at | timestamptz | Creation timestamp | |

### Typing Status Table

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| conversation_id | uuid | Reference to Conversations | FK |
| user_id | uuid | Reference to Users | FK |
| is_typing | boolean | Current typing status | |
| updated_at | timestamptz | Status update time | |
| PK | | | (conversation_id, user_id) |

### Indexes

| Table | Index Name | Columns |
|-------|------------|---------|
| ads | ads_user_id_idx | user_id |
| ads | ads_external_id_idx | external_id |
| conversations | idx_conversations_last_message_at | last_message_at DESC |
| conversation_participants | idx_conversation_participants_user_id | user_id |
| messages | idx_messages_conversation_id_created_at | (conversation_id, created_at DESC) |
| messages | idx_messages_ad_id | ad_id |
| messages | idx_messages_sender_id | sender_id |
| typing_status | idx_typing_status_updated_at | updated_at DESC |
| typing_status | idx_typing_status_user_id | user_id |

### Realtime Enabled Tables
- messages
- typing_status

### Database Triggers
1. **Update Updated Timestamp**
   - Updates `updated_at` column on record modification
   - Applied to: users, ads

2. **Update Conversation Last Message**
   - Updates `last_message_at` in conversations on new messages
   - Trigger: After insert on messages

3. **Update Typing Status Timestamp**
   - Updates `updated_at` in typing_status on status changes
   - Trigger: Before update on typing_status
