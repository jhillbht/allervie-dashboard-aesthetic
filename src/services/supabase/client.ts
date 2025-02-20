import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Helper function to handle Google OAuth sign-in
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      scopes: [
        'https://www.googleapis.com/auth/analytics.readonly',
        'https://www.googleapis.com/auth/adwords'
      ],
      queryParams: {
        access_type: 'offline',
        prompt: 'consent'
      }
    }
  });

  if (error) {
    console.error('Error signing in with Google:', error.message);
    throw error;
  }

  return data;
};

// Helper function to get user session
export const getUserSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Error getting user session:', error.message);
    throw error;
  }

  return session;
};

// Helper function to handle OAuth callback
export const handleAuthCallback = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Error handling auth callback:', error.message);
    throw error;
  }

  if (session?.provider_token) {
    // Store the provider token for later use with Google APIs
    localStorage.setItem('google_access_token', session.provider_token);
  }

  return session;
};