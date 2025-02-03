import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { LeadChart } from "@/components/dashboard/LeadChart";
import { SourceBreakdown } from "@/components/dashboard/SourceBreakdown";
import { Users, TrendingUp, DollarSign, Target } from "lucide-react";

const Dashboard = () => {
  const kpiData = [
    {
      title: "Total Leads",
      value: "1,234",
      change: "+12.3% from last month",
      icon: Users,
      trend: "up" as const,
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "+0.5% from last month",
      icon: TrendingUp,
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
      title: "Campaign ROI",
      value: "156%",
      change: "No change",
      icon: Target,
      trend: "neutral" as const,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your lead generation overview
          </p>
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

export default Dashboard;