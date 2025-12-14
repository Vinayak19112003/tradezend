import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Throwing here is fine since missing env is a build-time problem.
  throw new Error('Missing Supabase environment variables');
}

let _client: ReturnType<typeof createClient<Database>> | null = null;

function initClient() {
  if (_client) return _client;
  if (typeof window === 'undefined') return null; // avoid browser-only setup on server

  _client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  return _client;
}

export function getSupabase() {
  return initClient();
}

// Export a proxy so existing imports of `supabase` keep working but
// initialization is deferred until first use in the browser.
export const supabase: any = new Proxy(
  {},
  {
    get(_, prop: string) {
      const client = initClient();
      if (!client) return undefined;
      const value = (client as any)[prop];
      return typeof value === 'function' ? value.bind(client) : value;
    },
    set(_, prop: string, value) {
      const client = initClient();
      if (!client) return false;
      (client as any)[prop] = value;
      return true;
    },
    has(_, prop: string) {
      const client = initClient();
      return client ? prop in (client as any) : false;
    },
  }
);
