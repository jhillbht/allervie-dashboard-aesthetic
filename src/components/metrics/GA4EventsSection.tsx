import React from 'react';
import { Card } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const randomInRange = (min: number, max: number, decimals: number = 0) => {
  const rand = Math.random() * (max - min) + min;
  const power = Math.pow(10, decimals);
  return Math.floor(rand * power) / power;
};

interface GA4EventsSectionProps {
  region?: string;
  campaignType?: string;
}

export const GA4EventsSection: React.FC<GA4EventsSectionProps> = ({ region = 'all', campaignType = 'all' }) => {
  // Base multipliers for different regions and campaign types
  const regionMultipliers: { [key: string]: number } = {
    all: 1,
    northeast: 1.2,
    midwest: 0.9,
    south: 1.1,
    west: 1.3
  };

  const campaignMultipliers: { [key: string]: number } = {
    all: 1,
    search: 1.15,
    performance: 1.25,
    display: 0.85
  };

  // Get multipliers based on selected filters
  const regionMult = regionMultipliers[region] || 1;
  const campaignMult = campaignMultipliers[campaignType] || 1;
  const totalMult = regionMult * campaignMult;

  // Generate metrics based on multipliers
  const patientMetrics = {
    submissions: Math.floor(247 * totalMult),
    completionRate: (68.5 * totalMult).toFixed(1),
    timeToComplete: `${Math.floor(2 * totalMult)}m ${Math.floor(34 * totalMult)}s`,
    change: { value: randomInRange(1, 10, 1), type: Math.random() > 0.5 ? 'increase' as const : 'decrease' as const }
  };

  const sponsorMetrics = {
    submissions: Math.floor(89 * totalMult),
    completionRate: (72.3 * totalMult).toFixed(1),
    timeToComplete: `${Math.floor(3 * totalMult)}m ${Math.floor(12 * totalMult)}s`,
    change: { value: randomInRange(1, 10, 1), type: Math.random() > 0.5 ? 'increase' as const : 'decrease' as const }
  };

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-4 bg-card/50 backdrop-blur-sm border border-border/50">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">Patient Contact Forms</h3>
          <span className={cn(
            "text-sm font-medium flex items-center gap-1",
            patientMetrics.change.type === "increase" ? "text-green-500" : "text-red-500"
          )}>
            {patientMetrics.change.type === "increase" ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
            {patientMetrics.change.value}%
          </span>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Submissions</span>
            <span className="text-2xl font-bold">{patientMetrics.submissions}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Completion Rate</span>
            <span className="text-2xl font-bold">{patientMetrics.completionRate}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Avg. Time to Complete</span>
            <span className="text-2xl font-bold">{patientMetrics.timeToComplete}</span>
          </div>
        </div>
      </Card>
      
      <Card className="p-4 bg-card/50 backdrop-blur-sm border border-border/50">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">Sponsor Contact Forms</h3>
          <span className={cn(
            "text-sm font-medium flex items-center gap-1",
            sponsorMetrics.change.type === "increase" ? "text-green-500" : "text-red-500"
          )}>
            {sponsorMetrics.change.type === "increase" ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
            {sponsorMetrics.change.value}%
          </span>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Submissions</span>
            <span className="text-2xl font-bold">{sponsorMetrics.submissions}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Completion Rate</span>
            <span className="text-2xl font-bold">{sponsorMetrics.completionRate}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Avg. Time to Complete</span>
            <span className="text-2xl font-bold">{sponsorMetrics.timeToComplete}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};