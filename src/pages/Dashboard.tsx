import React from 'react';
import { Card } from '@/components/ui/card';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { LineChart } from '@/components/charts/line-chart';

const Dashboard: React.FC = () => {
  const { metrics, chartData, isLoading, error } = useDashboardData();

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-destructive">Failed to load dashboard data</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Metrics cards will go here */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold">Total Leads</h2>
          <p className="mt-2 text-3xl">0</p>
        </Card>
      </div>
      
      <div className="mt-6">
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Lead Analytics</h2>
          <div className="h-[300px]">
            {/* Chart will go here when data is available */}
            <div className="flex h-full items-center justify-center border-2 border-dashed rounded">
              <p className="text-muted-foreground">No data available</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;