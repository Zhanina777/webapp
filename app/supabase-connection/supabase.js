import { createClient } from "@supabase/supabase-js";

const url = import.meta.env?.VITE_SUPABASE_URL;
const key = import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY;

// This SPA also renders once on the server during build. Auth runs in the browser.
export const supabase = typeof window !== "undefined" && url && key ? createClient(url, key) : null;

export function requireSupabase() {
  if (!supabase) throw new Error("Supabase is not configured. Set the values in .env and restart the dev server.");
  return supabase;
}

