import { model } from '@/ai';
import {
  FIRST_MESSAGE_PROMPT,
  generateSystemPrompt,
  SECOND_MESSAGE_PROMPT,
} from '@/ai/prompts';
import { createClient } from '@/supabase/client/server';
import { sendMessageMutation } from '@/supabase/mutations';
import { getAdQuery, getUserQuery } from '@/supabase/queries/queries';
import type { Database } from '@/supabase/types';
import { generateText } from 'ai';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

const WEBHOOK_SECRET = process.env.SUPABASE_WEBHOOK_SECRET;

type InsertPayload = {
  type: 'INSERT';
  table: string;
  schema: string;
  record: Database['public']['Tables']['messages']['Row'];
  old_record: null;
};

export async function POST(request: Request) {
  // Verify webhook secret
  const signature = (await headers()).get('x-webhook-secret');
  if (signature !== WEBHOOK_SECRET) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const payload = (await request.json()) as InsertPayload;
  const { record: message } = payload;

  // Only process customer messages (not AI responses)
  if (!message || message.type === 'ad_action') {
    return new NextResponse('OK');
  }

  try {
    const supabase = await createClient({ admin: true });

    const user = await getUserQuery(supabase, message.sender_id);

    // If the user is a business, we don't need to process the message
    if (user.data?.is_business) {
      return new NextResponse('OK');
    }

    // Get the ad details if this is a conversation about an ad
    if (message.ad_id) {
      const { data: ad } = await getAdQuery(supabase, message.ad_id);

      if (ad) {
        const adContext = {
          brandName: ad.user.full_name,
          productName: ad.product_name,
          discountAmount: ad.discount_amount || 0,
          dealText: ad.deal_text || `${ad.discount_amount}% off`,
          variants: ad.variants,
        };

        const { text: acknowledgmentMessage } = await generateText({
          model: model('claude-3-sonnet'),
          system: generateSystemPrompt(adContext),
          prompt: FIRST_MESSAGE_PROMPT,
        });

        await sendMessageMutation(
          supabase,
          message.conversation_id,
          ad.user_id, // Send as the brand owner
          acknowledgmentMessage.replace(/^"(.*)"$/, '$1'), // Remove quotes if present
          'text',
        );

        const { text: dealMessage } = await generateText({
          model: model('claude-3-sonnet'),
          system: generateSystemPrompt(adContext),
          prompt: SECOND_MESSAGE_PROMPT,
        });

        await sendMessageMutation(
          supabase,
          message.conversation_id,
          ad.user_id, // Send as the brand owner
          dealMessage.replace(/^"(.*)"$/, '$1'), // Remove quotes if present
          'ad_action',
        );
      }
    }

    return new NextResponse('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
