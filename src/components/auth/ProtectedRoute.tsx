import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole['role'];
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }

    if (!loading && user && requiredRole && user.role !== requiredRole) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate, requiredRole]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <>{children}</> : null;
};