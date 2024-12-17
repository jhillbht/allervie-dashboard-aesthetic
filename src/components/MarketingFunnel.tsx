import React from 'react';
import { Crown } from "lucide-react";

interface MarketingFunnelProps {
  totalMarketingLeads: number;
  totalSalesLeads: number;
  totalMarketingRevenue: number;
  totalSalesRevenue: number;
  conversionRate: string;
  revenueConversionRate: string;
}

export function MarketingFunnel({
  totalMarketingLeads,
  totalSalesLeads,
  totalMarketingRevenue,
  totalSalesRevenue,
  conversionRate,
  revenueConversionRate
}: MarketingFunnelProps) {
  // Determine which stage has higher metrics
  const marketingLeadsHigher = totalMarketingLeads > totalSalesLeads;
  const marketingRevenueHigher = totalMarketingRevenue > totalSalesRevenue;

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="space-y-4">
        {/* Marketing Stage */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-6 rounded-t-xl border border-border/50">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <h3 className="font-medium text-lg">Marketing Qualified Leads</h3>
              {marketingLeadsHigher && <Crown className="h-5 w-5 text-yellow-500" />}
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {totalMarketingLeads.toLocaleString()}
            </p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-lg text-muted-foreground">
                Revenue: <span className="font-semibold">${totalMarketingRevenue.toLocaleString()}</span>
              </p>
              {marketingRevenueHigher && <Crown className="h-5 w-5 text-yellow-500" />}
            </div>
          </div>
        </div>
        
        {/* Conversion Arrow */}
        <div className="flex justify-center">
          <div className="text-center bg-gradient-to-br from-secondary/30 to-secondary/20 px-6 py-3 rounded-lg border border-border/50 shadow-lg">
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Lead Conversion Rate</p>
                <p className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                  {conversionRate}%
                </p>
              </div>
              <div className="pt-2 border-t border-border/50">
                <p className="text-sm text-muted-foreground">Revenue Conversion Rate</p>
                <p className="text-xl font-semibold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                  {revenueConversionRate}%
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sales Stage */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/20 p-6 rounded-b-xl border border-border/50">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <h3 className="font-medium text-lg">Sales Qualified Leads</h3>
              {!marketingLeadsHigher && <Crown className="h-5 w-5 text-yellow-500" />}
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {totalSalesLeads.toLocaleString()}
            </p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-lg text-muted-foreground">
                Revenue: <span className="font-semibold">${totalSalesRevenue.toLocaleString()}</span>
              </p>
              {!marketingRevenueHigher && <Crown className="h-5 w-5 text-yellow-500" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}