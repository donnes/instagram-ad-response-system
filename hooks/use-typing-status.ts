'use client';

import { createClient } from '@/supabase/client/client';
import type { Database } from '@/supabase/types';
import * as React from 'react';

type TypingStatus = Database['public']['Tables']['typing_status']['Row'];

export function useTypingStatus(conversationId: string, otherUserId: string) {
  const [isTyping, setIsTyping] = React.useState(false);

  const supabase = createClient();

  React.useEffect(() => {
    const channel = supabase
      .channel('typing')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'typing_status',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newTypingStatus = payload.new as TypingStatus;
          if (newTypingStatus.user_id === otherUserId) {
            setIsTyping(newTypingStatus.is_typing);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, otherUserId, supabase]);

  return isTyping;
}
