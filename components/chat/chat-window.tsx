'use client';

import { cn } from '@/lib/utils';
import type { Database } from '@/supabase/types/db';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

type Message = Database['public']['Tables']['messages']['Row'];
type User = Database['public']['Tables']['users']['Row'];

interface ChatWindowProps {
  messages?: Message[];
  sender?: User;
  receiver?: User;
}

export function ChatWindow({
  messages = [],
  sender,
  receiver,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="space-y-4 px-1">
      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-2 text-xs text-muted-foreground">
            Today
          </span>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <div className="max-w-[70%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2">
          <p className="text-sm text-primary-foreground">
            I'm interested in trying GEM Bites!
          </p>
        </div>
        <div className="relative h-6 w-6 flex-shrink-0">
          <Image
            src="https://avatar.vercel.sh/donnes.svg?text=DS"
            alt="User"
            fill
            className="rounded-full object-cover"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative h-6 w-6 flex-shrink-0">
          <Image
            src="https://avatar.vercel.sh/dailygem.svg?text=GEM"
            alt="Daily Gem"
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div className="max-w-[70%] space-y-1">
          <div className="rounded-2xl rounded-tl-sm bg-secondary px-4 py-2">
            <p className="text-sm text-secondary-foreground">
              Thanks for your interest! 🌟 We're excited to share our special
              offer with you. As mentioned in our ad, you can get 15% off on
              your first order.
            </p>
          </div>
          <div className="rounded-2xl rounded-tl-sm bg-secondary px-4 py-2">
            <p className="text-sm text-secondary-foreground">
              Here's your exclusive checkout link to claim the deal. Happy
              shopping! 🛍️
            </p>
            <button
              type="button"
              className={cn(
                'mt-2 rounded-lg px-4 py-1.5 text-sm font-medium',
                'bg-primary text-primary-foreground hover:bg-primary/90',
                'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
              )}
            >
              Checkout Now
            </button>
          </div>
        </div>
      </div>

      <div ref={messagesEndRef} />
    </div>
  );
}
