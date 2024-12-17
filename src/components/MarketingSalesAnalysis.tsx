import React from 'react';
import { Card } from "@/components/ui/card";
import { Crown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MarketingMetrics {
  name: string;
  revenue: number;
  leads: number;
  trafficSource: string;
}

interface SalesMetrics {
  title: string;
  revenue: number;
  leads: number;
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

const salesData: SalesMetrics[] = [
  {
    title: "Inbound",
    revenue: 128450,
    leads: 842,
  },
  {
    title: "Outbound",
    revenue: 95720,
    leads: 634,
  }
];

export function MarketingSalesAnalysis() {
  const maxMarketingRevenue = Math.max(...marketingData.map(channel => channel.revenue));
  const maxMarketingLeads = Math.max(...marketingData.map(channel => channel.leads));
  const maxSalesRevenue = Math.max(...salesData.map(data => data.revenue));
  const totalMarketingLeads = marketingData.reduce((sum, channel) => sum + channel.leads, 0);
  const totalSalesLeads = salesData.reduce((sum, data) => sum + data.leads, 0);
  const totalMarketingRevenue = marketingData.reduce((sum, channel) => sum + channel.revenue, 0);
  const totalSalesRevenue = salesData.reduce((sum, data) => sum + data.revenue, 0);
  const conversionRate = ((totalSalesLeads / totalMarketingLeads) * 100).toFixed(1);
  const revenueConversionRate = ((totalSalesRevenue / totalMarketingRevenue) * 100).toFixed(1);

  return (
    <div className="space-y-8">
      <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 w-full">
        <h2 className="text-lg font-medium mb-6">Marketing Channel Performance</h2>
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
                {(channel.revenue === maxMarketingRevenue || channel.leads === maxMarketingLeads) && (
                  <div className="flex gap-1">
                    {channel.revenue === maxMarketingRevenue && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Crown className="h-6 w-6 text-yellow-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Highest Revenue</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    {channel.leads === maxMarketingLeads && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Crown className="h-6 w-6 text-blue-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Most Leads</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Revenue</span>
                    <span className={`font-medium ${channel.revenue === maxMarketingRevenue ? 'text-green-500' : ''}`}>
                      ${channel.revenue.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Generated Leads</span>
                    <span className={`font-medium ${channel.leads === maxMarketingLeads ? 'text-blue-500' : ''}`}>
                      {channel.leads.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Funnel Visualization */}
      <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 w-full">
        <h2 className="text-lg font-medium mb-6">Marketing to Sales Funnel</h2>
        <div className="relative max-w-2xl mx-auto">
          <div className="space-y-4">
            {/* Marketing Stage */}
            <div className="bg-primary/10 p-4 rounded-t-lg">
              <div className="text-center space-y-2">
                <h3 className="font-medium">Marketing Qualified Leads</h3>
                <p className="text-2xl font-bold">{totalMarketingLeads.toLocaleString()}</p>
                <p className="text-lg text-muted-foreground">
                  Revenue: ${totalMarketingRevenue.toLocaleString()}
                </p>
              </div>
            </div>
            {/* Conversion Arrow */}
            <div className="flex justify-center">
              <div className="text-center bg-secondary/20 px-4 py-2 rounded space-y-1">
                <p className="text-sm text-muted-foreground">Lead Conversion Rate</p>
                <p className="font-medium">{conversionRate}%</p>
                <p className="text-sm text-muted-foreground">Revenue Conversion Rate</p>
                <p className="font-medium">{revenueConversionRate}%</p>
              </div>
            </div>
            {/* Sales Stage */}
            <div className="bg-primary/20 p-4 rounded-b-lg">
              <div className="text-center space-y-2">
                <h3 className="font-medium">Sales Qualified Leads</h3>
                <p className="text-2xl font-bold">{totalSalesLeads.toLocaleString()}</p>
                <p className="text-lg text-muted-foreground">
                  Revenue: ${totalSalesRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Performance */}
      <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 w-full">
        <h2 className="text-lg font-medium mb-6">Sales Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {salesData.map((data) => (
            <Card key={data.title} className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">{data.title}</h3>
                {data.revenue === maxSalesRevenue && <Crown className="h-4 w-4 text-yellow-500" />}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Revenue</p>
                  <p className="text-2xl font-bold">
                    ${data.revenue.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Generated Leads</p>
                  <p className="text-2xl font-bold">{data.leads.toLocaleString()}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}