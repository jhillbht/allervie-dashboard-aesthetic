import React from 'react';
import { Card } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const randomInRange = (min: number, max: number, decimals: number = 0) => {
  const rand = Math.random() * (max - min) + min;
  const power = Math.pow(10, decimals);
  return Math.floor(rand * power) / power;
};

export const GA4EventsSection = () => {
  // Generate random changes for demonstration
  const patientChange = { value: randomInRange(1, 10, 1), type: Math.random() > 0.5 ? 'increase' as const : 'decrease' as const };
  const sponsorChange = { value: randomInRange(1, 10, 1), type: Math.random() > 0.5 ? 'increase' as const : 'decrease' as const };

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-4 bg-card/50 backdrop-blur-sm border border-border/50">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">Patient Contact Forms</h3>
          <span className={cn(
            "text-sm font-medium flex items-center gap-1",
            patientChange.type === "increase" ? "text-green-500" : "text-red-500"
          )}>
            {patientChange.type === "increase" ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
            {patientChange.value}%
          </span>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Submissions</span>
            <span className="text-2xl font-bold">247</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Completion Rate</span>
            <span className="text-2xl font-bold">68.5%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Avg. Time to Complete</span>
            <span className="text-2xl font-bold">2m 34s</span>
          </div>
        </div>
      </Card>
      
      <Card className="p-4 bg-card/50 backdrop-blur-sm border border-border/50">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">Sponsor Contact Forms</h3>
          <span className={cn(
            "text-sm font-medium flex items-center gap-1",
            sponsorChange.type === "increase" ? "text-green-500" : "text-red-500"
          )}>
            {sponsorChange.type === "increase" ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
            {sponsorChange.value}%
          </span>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Submissions</span>
            <span className="text-2xl font-bold">89</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Completion Rate</span>
            <span className="text-2xl font-bold">72.3%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Avg. Time to Complete</span>
            <span className="text-2xl font-bold">3m 12s</span>
          </div>
        </div>
      </Card>
    </div>
  );
};