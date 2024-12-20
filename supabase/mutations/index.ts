import type { Client } from '../types';

export async function startConversationMutation(
  supabase: Client,
  userId: string,
  otherUserId: string,
) {
  // Query conversations for the current user
  const { data: userConversations } = await supabase
    .from('conversation_participants')
    .select('conversation_id')
    .eq('user_id', userId);

  // Query for existing conversations between the two users
  const { data: existingConversations } = await supabase
    .from('conversation_participants')
    .select('conversation_id')
    .eq('user_id', otherUserId)
    .in(
      'conversation_id',
      userConversations?.map((c) => c.conversation_id) || [],
    );

  if (existingConversations?.length) {
    return await supabase
      .from('conversations')
      .select()
      .eq('id', existingConversations[0].conversation_id)
      .single();
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
