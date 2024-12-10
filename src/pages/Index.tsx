import React, { useState, useCallback } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/StatsCard";
import { RefreshCw } from "lucide-react";
import { PerformanceChart } from "@/components/PerformanceChart";
import { CustomerFunnels } from "@/components/CustomerFunnels";
import { TrafficSourcesGrid } from "@/components/TrafficSourcesGrid";
import { LandingPagesTable } from "@/components/LandingPagesTable";

// Function to generate random number within a range
const randomInRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Function to generate fresh demo data
const generateDemoData = () => [
  { name: '11 AM', current: randomInRange(500, 1000), previous: randomInRange(400, 900) },
  { name: '1 PM', current: randomInRange(500, 1000), previous: randomInRange(400, 900) },
  { name: '3 PM', current: randomInRange(1000, 1500), previous: randomInRange(800, 1200), campaign: 'Email Campaign 1' },
  { name: '5 PM', current: randomInRange(600, 1000), previous: randomInRange(500, 900) },
  { name: '7 PM', current: randomInRange(800, 1200), previous: randomInRange(700, 1100), campaign: 'Ad Campaign 4' },
  { name: '9 PM', current: randomInRange(400, 800), previous: randomInRange(300, 700) },
];

export default function Index() {
  const [timePeriod, setTimePeriod] = useState('today');
  const [data, setData] = useState(generateDemoData());

  const refreshData = useCallback(() => {
    setData(generateDemoData());
  }, []);

  const handlePeriodChange = (value: string) => {
    setTimePeriod(value);
    refreshData();
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-full mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/68a322a1-90ab-42ca-845d-5b3c286726ce.png" 
              alt="Launch Analytics" 
              className="h-8"
            />
          </div>
          <div className="flex items-center gap-4">
            <Select value={timePeriod} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="week">Last 7 days</SelectItem>
                <SelectItem value="month">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={refreshData}
              className="h-10 w-10"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          <StatsCard
            title="Conversion Rate"
            value="1.3%"
            change={{ value: 8.1, type: "increase" }}
            subtitle="vs Yesterday"
          />
          <StatsCard
            title="Revenue"
            value="$39,827"
            change={{ value: 12.6, type: "decrease" }}
            subtitle="vs Yesterday"
          />
          <StatsCard
            title="Sessions"
            value="49,062"
            change={{ value: 8.2, type: "increase" }}
            subtitle="vs Yesterday"
          />
          <StatsCard
            title="Engagement"
            value="37.5%"
            change={{ value: 3.1, type: "increase" }}
            subtitle="vs Yesterday"
          />
          <StatsCard
            title="Bounce Rate"
            value="33.2%"
            change={{ value: 1.9, type: "increase" }}
            subtitle="vs Yesterday"
          />
          <StatsCard
            title="Avg Order"
            value="$89"
            change={{ value: 3.8, type: "decrease" }}
            subtitle="vs Yesterday"
          />
        </div>

        {/* Performance Chart */}
        <PerformanceChart data={data} />

        {/* Customer Funnels */}
        <CustomerFunnels />

        {/* Traffic Sources */}
        <TrafficSourcesGrid />

        {/* Landing Pages Table */}
        <LandingPagesTable />
      </div>
    </div>
  );
}