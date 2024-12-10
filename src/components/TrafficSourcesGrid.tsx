import React from 'react';
import { TrafficSourceCard } from "@/components/TrafficSourceCard";

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
  ];

  const maxRevenue = Math.max(...sources.map(source => source.revenue));

  return (
    <div>
      <h2 className="text-lg font-medium mb-6">Traffic Sources</h2>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {sources.map((source) => (
          <TrafficSourceCard
            key={source.title}
            {...source}
            isHighestRevenue={source.revenue === maxRevenue}
          />
        ))}
      </div>
    </div>
  );
}