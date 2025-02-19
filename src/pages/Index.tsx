import React, { useState, useCallback } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/StatsCard";
import { RefreshCw } from "lucide-react";
import { PerformanceChart } from "@/components/PerformanceChart";
import { FloatingChatButton } from "@/components/FloatingChatButton";
import { GoogleAdsMetrics } from "@/components/GoogleAdsMetrics";

const randomInRange = (min: number, max: number, decimals: number = 0) => {
  const rand = Math.random() * (max - min) + min;
  const power = Math.pow(10, decimals);
  return Math.floor(rand * power) / power;
};

// Function to generate time labels based on period
const getTimeLabels = (period: string) => {
  switch (period) {
    case 'today':
      return ['11 AM', '1 PM', '3 PM', '5 PM', '7 PM', '9 PM'];
    case 'yesterday':
      return ['10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM'];
    case 'last-week':
      return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    case 'last-month':
      return ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    case 'last-quarter':
      return ['Q1', 'Q2', 'Q3', 'Q4'];
    default:
      return ['11 AM', '1 PM', '3 PM', '5 PM', '7 PM', '9 PM'];
  }
};

// Function to generate fresh demo data based on period
const generateDemoData = (period: string) => {
  const timeLabels = getTimeLabels(period);
  const baseMultiplier = period === 'month' ? 4 : period === 'week' ? 1.5 : 1;
  
  return timeLabels.map(name => {
    // Generate more realistic ranges based on time period
    const currentBase = randomInRange(500 * baseMultiplier, 1500 * baseMultiplier, 0);
    const previousBase = currentBase * randomInRange(0.8, 1.2, 2);
    
    // Add campaign names for specific points
    const campaigns = [
      'Email Campaign 3',
      'TikTok Video 83',
      'YouTube Video 7',
      'Instagram Story 12',
      'Facebook Ad 45'
    ];
    
    const shouldHaveCampaign = Math.random() > 0.6;
    return {
      name,
      current: currentBase,
      previous: previousBase,
      ...(shouldHaveCampaign && { campaign: campaigns[Math.floor(Math.random() * campaigns.length)] })
    };
  });
};

export default function Index() {
  const [timePeriod, setTimePeriod] = useState('today');
  const [region, setRegion] = useState('all');
  const [campaignType, setCampaignType] = useState('all');
  const [data, setData] = useState(() => generateDemoData('today'));

  const refreshData = useCallback(() => {
    setData(generateDemoData(timePeriod));
  }, [timePeriod]);

  const handlePeriodChange = (value: string) => {
    setTimePeriod(value);
    setData(generateDemoData(value));
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
                <SelectItem value="last-week">Last Week</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="last-quarter">Last Quarter</SelectItem>
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

        {/* Google Ads Metrics */}
        <GoogleAdsMetrics timePeriod={timePeriod} />

        {/* Site Metrics Title */}
        <h2 className="text-2xl font-semibold text-left">Site Metrics</h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          <StatsCard
            title="Conversion Rate"
            value={`${randomInRange(1, 10, 2)}%`}
            change={{ value: randomInRange(1, 60, 1), type: Math.random() > 0.5 ? "increase" : "decrease" }}
            subtitle="vs Yesterday"
          />
          <StatsCard
            title="Revenue"
            value={`$${randomInRange(10000, 50000, 0).toLocaleString()}`}
            change={{ value: randomInRange(1, 60, 1), type: Math.random() > 0.5 ? "increase" : "decrease" }}
            subtitle="vs Yesterday"
          />
          <StatsCard
            title="Sessions"
            value={randomInRange(40000, 60000, 0).toLocaleString()}
            change={{ value: randomInRange(1, 60, 1), type: Math.random() > 0.5 ? "increase" : "decrease" }}
            subtitle="vs Yesterday"
          />
          <StatsCard
            title="Engagement"
            value={`${randomInRange(20, 60, 1)}%`}
            change={{ value: randomInRange(1, 60, 1), type: Math.random() > 0.5 ? "increase" : "decrease" }}
            subtitle="vs Yesterday"
          />
          <StatsCard
            title="Bounce Rate"
            value={`${randomInRange(20, 45, 1)}%`}
            change={{ value: randomInRange(1, 60, 1), type: Math.random() > 0.5 ? "increase" : "decrease" }}
            subtitle="vs Yesterday"
          />
          <StatsCard
            title="Avg Order"
            value={`$${randomInRange(50, 150, 0)}`}
            change={{ value: randomInRange(1, 60, 1), type: Math.random() > 0.5 ? "increase" : "decrease" }}
            subtitle="vs Yesterday"
          />
        </div>

        {/* Performance Chart */}
        <PerformanceChart region={region} campaignType={campaignType} timePeriod={timePeriod} />
      </div>
      <FloatingChatButton />
    </div>
  );
}
