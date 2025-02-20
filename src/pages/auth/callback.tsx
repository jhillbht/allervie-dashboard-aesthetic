import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase-auth';
import GA4AccountSelector from '../../components/GA4AccountSelector';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [hasSelectedAccount, setHasSelectedAccount] = useState(false);

  useEffect(() => {
    checkAuthAndAccount();
  }, []);

  const checkAuthAndAccount = async () => {
    try {
      // Check if we have an active session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }

      // Check if user has already selected a GA4 account
      const { data: accounts } = await supabase
        .from('user_google_accounts')
        .select('ga4_account_id')
        .eq('user_id', session.user.id)
        .single();

      if (accounts?.ga4_account_id) {
        setHasSelectedAccount(true);
        navigate('/dashboard');
        return;
      }

      // If we reach here, user needs to select an account
      setAuthChecked(true);
    } catch (error) {
      console.error('Auth callback error:', error);
      navigate('/login');
    }
  };

  // Show loading state while checking auth
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // If auth is checked but user hasn't selected an account, show selector
  if (!hasSelectedAccount) {
    return <GA4AccountSelector />;
  }

  return null;
};

export default AuthCallback;