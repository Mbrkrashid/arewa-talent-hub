import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://yunndukwecnuirfoagmw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1bm5kdWt3ZWNudWlyZm9hZ213Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3MDY4NTcsImV4cCI6MjA1MDI4Mjg1N30.6KT7VRg7LN-jOIc0kzDxLsOzoHFbv_yreM7Ko2T-W7s";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      }
    }
  }
);