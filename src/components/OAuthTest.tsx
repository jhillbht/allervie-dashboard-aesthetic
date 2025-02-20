import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const OAuthTest = () => {
  // Track authentication state and user information
  const [authStatus, setAuthStatus] = useState('Checking session...');
  const [sessionInfo, setSessionInfo] = useState<any>(null);

  // Check for existing session on component mount
  useEffect(() => {
    checkSession();
  }, []);

  // Function to check current session status
  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session check error:', error);
        setAuthStatus('Error checking session');
        return;
      }

      if (session) {
        console.log('Active session found:', session);
        setAuthStatus('Authenticated');
        setSessionInfo(session);
      } else {
        console.log('No active session');
        setAuthStatus('Not authenticated');
      }
    } catch (error) {
      console.error('Session check failed:', error);
      setAuthStatus('Error checking session');
    }
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      setAuthStatus('Initiating Google sign-in...');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/adwords'
        }
      });

      if (error) {
        console.error('Sign in error:', error);
        setAuthStatus(`Sign in failed: ${error.message}`);
        return;
      }

      console.log('Sign in initiated:', data);
      setAuthStatus('Redirecting to Google...');
    } catch (error) {
      console.error('Sign in error:', error);
      setAuthStatus('Sign in failed');
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        setAuthStatus('Sign out failed');
        return;
      }
      setAuthStatus('Signed out');
      setSessionInfo(null);
    } catch (error) {
      console.error('Sign out error:', error);
      setAuthStatus('Sign out failed');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>OAuth Flow Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm space-y-2">
          <p className="font-medium">Status: {authStatus}</p>
          
          {sessionInfo && (
            <div className="bg-gray-100 p-4 rounded-md space-y-2">
              <p><strong>User ID:</strong> {sessionInfo.user.id}</p>
              <p><strong>Email:</strong> {sessionInfo.user.email}</p>
              <p><strong>Provider:</strong> {sessionInfo.user.app_metadata.provider}</p>
              {/* Display access token status */}
              <p>
                <strong>Access Token:</strong>{' '}
                {sessionInfo.provider_token ? 'Present' : 'Not present'}
              </p>
            </div>
          )}
        </div>

        <div className="space-x-2">
          {!sessionInfo ? (
            <Button onClick={handleGoogleSignIn}>
              Sign in with Google
            </Button>
          ) : (
            <Button onClick={handleSignOut} variant="destructive">
              Sign Out
            </Button>
          )}
          
          <Button onClick={checkSession} variant="outline">
            Check Session
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OAuthTest;