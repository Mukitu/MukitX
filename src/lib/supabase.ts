import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Tables = {
  users: {
    id: string;
    email: string;
    full_name: string;
    avatar_url?: string;
    role: 'user' | 'admin';
    created_at: string;
  };
  courses: {
    id: string;
    title: string;
    description: string;
    instructor: string;
    price: number;
    thumbnail_url: string;
    type: 'recorded' | 'live';
    intro_video_url?: string;
    duration: string;
    created_at: string;
  };
  products: {
    id: string;
    title: string;
    description: string;
    price: number;
    image_url: string;
    download_url: string;
    created_at: string;
  };
  orders: {
    id: string;
    user_id: string;
    item_id: string;
    item_type: 'course' | 'product';
    amount: number;
    status: 'pending' | 'approved' | 'rejected';
    payment_number: string;
    transaction_id: string;
    screenshot_url?: string;
    created_at: string;
  };
};
