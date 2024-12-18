import { ChatWindow } from '@/components/chat/chat-window';
import { getConversation } from '@/supabase/queries';
import { ArrowLeft, Info, Send } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function DirectPage({ params }: Props) {
  const { id } = await params;

  const { data: conversation } = await getConversation(id);

  if (!conversation) {
    return notFound();
  }

  const participant = conversation?.participants[0].user;

  return (
    <main className="flex h-dvh flex-col bg-background">
      <header className="flex h-14 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-foreground hover:text-muted-foreground"
          >
            <ArrowLeft className="size-6" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8">
              <Image
                src={
                  participant?.avatar_url ??
                  'https://avatar.vercel.sh/placeholder'
                }
                alt={participant?.full_name ?? ''}
                className="rounded-full object-cover"
                fill
              />
            </div>
            <div>
              <span className="font-semibold text-foreground">
                {participant?.full_name}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button
            type="button"
            className="text-foreground hover:text-muted-foreground"
          >
            <Info className="size-6" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-3">
        <div className="mx-auto max-w-2xl py-4">
          <div className="mb-6">{/* <AdPresentation ad={} user={} /> */}</div>

          <ChatWindow />
        </div>
      </div>

      <div className="border-t border-border px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Message..."
              className="w-full rounded-full bg-muted px-4 py-2 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <button
            type="button"
            className="text-foreground hover:text-muted-foreground"
          >
            <Send className="size-6" />
          </button>
        </div>
      </div>
    </main>
  );
}
