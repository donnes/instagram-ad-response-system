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
  return supabase
    .from('ads')
    .select(`
      *,
      user:user_id (*)
    `)
    .throwOnError();
}

export async function getMessagesQuery(
  supabase: Client,
  senderId: string,
  receiverId: string,
) {
  return supabase
    .from('messages')
    .select(`
      *,
      sender:sender_id (*),
      receiver:receiver_id (*)
    `)
    .eq('sender_id', senderId)
    .eq('receiver_id', receiverId)
    .throwOnError();
}
