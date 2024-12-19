import type { Client } from '../types';

export async function startConversationMutation(
  supabase: Client,
  userId: string,
  otherUserId: string,
) {
  // Find conversations where both users are participants
  const { data: existingConversations } = await supabase
    .from('conversation_participants')
    .select(`
      *,
      conversation:conversation_id(*)
    `)
    .or(`user_id.eq.${userId},user_id.eq.${otherUserId}`);

  // If we found a conversation where both users are participants, return the first one
  if (existingConversations?.length === 2) {
    return {
      data: existingConversations[0].conversation,
      error: null,
    };
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
