import React from 'react';
import { Card } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  prefix?: string;
  suffix?: string;
}

const MetricCard = ({ label, value, change, prefix = '', suffix = '' }: MetricCardProps) => (
  <Card className="p-4 bg-card/50 backdrop-blur-sm border border-border/50">
    <div className="flex items-center gap-2 mb-2">
      <p className="text-sm text-muted-foreground">{label}</p>
      {change && (
        <div className={`flex items-center text-xs ${change.type === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
          {change.type === 'increase' ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
          {change.value}%
        </div>
      )}
    </div>
    <p className="text-2xl font-bold">
      {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
    </p>
  </Card>
);

const GoogleAdsFunnel = () => (
  <div className="relative w-full h-64 bg-gradient-to-b from-[#F2FCE2] via-[#FEF7CD] to-[#D3E4FD] rounded-lg overflow-hidden">
    <div className="absolute inset-0 flex flex-col justify-between p-4">
      <div className="w-full text-center p-2 bg-black/10 rounded">
        <p className="text-sm font-medium">Impressions</p>
        <p className="text-lg font-bold">154K</p>
      </div>
      <div className="w-3/4 mx-auto text-center p-2 bg-black/10 rounded">
        <p className="text-sm font-medium">Clicks</p>
        <p className="text-lg font-bold">1,845</p>
      </div>
      <div className="w-1/2 mx-auto text-center p-2 bg-black/10 rounded">
        <p className="text-sm font-medium">Conversions</p>
        <p className="text-lg font-bold">155.99</p>
      </div>
    </div>
  </div>
);

export function GoogleAdsMetrics() {
  return (
    <div className="bg-gradient-to-br from-card/50 to-secondary/20 backdrop-blur-sm rounded-xl p-6 w-full border border-border/50">
      <h2 className="text-lg font-medium mb-6">Google Ads Performance</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <GoogleAdsFunnel />
        </div>
        <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <MetricCard
            label="Cost"
            value={7020.48}
            change={{ value: 40, type: 'increase' }}
            prefix="$"
          />
          <MetricCard
            label="Conversions"
            value={155.99}
            change={{ value: 15, type: 'increase' }}
          />
          <MetricCard
            label="Clicks"
            value={1845}
            change={{ value: 27, type: 'increase' }}
          />
          <MetricCard
            label="Conversion Rate"
            value={8.39}
            change={{ value: 55, type: 'increase' }}
            suffix="%"
          />
          <MetricCard
            label="Click-Thru Rate"
            value={1.20}
            change={{ value: 42, type: 'increase' }}
            suffix="%"
          />
          <MetricCard
            label="Cost / Conversion"
            value={45.00}
            change={{ value: 24, type: 'increase' }}
            prefix="$"
          />
        </div>
      </div>
    </div>
  );
}