'use server';

import { updateTypingStatusMutation } from '@/supabase/mutations';
import { authActionClient } from './safe-action';
import { updateTypingStatusSchema } from './schema';

export const updateTypingStatusAction = authActionClient
  .schema(updateTypingStatusSchema)
  .action(
    async ({
      parsedInput: { conversationId, isTyping },
      ctx: { supabase, user },
    }) => {
      await updateTypingStatusMutation(
        supabase,
        conversationId,
        user.id,
        isTyping,
      );

      return { success: true };
    },
  );
