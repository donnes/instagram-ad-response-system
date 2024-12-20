import { z } from 'zod';

export const startConversationSchema = z.object({
  otherUserId: z.string().uuid(),
  adId: z.string().uuid().optional(),
});

export const sendMessageSchema = z.object({
  conversationId: z.string().uuid(),
  content: z.string().min(1),
  type: z.enum(['text', 'ad_action']).default('text'),
  adId: z.string().uuid().optional(),
});

export const updateTypingStatusSchema = z.object({
  conversationId: z.string().uuid(),
  isTyping: z.boolean(),
});
