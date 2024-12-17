import { env } from '@/env';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '../types';

type CreateClientOptions = {
  admin?: boolean;
  schema?: 'public' | 'storage';
};

export async function createClient(options?: CreateClientOptions) {
  const { admin = false, ...rest } = options ?? {};

  const cookieStore = await cookies();

  const key = admin
    ? env.SUPABASE_SERVICE_KEY
    : env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const auth = admin
    ? {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      }
    : {};

  return createServerClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, key, {
    ...rest,
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
    auth,
  });
}
