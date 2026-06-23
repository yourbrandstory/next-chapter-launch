import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!client) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY env vars. " +
          "Copy .env.example to .env and fill in your Supabase project values.",
      );
    }
    client = createClient(supabaseUrl, supabaseAnonKey);
  }
  return client;
}
