import { AdCard } from '@/components/chat/ad-card';
import { ChatInput } from '@/components/chat/chat-input';
import { ChatWindow } from '@/components/chat/chat-window';
import {
  getAd,
  getConversation,
  getMessages,
  getUser,
} from '@/supabase/queries';
import { ArrowLeft, Info } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    ad_id?: string;
  }>;
}

export default async function DirectPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { ad_id } = await searchParams;

  const user = await getUser();
  const conversation = await getConversation(id);
  const messages = await getMessages(id);
  const ad = ad_id ? await getAd(ad_id) : null;

  if (!conversation.data || !user?.data) {
    return notFound();
  }

  const otherUser = conversation.data.participants[0].user;

  return (
    <main className="flex h-dvh flex-col bg-background">
      <header className="sticky top-0 flex h-14 items-center justify-between border-b border-border px-4">
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
                  otherUser.avatar_url ?? 'https://avatar.vercel.sh/placeholder'
                }
                alt={otherUser.full_name}
                className="rounded-full object-cover"
                fill
              />
            </div>
            <div>
              <span className="font-semibold text-foreground">
                {otherUser.full_name}
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

      <div className="flex-1 px-3">
        {ad?.data && <AdCard ad={ad.data} />}
        <div className="overflow-y-auto py-4">
          <ChatWindow
            messages={messages.data ?? []}
            user={user.data}
            conversationId={id}
          />
        </div>
      </div>

      <ChatInput conversationId={id} otherUser={otherUser} adId={ad_id} />
    </main>
  );
}
