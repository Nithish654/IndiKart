import { createClient } from '@supabase/supabase-js';

// ⚠️ VITE uses import.meta.env. 
// Your previous code used process.env which does not work here.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug log to check connection in browser console
console.log("Supabase URL:", supabaseUrl ? "Found" : "Missing");
console.log("Supabase Key:", supabaseAnonKey ? "Found" : "Missing");

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
