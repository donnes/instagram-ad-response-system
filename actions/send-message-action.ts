'use server';

import { sendMessageMutation } from '@/supabase/mutations';
import { revalidateTag } from 'next/cache';
import { authActionClient } from './safe-action';
import { sendMessageSchema } from './schema';

export const sendMessageAction = authActionClient
  .schema(sendMessageSchema)
  .action(
    async ({
      parsedInput: { conversationId, content, type, adId },
      ctx: { supabase, user },
    }) => {
      await sendMessageMutation(
        supabase,
        conversationId,
        user.id,
        content,
        type,
        adId,
      );

      revalidateTag(`messages_${conversationId}`);

      return { success: true };
    },
  );
