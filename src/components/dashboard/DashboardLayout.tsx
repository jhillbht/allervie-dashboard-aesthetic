import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { LayoutDashboard, Users, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createClientComponentClient } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "Successfully logged out of your account.",
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Leads", path: "/dashboard/leads" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarContent className="flex flex-col h-full">
            <div className="p-4">
              <img
                src="/placeholder.svg"
                alt="Allervie Health"
                className="h-8"
              />
            </div>
            <nav className="flex-1">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 transition-colors"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 transition-colors mt-auto mb-4"
            >
              <LogOut className="h-5 w-5" />
              <span>Log out</span>
            </button>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 p-8">
          <SidebarTrigger className="mb-4" />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}