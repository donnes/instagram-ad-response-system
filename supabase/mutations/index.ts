import type { Client } from '../types';

export async function startConversationMutation(
  supabase: Client,
  userId: string,
  otherUserId: string,
) {
  // First, try to find an existing conversation between the users
  const existingConversation = await supabase
    .from('conversations')
    .select(`
      *,
      participants:conversation_participants!inner(user_id)
    `)
    .eq('conversation_participants.user_id', userId)
    .eq('conversation_participants.user_id', otherUserId)
    .single();

  if (existingConversation.data) {
    return existingConversation;
  }

  // If no conversation exists, create a new one
  const newConversation = await supabase
    .from('conversations')
    .insert({})
    .select()
    .single();

  // Add participants to the conversation
  if (newConversation.data) {
    await supabase.from('conversation_participants').insert([
      { conversation_id: newConversation.data.id, user_id: userId },
      { conversation_id: newConversation.data.id, user_id: otherUserId },
    ]);
  }

  return newConversation;
}

export async function sendMessageMutation(
  supabase: Client,
  conversationId: string,
  userId: string,
  content: string,
  type: 'text' | 'ad_action' = 'text',
  adId?: string,
) {
  await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: userId,
      content,
      type,
      ad_id: adId || null,
    })
    .throwOnError();
}
