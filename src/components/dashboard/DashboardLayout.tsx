import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const supabase = useSupabaseClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate, supabase]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-10">
        {children}
      </div>
    </div>
  );
}