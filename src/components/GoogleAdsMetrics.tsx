import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MetricCard } from './metrics/MetricCard';
import { GoogleAdsFunnel } from './metrics/GoogleAdsFunnel';
import { GA4EventsSection } from './metrics/GA4EventsSection';

const randomInRange = (min: number, max: number, decimals: number = 0) => {
  const rand = Math.random() * (max - min) + min;
  const power = Math.pow(10, decimals);
  return Math.floor(rand * power) / power;
};

const generateMetrics = (region: string, campaignType: string, timePeriod: string = 'today') => {
  const regionMultipliers = {
    all: 2.5,
    northeast: 0.8,
    midwest: 0.6,
    south: 0.7,
    west: 0.9
  };

  const campaignMultipliers = {
    all: 2.0,
    search: 0.8,
    performance: 0.7,
    display: 0.5
  };

  // Updated time period multipliers to reflect 30-day scale
  const timeMultipliers = {
    today: 1/30, // One day's worth of the monthly total
    yesterday: 0.95/30, // Slightly less than today
    week: 7/30, // One week's worth of the monthly total
    month: 1 // Full monthly data (baseline)
  };

  const regionMult = regionMultipliers[region as keyof typeof regionMultipliers];
  const campaignMult = campaignMultipliers[campaignType as keyof typeof campaignMultipliers];
  const timeMult = timeMultipliers[timePeriod as keyof typeof timeMultipliers];
  const totalMult = regionMult * campaignMult * timeMult;

  // Updated base metrics to match the 30-day screenshot scale
  const baseClicks = randomInRange(22000, 24000, 0); // Around 23.3K for the month
  const baseConversions = randomInRange(2400, 2600, 0); // Around 2.53K for the month
  const baseCostPerConversion = randomInRange(33, 36, 2); // Around $34.43
  
  // Calculate metrics with time period adjustment
  const clicks = Math.floor(baseClicks * totalMult);
  const conversions = Math.floor(baseConversions * totalMult);
  const costPerConversion = baseCostPerConversion * (1 + (regionMult * 0.2));
  const cost = conversions * costPerConversion;
  
  // Calculate derived metrics
  const impressions = Math.floor(clicks * randomInRange(15, 20, 0)); // Realistic CTR
  const clickThruRate = (clicks / impressions) * 100;
  const conversionRate = (conversions / clicks) * 100;

  return {
    cost,
    conversions,
    clicks,
    conversionRate,
    clickThruRate,
    costPerConversion,
    impressions
  };
};

interface GoogleAdsMetricsProps {
  timePeriod?: string;
}

export function GoogleAdsMetrics({ timePeriod = 'today' }: GoogleAdsMetricsProps) {
  const [region, setRegion] = useState<string>("all");
  const [campaignType, setCampaignType] = useState<string>("all");
  const [metrics, setMetrics] = useState(generateMetrics("all", "all", timePeriod));

  // Update metrics when filters change
  useEffect(() => {
    setMetrics(generateMetrics(region, campaignType, timePeriod));
  }, [region, campaignType, timePeriod]);

  return (
    <div className="bg-gradient-to-br from-card/50 to-secondary/20 backdrop-blur-sm rounded-xl p-6 w-full border border-border/50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-lg font-medium">Google Ads Performance</h2>
        <div className="flex flex-wrap gap-4">
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="northeast">Northeast</SelectItem>
              <SelectItem value="midwest">Midwest</SelectItem>
              <SelectItem value="south">South</SelectItem>
              <SelectItem value="west">West</SelectItem>
            </SelectContent>
          </Select>
          <Select value={campaignType} onValueChange={setCampaignType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Campaign type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campaigns</SelectItem>
              <SelectItem value="search">Search</SelectItem>
              <SelectItem value="performance">Performance Max</SelectItem>
              <SelectItem value="display">Display</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <GoogleAdsFunnel 
            impressions={metrics.impressions}
            clicks={metrics.clicks}
            conversions={Math.floor(metrics.conversions)}
          />
        </div>
        <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <MetricCard
            label="Cost"
            value={metrics.cost}
            change={{ value: randomInRange(10, 60, 1), type: Math.random() > 0.5 ? 'increase' : 'decrease' }}
            prefix="$"
          />
          <MetricCard
            label="Conversions"
            value={metrics.conversions}
            change={{ value: randomInRange(10, 60, 1), type: Math.random() > 0.5 ? 'increase' : 'decrease' }}
          />
          <MetricCard
            label="Clicks"
            value={metrics.clicks}
            change={{ value: randomInRange(10, 60, 1), type: Math.random() > 0.5 ? 'increase' : 'decrease' }}
          />
          <MetricCard
            label="Conversion Rate"
            value={metrics.conversionRate}
            change={{ value: randomInRange(10, 60, 1), type: Math.random() > 0.5 ? 'increase' : 'decrease' }}
            suffix="%"
          />
          <MetricCard
            label="Click-Thru Rate"
            value={metrics.clickThruRate}
            change={{ value: randomInRange(10, 60, 1), type: Math.random() > 0.5 ? 'increase' : 'decrease' }}
            suffix="%"
          />
          <MetricCard
            label="Cost / Conversion"
            value={metrics.costPerConversion}
            change={{ value: randomInRange(10, 60, 1), type: Math.random() > 0.5 ? 'increase' : 'decrease' }}
            prefix="$"
          />
        </div>
      </div>

      <GA4EventsSection region={region} campaignType={campaignType} />
    </div>
  );
}
