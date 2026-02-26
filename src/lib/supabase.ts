import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlZmF1bHQiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5MzU2OTA3MiwiZXhwIjoxOTI5NDg1MDcyfQ.5uEu2r2JcE_2q_7B_xM8Rk7hB_6AOMx3u0w8mS17R-E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
