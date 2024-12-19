'use client';

import { createClient } from '@/supabase/client/client';
import { getUserQuery } from '@/supabase/queries/queries';
import type { Database } from '@/supabase/types/db';
import * as React from 'react';

type Message = Database['public']['Tables']['messages']['Row'] & {
  sender: Database['public']['Tables']['users']['Row'];
};

export function useConversation(conversationId: string) {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [newMessage, setNewMessage] = React.useState<Message | null>(null);

  const supabase = createClient();

  React.useEffect(() => {
    // Set up real-time listener for new messages
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          console.log(newMessage);
          setNewMessage(newMessage);
        },
      )
      .subscribe();

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, supabase]);

  // Handle new messages
  React.useEffect(() => {
    if (newMessage && newMessage.conversation_id === conversationId) {
      const handleAsync = async () => {
        const userId = newMessage.sender_id;
        const user = await getUserQuery(supabase, userId);
        if (user.data) {
          setMessages(
            messages.concat({
              ...newMessage,
              sender: user.data,
            }),
          );
        }
      };
      handleAsync();
    }
  }, [newMessage]);

  return {
    messages,
  };
}
