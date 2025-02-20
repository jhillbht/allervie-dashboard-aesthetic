import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Helper function to get the current origin with correct port
const getRedirectUrl = () => {
  const port = 4002; // Match Vite config port
  return typeof window !== 'undefined' 
    ? `${window.location.protocol}//${window.location.hostname}:${port}/auth/callback`
    : '';
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: getRedirectUrl(),
      scopes: [
        'https://www.googleapis.com/auth/analytics.readonly',
        'https://www.googleapis.com/auth/analytics.edit',
        'email',
        'profile'
      ],
      queryParams: {
        access_type: 'offline',
        prompt: 'consent'
      }
    }
  });

  if (error) {
    console.error('OAuth Error:', error.message);
    throw error;
  }

  return data;
};