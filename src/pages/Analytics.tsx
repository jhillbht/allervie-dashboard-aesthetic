import { useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { LeadChart } from "@/components/dashboard/LeadChart";
import { SourceBreakdown } from "@/components/dashboard/SourceBreakdown";
import { KPICard } from "@/components/dashboard/KPICard";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, DollarSign, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Analytics = () => {
  const supabase = useSupabaseClient();
  const { toast } = useToast();

  // Fetch lead sources
  const { data: leadSources } = useQuery({
    queryKey: ['leadSources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lead_sources')
        .select('*');
      if (error) throw error;
      return data;
    },
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('analytics_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lead_sources',
        },
        (payload) => {
          console.log('Change received!', payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handleExport = async () => {
    try {
      const { data, error } = await supabase
        .from('lead_sources')
        .select(`
          *,
          conversions(*),
          acquisition_costs(*)
        `);

      if (error) throw error;

      const csvContent = "data:text/csv;charset=utf-8," + 
        encodeURIComponent(JSON.stringify(data, null, 2));
      
      const link = document.createElement("a");
      link.setAttribute("href", csvContent);
      link.setAttribute("download", "analytics_export.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export successful",
        description: "Your analytics data has been exported.",
      });
    } catch (error: any) {
      toast({
        title: "Export failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const kpiData = [
    {
      title: "Total Leads",
      value: leadSources?.length || 0,
      change: "+12.3% from last month",
      icon: TrendingUp,
      trend: "up" as const,
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "+0.5% from last month",
      icon: Target,
      trend: "up" as const,
    },
    {
      title: "Cost per Lead",
      value: "$45.67",
      change: "-2.3% from last month",
      icon: DollarSign,
      trend: "down" as const,
    },
    {
      title: "ROI",
      value: "156%",
      change: "No change",
      icon: Target,
      trend: "neutral" as const,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Track your marketing performance and ROI
            </p>
          </div>
          <Button onClick={handleExport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpiData.map((kpi) => (
            <KPICard key={kpi.title} {...kpi} />
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <LeadChart />
          <SourceBreakdown />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;