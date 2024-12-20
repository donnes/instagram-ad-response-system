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
        <h2 className="text-sm text-card-foreground">{ad.caption}</h2>

        <Separator />

        <p className="text-sm text-primary">{ad.deal_text}</p>
      </div>
    </div>
  );
}
