/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://khozfksgiqkzjjgiymzn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtob3pma3NnaXFrempqZ2l5bXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4MDA2NjEsImV4cCI6MjA4NTM3NjY2MX0.Wc4ZkUaSNM-ujgwBO3AVvqQRuHIfkagPew_8M9BKi8g';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase URL or Anon Key is missing. Please check your environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
