import type { Client } from '../types';

export async function getUserQuery(supabase: Client, userId: string) {
  return supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
    .throwOnError();
}

export async function getAdsQuery(supabase: Client) {
  return supabase.from('ads').select(`
      *,
      user:user_id (
        id,
        username,
        full_name,
        avatar_url
      )
    `);
}

export async function getAdQuery(supabase: Client, adId: string) {
  return supabase
    .from('ads')
    .select(`
      *,
      user:user_id (
        id,
        username,
        full_name,
        avatar_url
      )
    `)
    .eq('id', adId)
    .single();
}

export async function getConversationQuery(
  supabase: Client,
  conversationId: string,
  currentUserId: string,
) {
  return supabase
    .from('conversations')
    .select(`
      *,
      participants:conversation_participants!inner(
        user:user_id (
          id,
          full_name,
          avatar_url
        )
      )
    `)
    .eq('id', conversationId)
    .neq('conversation_participants.user_id', currentUserId)
    .single();
}
