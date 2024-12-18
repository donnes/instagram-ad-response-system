import { createClient } from '@/supabase/client/server';
import { getUser } from '@/supabase/queries';
import {
  DEFAULT_SERVER_ERROR_MESSAGE,
  createSafeActionClient,
} from 'next-safe-action';

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    if (e instanceof Error) {
      return e.message;
    }

    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});

export const authActionClient = actionClient
  .use(async ({ next, clientInput }) => {
    const result = await next({ ctx: undefined });

    if (process.env.NODE_ENV === 'development') {
      console.log('Input ->', clientInput);
      console.log('Result ->', result.data);
    }

    return result;
  })
  .use(async ({ next }) => {
    const user = await getUser();
    // TODO: Remove admin flag once we have a proper auth flow
    const supabase = await createClient({ admin: true });

    if (!user?.data) {
      throw new Error('Unauthorized');
    }

    return next({
      ctx: {
        supabase,
        user: user.data,
      },
    });
  });
