import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type Database = {
  public: {
    Tables: {
      memes: {
        Row: {
          id: string;
          title: string;
          image_url: string;
          user_id: string;
          created_at: string;
          vote_count: number;
        };
        Insert: {
          id?: string;
          title: string;
          image_url: string;
          user_id: string;
          created_at?: string;
          vote_count?: number;
        };
        Update: {
          id?: string;
          title?: string;
          image_url?: string;
          user_id?: string;
          created_at?: string;
          vote_count?: number;
        };
      };
      votes: {
        Row: {
          id: string;
          user_id: string;
          meme_id: string;
          vote_type: 'up' | 'down';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          meme_id: string;
          vote_type: 'up' | 'down';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          meme_id?: string;
          vote_type?: 'up' | 'down';
          created_at?: string;
        };
      };
    };
  };
};