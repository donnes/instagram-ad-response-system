'use server';

import { startConversationMutation } from '@/supabase/mutations';
import { redirect, RedirectType } from 'next/navigation';
import { authActionClient } from './safe-action';
import { startConversationSchema } from './schema';

export const startConversationAction = authActionClient
  .schema(startConversationSchema)
  .action(async ({ parsedInput: { otherUserId }, ctx: { supabase, user } }) => {
    const { data, error } = await startConversationMutation(
      supabase,
      user.id,
      otherUserId,
    );

    if (error) {
      throw new Error(error.message);
    }

    redirect(`/direct/${data.id}`, RedirectType.push);
  });
