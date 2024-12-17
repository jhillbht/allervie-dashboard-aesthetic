import React from 'react';
import { Card } from "@/components/ui/card";
import { Crown } from "lucide-react";
import { MarketingChannelCard } from './MarketingChannelCard';
import { MarketingFunnel } from './MarketingFunnel';

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
      {/* Marketing Channel Performance */}
      <div className="bg-gradient-to-br from-card/50 to-secondary/20 backdrop-blur-sm rounded-xl p-6 w-full border border-border/50">
        <h2 className="text-lg font-medium mb-6">Marketing Channel Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {marketingData.map((channel) => (
            <MarketingChannelCard
              key={channel.name}
              {...channel}
              isHighestRevenue={channel.revenue === maxMarketingRevenue}
              isHighestLeads={channel.leads === maxMarketingLeads}
              maxRevenue={maxMarketingRevenue}
              maxLeads={maxMarketingLeads}
            />
          ))}
        </div>
      </div>

      {/* Marketing to Sales Funnel */}
      <div className="bg-gradient-to-br from-card/50 to-secondary/20 backdrop-blur-sm rounded-xl p-6 w-full border border-border/50">
        <h2 className="text-lg font-medium mb-6">Marketing to Sales Funnel</h2>
        <MarketingFunnel
          totalMarketingLeads={totalMarketingLeads}
          totalSalesLeads={totalSalesLeads}
          totalMarketingRevenue={totalMarketingRevenue}
          totalSalesRevenue={totalSalesRevenue}
          conversionRate={conversionRate}
          revenueConversionRate={revenueConversionRate}
        />
      </div>

      {/* Sales Performance */}
      <div className="bg-gradient-to-br from-card/50 to-secondary/20 backdrop-blur-sm rounded-xl p-6 w-full border border-border/50">
        <h2 className="text-lg font-medium mb-6">Sales Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {salesData.map((data) => (
            <Card key={data.title} className="p-6 bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/60 transition-colors">
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
