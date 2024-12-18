'use client';

import { startConversationAction } from '@/actions/start-conversation-action';
import { type Ad, AdPresentation } from '@/components/chat/ad-presentation';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Loader2, MessageCircle } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';

interface FeaturedAdsProps {
  ads: Ad[];
}

export function FeaturedAds({ ads }: FeaturedAdsProps) {
  const { execute, isPending } = useAction(startConversationAction);

  function handleStartConversation(ad: Ad) {
    execute({ otherUserId: ad.user_id });
  }

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
                  <Button
                    onClick={() => handleStartConversation(ad)}
                    className="rounded-full"
                    size="lg"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <MessageCircle />
                    )}
                    <span className="font-medium">Message</span>
                  </Button>
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
