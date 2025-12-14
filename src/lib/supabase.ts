import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

console.log('Supabase Config Debug:', {
  urlExists: !!supabaseUrl,
  urlLength: supabaseUrl?.length,
  keyExists: !!supabaseAnonKey,
  keyLength: supabaseAnonKey?.length,
  nodeEnv: process.env.NODE_ENV
});

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: typeof window !== 'undefined',
    autoRefreshToken: typeof window !== 'undefined',
  },
});

export function getSupabase() {
  return supabase;
}
