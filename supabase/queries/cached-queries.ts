import 'server-only';

import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { createClient } from '../client/server';
import {
  getAdQuery,
  getAdsQuery,
  getConversationQuery,
  getUserQuery,
} from './queries';

export const getSession = cache(async () => {
  // TODO: Implement supabase session
  // const supabase = await createClient();
  // return supabase.auth.getSession();

  // Mocked session
  return {
    data: {
      session: {
        user: {
          id: 'e12e6f9d-8f8e-4f9c-b9e2-8f8e4f9cb9e2',
        },
      },
    },
    error: null,
  };
});

export const getUser = async () => {
  const {
    data: { session },
  } = await getSession();
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  // TODO: Remove admin flag once we have a proper auth flow
  const supabase = await createClient({ admin: true });

  return unstable_cache(
    async () => {
      return getUserQuery(supabase, userId);
    },
    ['user', userId],
    {
      tags: [`user_${userId}`],
      revalidate: 180,
    },
  )();
};

export const getAds = async () => {
  // TODO: Remove admin flag once we have a proper auth flow
  const supabase = await createClient({ admin: true });

  return unstable_cache(
    async () => {
      return getAdsQuery(supabase);
    },
    ['ads'],
    {
      tags: ['ads'],
      revalidate: 180,
    },
  )();
};

export const getAd = async (adId: string) => {
  // TODO: Remove admin flag once we have a proper auth flow
  const supabase = await createClient({ admin: true });

  return unstable_cache(
    async () => {
      return getAdQuery(supabase, adId);
    },
    ['ad', adId],
    {
      tags: [`ad_${adId}`],
      revalidate: 3600,
    },
  )();
};

export const getConversation = async (conversationId: string) => {
  // TODO: Remove admin flag once we have a proper auth flow
  const supabase = await createClient({ admin: true });
  const user = await getUser();
  const userId = user?.data?.id;

  if (!userId) {
    return { data: null, error: null };
  }

  return unstable_cache(
    async () => {
      return getConversationQuery(supabase, conversationId, userId);
    },
    ['conversation', conversationId, userId],
    {
      tags: [`conversation_${conversationId}`],
      revalidate: 3600,
    },
  )();
};
