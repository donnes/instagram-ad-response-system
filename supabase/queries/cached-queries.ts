import 'server-only';

import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { createClient } from '../client/server';
import { getAdsQuery, getMessagesQuery, getUserQuery } from './queries';

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

  const supabase = await createClient();

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
  const supabase = await createClient();

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

export const getMessages = async (receiverId: string) => {
  const {
    data: { session },
  } = await getSession();
  const userId = session?.user?.id;

  if (!userId) {
    return Promise.resolve([]);
  }

  const supabase = await createClient();

  return unstable_cache(
    async () => {
      return getMessagesQuery(supabase, userId, receiverId);
    },
    ['messages', userId, receiverId],
    {
      tags: [`messages_${userId}_${receiverId}`],
      revalidate: 180,
    },
  )();
};
