'use client';

import { sendMessageAction } from '@/actions/send-message-action';
import { Button } from '@/components/ui/button';
import { Loader2, Send } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import * as React from 'react';
import { Input } from '../ui/input';

interface Props {
  conversationId: string;
  adId?: string;
}

export function ChatInput({ conversationId, adId }: Props) {
  const formRef = React.useRef<HTMLFormElement>(null);

  const { executeAsync, isPending } = useAction(sendMessageAction);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const content = formData.get('content') as string;

    if (!content.trim()) return;

    await executeAsync({
      conversationId,
      content,
      type: 'text',
      adId,
    });

    form.reset();
  }

  return (
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
  );
}
