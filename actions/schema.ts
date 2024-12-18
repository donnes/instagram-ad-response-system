import { z } from 'zod';

export const startConversationSchema = z.object({
  otherUserId: z.string().uuid(),
});
