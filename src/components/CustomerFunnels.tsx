import React from 'react';
import { Crown } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FunnelStep {
  name: string;
  value: number;
}

interface FunnelData {
  id: string;
  name: string;
  steps: FunnelStep[];
  conversionRate: number;
  revenue: number;
  trafficSource: string;
  isWinner?: boolean;
}

const funnelData: FunnelData[] = [
  {
    id: "a",
    name: "Funnel A",
    steps: [
      { name: "Homepage", value: 1000 },
      { name: "Product Page", value: 750 },
      { name: "Cart", value: 500 },
      { name: "Checkout", value: 250 },
    ],
    conversionRate: 25,
    revenue: 75000,
    trafficSource: "Organic Search",
    isWinner: true,
  },
  {
    id: "b",
    name: "Funnel B",
    steps: [
      { name: "Search", value: 800 },
      { name: "Product Page", value: 500 },
      { name: "Cart", value: 300 },
      { name: "Checkout", value: 150 },
    ],
    conversionRate: 18.75,
    revenue: 45000,
    trafficSource: "Paid Search",
  },
  {
    id: "c",
    name: "Funnel C",
    steps: [
      { name: "Category Page", value: 1200 },
      { name: "Product Page", value: 600 },
      { name: "Cart", value: 300 },
      { name: "Checkout", value: 180 },
    ],
    conversionRate: 15,
    revenue: 54000,
    trafficSource: "Email",
  },
];

export function CustomerFunnels() {
  const maxRevenue = Math.max(...funnelData.map(funnel => funnel.revenue));

  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 w-full">
      <h2 className="text-lg font-medium mb-6">Customer Journey Funnels</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {funnelData.map((funnel) => (
          <Card key={funnel.id} className="p-4 relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium">{funnel.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  via {funnel.trafficSource}
                </p>
              </div>
              {funnel.isWinner && (
                <Crown className="h-6 w-6 text-yellow-500" />
              )}
            </div>
            <div className="space-y-3">
              {funnel.steps.map((step, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{step.name}</span>
                    <span>{step.value.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{
                        width: `${(step.value / funnel.steps[0].value) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Conversion Rate
                </span>
                <span className="font-medium">
                  {funnel.conversionRate.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Revenue
                </span>
                <span className={`font-medium ${funnel.revenue === maxRevenue ? 'text-lime-500' : ''}`}>
                  ${funnel.revenue.toLocaleString()}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}