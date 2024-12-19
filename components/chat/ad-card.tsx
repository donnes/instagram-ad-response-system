import { Separator } from '@/components/ui/separator';
import type { Database } from '@/supabase/types/db';
import Image from 'next/image';

export type Ad = Database['public']['Tables']['ads']['Row'];

interface Props {
  ad: Ad;
}

export function AdCard({ ad }: Props) {
  return (
    <div className="flex flex-row overflow-hidden bg-muted rounded-md mt-3 p-3">
      <div className="relative aspect-square h-20 w-20">
        <Image
          src={ad.image_url}
          alt={ad.product_name}
          className="object-cover"
          fill
          priority
        />
      </div>

      <div className="space-y-2 ml-3">
        <div className="flex items-center flex-row">
          <h2 className="text-md text-card-foreground">{ad.product_name}</h2>

          <span className="size-1 bg-foreground rounded-full mx-2" />

          {ad.discount_amount && ad.original_price && (
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-semibold text-foreground">
                $
                {(ad.original_price * (1 - ad.discount_amount / 100)).toFixed(
                  2,
                )}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                ${ad.original_price.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        <Separator />

        <p className="text-sm text-primary">{ad.deal_text}</p>
      </div>
    </div>
  );
}
