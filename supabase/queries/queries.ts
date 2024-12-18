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
      user:user_id (
        id,
        username,
        full_name,
        avatar_url
      )
    `)
    .throwOnError();
}
