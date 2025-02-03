import { createContext, useContext, useEffect, useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { AuthState, AuthUser } from '@/types/auth';

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
  });
  const supabase = useSupabaseClient();

  useEffect(() => {
    // Check active session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session?.user) {
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();

          const user: AuthUser = {
            id: session.user.id,
            email: session.user.email!,
            role: roleData?.role || 'user',
          };
          setState({ user, loading: false });
        } else {
          setState({ user: null, loading: false });
        }
      } catch (error) {
        console.error('Error:', error);
        setState({ user: null, loading: false });
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        const user: AuthUser = {
          id: session.user.id,
          email: session.user.email!,
          role: roleData?.role || 'user',
        };
        setState({ user, loading: false });
      } else {
        setState({ user: null, loading: false });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <AuthContext.Provider value={state}>
      {children}
    </AuthContext.Provider>
  );
};