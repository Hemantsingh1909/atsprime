import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const isConfigured = !!(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== "your_supabase_url_here" &&
  supabaseAnonKey !== "your_supabase_anon_key_here"
);

if (!isConfigured) {
  console.warn(
    "Supabase credentials are not configured or are placeholder values. AuthContext will fallback to LocalStorage mode."
  );
}

export const supabase: SupabaseClient = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any);

export { isConfigured as isSupabaseConfigured };
