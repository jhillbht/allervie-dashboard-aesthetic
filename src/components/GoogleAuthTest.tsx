import React from 'react';
import { supabase, signInWithGoogle } from '../services/supabase/client';
import { Button } from '@/components/ui/button';

const GoogleAuthTest = () => {
  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Current session:', session);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold mb-4">Google OAuth Test</h1>
      <Button onClick={handleSignIn}>
        Sign in with Google
      </Button>
      <Button variant="outline" onClick={checkSession}>
        Check Session
      </Button>
    </div>
  );
};

export default GoogleAuthTest;