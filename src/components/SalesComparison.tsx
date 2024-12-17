import React from 'react';
import { SalesComparisonCard } from "./SalesComparisonCard";

const salesData = [
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

export function SalesComparison() {
  // Determine winner based on revenue
  const maxRevenue = Math.max(...salesData.map(data => data.revenue));

  return (
    <div>
      <h2 className="text-lg font-medium mb-6">Inbound vs Outbound Sales</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {salesData.map((data) => (
          <SalesComparisonCard
            key={data.title}
            {...data}
            isWinner={data.revenue === maxRevenue}
          />
        ))}
      </div>
    </div>
  );
}