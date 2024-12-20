'use client';

import { sendMessageAction } from '@/actions/send-message-action';
import { updateTypingStatusAction } from '@/actions/update-typing-status-action';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTypingStatus } from '@/hooks/use-typing-status';
import type { Database } from '@/supabase/types';
import debounce from 'lodash.debounce';
import { Loader2, Send } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import * as React from 'react';
import { ChatTypingIndicator } from './chat-typing-indicator';

interface Props {
  conversationId: string;
  otherUser: Database['public']['Tables']['users']['Row'];
  adId?: string;
}

export function ChatInput({ conversationId, otherUser, adId }: Props) {
  const formRef = React.useRef<HTMLFormElement>(null);
  const typingTimeoutRef = React.useRef<NodeJS.Timeout>(null);

  const { execute: executeMessage, isPending } = useAction(sendMessageAction);
  const { execute: executeTyping } = useAction(updateTypingStatusAction);

  const isTyping = useTypingStatus(conversationId, otherUser.id);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const content = formData.get('content') as string;

    if (!content.trim()) return;

    executeTyping({ conversationId, isTyping: false });
    executeMessage({
      conversationId,
      content,
      type: 'text',
      adId,
    });

    form.reset();
  }

  const debouncedStopTyping = React.useCallback(
    () =>
      debounce(() => executeTyping({ conversationId, isTyping: false }), 5000),
    [conversationId, executeTyping],
  );

  function handleInput(event: React.FormEvent<HTMLInputElement>) {
    const content = event.currentTarget.value;
    if (content.trim()) {
      executeTyping({ conversationId, isTyping: true });
      debouncedStopTyping();
    } else {
      executeTyping({ conversationId, isTyping: false });
    }
  }

  return (
    <div className="relative">
      <ChatTypingIndicator isTyping={isTyping} userName={otherUser.full_name} />
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t bg-background p-4"
      >
        <Input
          name="content"
          placeholder="Type a message..."
          className="flex-1 bg-transparent text-sm outline-none border-0"
          disabled={isPending}
          onInput={handleInput}
        />
        <Button
          type="submit"
          size="icon"
          className="rounded-full"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
