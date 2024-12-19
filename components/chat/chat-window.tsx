'use client';

import { useConversation } from '@/hooks/use-conversation';
import type { Database } from '@/supabase/types/db';
import { format, isToday, isYesterday } from 'date-fns';
import * as React from 'react';
import { type Message, ChatMessage } from './chat-message';

interface Props {
  messages: Message[];
  currentUser: Database['public']['Tables']['users']['Row'];
  conversationId: string;
}

export function ChatWindow({ messages, currentUser, conversationId }: Props) {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const { messages: newMessages } = useConversation(conversationId);

  const allMessages = React.useMemo(() => {
    const combined = [...messages, ...newMessages];
    return combined.reduce<Record<string, typeof combined>>(
      (groups, message) => {
        const date = new Date(message.created_at as string);
        const key = isToday(date)
          ? 'Today'
          : isYesterday(date)
            ? 'Yesterday'
            : format(date, 'dd/MM/yyyy');
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(message);
        return groups;
      },
      {},
    );
  }, [messages, newMessages]);

  return (
    <div className="space-y-4 px-1">
      {Object.entries(allMessages).map(([date, messages]) => (
        <div key={date} className="space-y-2">
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-2 text-xs text-muted-foreground">
                {date}
              </span>
            </div>
          </div>

          {messages.map((message) => {
            if (message.sender_id === currentUser.id) {
              return (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isCurrentUser={true}
                />
              );
            }
            return (
              <ChatMessage
                key={message.id}
                message={message}
                isCurrentUser={false}
              />
            );
          })}
        </div>
      ))}

      <div ref={messagesEndRef} />
    </div>
  );
}
