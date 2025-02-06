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

export const MetricCard = ({ label, value, change, prefix = '', suffix = '' }: MetricCardProps) => (
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