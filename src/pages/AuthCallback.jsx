import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase-auth';
import { GA4AccountSelector } from '../components/GA4AccountSelector';

export const AuthCallback = () => {
  const [authChecked, setAuthChecked] = useState(false);
  const [hasSelectedAccount, setHasSelectedAccount] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        window.location.href = '/login';
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
        window.location.href = '/dashboard';
      }

      setAuthChecked(true);
    } catch (error) {
      console.error('Auth check failed:', error);
      window.location.href = '/login';
    }
  };

  if (!authChecked) {
    return <div>Verifying authentication...</div>;
  }

  if (!hasSelectedAccount) {
    return <GA4AccountSelector />;
  }

  return null;
};