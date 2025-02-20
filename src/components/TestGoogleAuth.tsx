import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase-auth';

const TestGoogleAuth = () => {
  const [authStatus, setAuthStatus] = useState('Not authenticated');
  const [sessionInfo, setSessionInfo] = useState<any>(null);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setAuthStatus('Authenticated');
        setSessionInfo(session);
        console.log('Session info:', session);
      }
    } catch (error) {
      console.error('Session check error:', error);
      setAuthStatus('Error checking session');
    }
  };

  const handleSignIn = async () => {
    try {
      setAuthStatus('Attempting to sign in...');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: [
            'https://www.googleapis.com/auth/analytics.readonly',
            'https://www.googleapis.com/auth/analytics.edit'
          ],
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
      
      setAuthStatus('Redirecting to Google...');
      console.log('Sign-in initiated:', data);
    } catch (error) {
      console.error('Sign in error:', error);
      setAuthStatus(`Error: ${error.message}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setAuthStatus('Signed out');
      setSessionInfo(null);
    } catch (error) {
      console.error('Sign out error:', error);
      setAuthStatus('Error signing out');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Google Auth Test</h2>
      
      {/* Status Display */}
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <p><strong>Status:</strong> {authStatus}</p>
      </div>

      {/* Session Info */}
      {sessionInfo && (
        <div className="mb-4 p-4 bg-gray-100 rounded">
          <h3 className="font-bold mb-2">Session Information</h3>
          <p><strong>User Email:</strong> {sessionInfo.user?.email}</p>
          <p><strong>Access Token Available:</strong> {sessionInfo.provider_token ? 'Yes' : 'No'}</p>
          <pre className="mt-2 p-2 bg-gray-200 rounded text-xs overflow-auto">
            {JSON.stringify(sessionInfo, null, 2)}
          </pre>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2">
        {!sessionInfo ? (
          <button
            onClick={handleSignIn}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Sign in with Google
          </button>
        ) : (
          <button
            onClick={handleSignOut}
            className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Sign Out
          </button>
        )}
      </div>
    </div>
  );
};

export default TestGoogleAuth;