import type { Database } from '@/supabase/types/db';
import { Heart } from 'lucide-react';
import Image from 'next/image';

type Ad = Database['public']['Tables']['ads']['Row'];
type User = Database['public']['Tables']['users']['Row'];

interface AdPresentationProps {
  ad: Ad;
  user: User;
}

export function AdPresentation({ ad, user }: AdPresentationProps) {
  return (
    <div className="overflow-hidden rounded-xl bg-card">
      <div className="flex items-center gap-3 p-3">
        <div className="relative h-8 w-8">
          <Image
            src={
              user.avatar_url ||
              `https://avatar.vercel.sh/${user.username}.svg?text=${user.full_name.charAt(0)}`
            }
            alt={user.full_name}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div className="flex-1">
          <span className="text-sm font-semibold text-foreground">
            {user.full_name}
          </span>
          <p className="text-xs text-muted-foreground">Sponsored</p>
        </div>
      </div>

      <div className="relative aspect-square">
        <Image
          src={ad.image_url}
          alt={ad.product_name}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="space-y-2 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="text-foreground hover:text-muted-foreground"
            >
              <Heart className="h-6 w-6" />
            </button>
            <span className="text-sm text-foreground">{ad.product_name}</span>
          </div>
        </div>
        <p className="text-sm text-card-foreground">{ad.description}</p>
        {ad.discount_amount && ad.original_price && (
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold text-foreground">
              ${(ad.original_price * (1 - ad.discount_amount / 100)).toFixed(2)}
            </span>
            <span className="text-sm text-muted-foreground line-through">
              ${ad.original_price.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      <div className="border-t border-border p-3">
        <p className="text-sm text-primary">
          {ad.call_to_action || 'Reply to learn more'}
        </p>
      </div>
    </div>
  );
}
