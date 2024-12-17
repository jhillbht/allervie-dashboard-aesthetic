import React from 'react';
import { Card } from "@/components/ui/card";
import { Crown } from "lucide-react";

interface MarketingMetrics {
  name: string;
  revenue: number;
  leads: number;
  trafficSource: string;
}

const marketingData: MarketingMetrics[] = [
  {
    name: "Organic Search",
    revenue: 75000,
    leads: 850,
    trafficSource: "SEO"
  },
  {
    name: "Paid Search",
    revenue: 45000,
    leads: 620,
    trafficSource: "PPC"
  },
  {
    name: "Email Marketing",
    revenue: 54000,
    leads: 980,
    trafficSource: "Email"
  }
];

export function MarketingComparison() {
  const maxRevenue = Math.max(...marketingData.map(channel => channel.revenue));
  const maxLeads = Math.max(...marketingData.map(channel => channel.leads));

  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 w-full">
      <h2 className="text-lg font-medium mb-6">Inbound Marketing vs Outbound Marketing</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {marketingData.map((channel) => (
          <Card key={channel.name} className="p-4 relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium">{channel.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  via {channel.trafficSource}
                </p>
              </div>
              {(channel.revenue === maxRevenue || channel.leads === maxLeads) && (
                <div className="flex gap-1">
                  {channel.revenue === maxRevenue && (
                    <Crown className="h-6 w-6 text-yellow-500" title="Highest Revenue" />
                  )}
                  {channel.leads === maxLeads && (
                    <Crown className="h-6 w-6 text-blue-500" title="Most Leads" />
                  )}
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Revenue</span>
                  <span className={`font-medium ${channel.revenue === maxRevenue ? 'text-green-500' : ''}`}>
                    ${channel.revenue.toLocaleString()}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Generated Leads</span>
                  <span className={`font-medium ${channel.leads === maxLeads ? 'text-blue-500' : ''}`}>
                    {channel.leads.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}