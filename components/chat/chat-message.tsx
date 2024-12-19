import { cn } from '@/lib/utils';
import type { Database } from '@/supabase/types';
import Image from 'next/image';

export type Message = Database['public']['Tables']['messages']['Row'] & {
  sender: Database['public']['Tables']['users']['Row'];
  ad?: Database['public']['Tables']['ads']['Row'] | null;
};

interface Props {
  message: Message;
  isCurrentUser: boolean;
}

export function ChatMessage({ message, isCurrentUser }: Props) {
  return (
    <div
      className={cn('flex gap-2', {
        'items-start justify-start flex-row-reverse': isCurrentUser,
      })}
    >
      <div className="relative h-6 w-6 flex-shrink-0">
        <Image
          src={
            message.sender.avatar_url || 'https://avatar.vercel.sh/placeholder'
          }
          alt={message.sender.full_name}
          className="rounded-full object-cover"
          fill
        />
      </div>
      <div className="max-w-[70%] space-y-1">
        <div
          className={cn('rounded-2xl px-4 py-2', {
            'rounded-tr-sm bg-primary': isCurrentUser,
            'rounded-tl-sm bg-secondary': !isCurrentUser,
          })}
        >
          <p
            className={cn('text-sm', {
              'text-primary-foreground': isCurrentUser,
              'text-secondary-foreground': !isCurrentUser,
            })}
          >
            {message.content}
          </p>
          {message.type === 'ad_action' && (
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
          )}
        </div>
      </div>
    </div>
  );
}
