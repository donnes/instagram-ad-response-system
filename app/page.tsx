import { AdsFeed } from '@/components/feed/ads-feed';
import { getAds } from '@/supabase/queries';

export default async function HomePage() {
  const { data } = await getAds();

  return (
    <main className="flex min-h-dvh flex-col bg-background">
      <header className="flex h-14 items-center justify-center border-b border-border px-4">
        <h1 className="text-lg font-semibold text-foreground">Feed</h1>
      </header>

      <AdsFeed ads={data ?? []} />
    </main>
  );
}
