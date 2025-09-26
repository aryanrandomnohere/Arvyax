import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set up your Supabase project.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      wellness_sessions: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          tags: string[];
          json_url: string;
          status: 'draft' | 'published';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string;
          tags?: string[];
          json_url?: string;
          status?: 'draft' | 'published';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          tags?: string[];
          json_url?: string;
          status?: 'draft' | 'published';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};