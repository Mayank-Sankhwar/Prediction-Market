import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ??
  "https://ydhmphjngomaionfbmqu.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  "sb_publishable_v2bVeKRRgw0Xa-vhlSmZgQ_Be-qv9KA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
