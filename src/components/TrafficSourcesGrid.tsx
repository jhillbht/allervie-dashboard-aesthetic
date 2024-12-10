import React from 'react';
import { TrafficSourceCard } from "@/components/TrafficSourceCard";
import { Crown } from "lucide-react";

export function TrafficSourcesGrid() {
  const sources = [
    {
      title: "Retargeting",
      cvr: 2.9,
      revenue: 55473,
      sessions: 20307,
      change: { value: 2.4, type: "increase" as const },
    },
    {
      title: "Email",
      cvr: 2.8,
      revenue: 58573,
      sessions: 3494,
      change: { value: 4.1, type: "decrease" as const },
    },
    {
      title: "Organic Search",
      cvr: 1.4,
      revenue: 22560,
      sessions: 4562,
      change: { value: 1.6, type: "increase" as const },
    },
    {
      title: "Organic Social",
      cvr: 1.8,
      revenue: 34250,
      sessions: 15678,
      change: { value: 3.2, type: "increase" as const },
    },
    {
      title: "Paid Social",
      cvr: 2.2,
      revenue: 48920,
      sessions: 18456,
      change: { value: 2.8, type: "increase" as const },
    },
    {
      title: "SMS",
      cvr: 3.1,
      revenue: 42680,
      sessions: 8934,
      change: { value: 5.2, type: "increase" as const },
    },
  ];

  const maxRevenue = Math.max(...sources.map(source => source.revenue));
  const maxCvr = Math.max(...sources.map(source => source.cvr));

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-lg font-medium">Traffic Sources</h2>
        <Crown className="h-5 w-5 text-yellow-500" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {sources.map((source) => (
          <TrafficSourceCard
            key={source.title}
            {...source}
            isHighestRevenue={source.revenue === maxRevenue}
            isHighestCvr={source.cvr === maxCvr}
          />
        ))}
      </div>
    </div>
  );
}