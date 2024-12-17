'use client';

import { AdPresentation } from '@/components/chat/ad-presentation';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import type { Database } from '@/supabase/types/db';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';

type Ad = Database['public']['Tables']['ads']['Row'] & {
  user: Database['public']['Tables']['users']['Row'];
};

interface FeaturedAdsProps {
  ads: Ad[];
}

export function FeaturedAds({ ads }: FeaturedAdsProps) {
  return (
    <div className="flex-1 px-4 py-8">
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="mx-auto w-full max-w-sm"
      >
        <CarouselContent>
          {ads.map((ad) => (
            <CarouselItem key={ad.id}>
              <div className="p-1">
                <AdPresentation ad={ad} showFeedActions />
                <div className="mt-4 flex justify-center">
                  <Link
                    href={`/direct/${ad.user_id}`}
                    className={cn(
                      'flex items-center gap-2 rounded-full px-6 py-2.5',
                      'bg-primary text-primary-foreground',
                      'hover:bg-primary/90',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    )}
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span className="font-medium">Send Message</span>
                  </Link>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="top-[35%] left-2" />
        <CarouselNext className="top-[35%] right-2" />
      </Carousel>
    </div>
  );
}
