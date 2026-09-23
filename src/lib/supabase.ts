import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Whether Supabase backend credentials are present.
 * The app boots without them (auth/data features stay disabled)
 * instead of crashing at import time.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

function createSupabaseClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured) {
    if (typeof window !== 'undefined') {
      console.warn(
        'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and ' +
          'NEXT_PUBLIC_SUPABASE_ANON_KEY to enable auth and data features.'
      );
    }
    return null;
  }
  return createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

/**
 * Supabase client, or null when backend credentials are missing.
 * Always check `isSupabaseConfigured` / null before use.
 */
export const supabase: SupabaseClient<Database> | null = createSupabaseClient();
