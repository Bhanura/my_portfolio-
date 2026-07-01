/**
 * supabase.ts — Supabase client singleton
 *
 * Creates and exports a single Supabase client instance for use
 * throughout the app (both server-side RSCs and client components).
 *
 * Environment variables required in .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL  — your Supabase project URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY — your Supabase anon/public key
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? '';
const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

// Warn in development if env vars are missing (does NOT throw/crash)
if (process.env.NODE_ENV !== 'production' && (!supabaseUrl || !supabaseKey)) {
  console.warn(
    '[Supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.\n' +
    'Check your .env.local file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
