import React, { useState, useEffect } from 'react';
import { supabase, signInWithGoogle } from '../lib/supabase-auth';

const AuthenticationTester = () => {
  const [authStatus, setAuthStatus] = useState('Not authenticated');
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [scopes, setScopes] = useState<string[]>([]);

  // Check for existing session on component mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setAuthStatus('Authenticated');
        setSessionInfo(session);
        
        // Extract scopes from the provider token if available
        if (session.provider_token) {
          try {
            const tokenPayload = JSON.parse(atob(session.provider_token.split('.')[1]));
            setScopes(tokenPayload.scope ? tokenPayload.scope.split(' ') : []);
          } catch (error) {
            console.error('Error parsing token:', error);
          }
        }
      }
    } catch (error) {
      console.error('Session check error:', error);
      setAuthStatus('Error checking session');
    }
  };

  const handleSignIn = async () => {
    try {
      setAuthStatus('Attempting to sign in...');
      await signInWithGoogle();
      setAuthStatus('Redirecting to Google...');
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
      setScopes([]);
    } catch (error) {
      console.error('Sign out error:', error);
      setAuthStatus('Error signing out');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Authentication Test Panel</h2>
      
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <p><strong>Status:</strong> {authStatus}</p>
      </div>

      {!sessionInfo ? (
        <button
          onClick={handleSignIn}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Sign in with Google
        </button>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-bold mb-2">Session Information</h3>
            <p><strong>User Email:</strong> {sessionInfo.user?.email}</p>
            <p><strong>Provider:</strong> {sessionInfo.user?.app_metadata?.provider}</p>
          </div>

          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-bold mb-2">Granted Scopes</h3>
            <ul className="list-disc pl-5">
              {scopes.map((scope, index) => (
                <li key={index} className="text-sm">{scope}</li>
              ))}
            </ul>
          </div>

          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthenticationTester;