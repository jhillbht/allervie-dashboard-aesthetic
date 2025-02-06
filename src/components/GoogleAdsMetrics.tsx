import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MetricCard } from './metrics/MetricCard';
import { GoogleAdsFunnel } from './metrics/GoogleAdsFunnel';
import { GA4EventsSection } from './metrics/GA4EventsSection';

// Helper function to generate random number within a range
const randomInRange = (min: number, max: number, decimals: number = 0) => {
  const rand = Math.random() * (max - min) + min;
  const power = Math.pow(10, decimals);
  return Math.floor(rand * power) / power;
};

// Function to generate metrics based on filters
const generateMetrics = (region: string, campaignType: string) => {
  // Base multipliers for different regions and campaign types
  const regionMultipliers = {
    all: 1,
    northeast: 1.2,
    midwest: 0.9,
    south: 1.1,
    west: 1.3
  };

  const campaignMultipliers = {
    all: 1,
    search: 1.15,
    performance: 1.25,
    display: 0.85
  };

  // Get multipliers based on selected filters
  const regionMult = regionMultipliers[region as keyof typeof regionMultipliers];
  const campaignMult = campaignMultipliers[campaignType as keyof typeof campaignMultipliers];
  const totalMult = regionMult * campaignMult;

  return {
    cost: randomInRange(5000 * totalMult, 9000 * totalMult, 2),
    conversions: randomInRange(120 * totalMult, 190 * totalMult, 2),
    clicks: Math.floor(randomInRange(1500 * totalMult, 2200 * totalMult, 0)),
    conversionRate: randomInRange(6 * totalMult, 10 * totalMult, 2),
    clickThruRate: randomInRange(0.8 * totalMult, 1.6 * totalMult, 2),
    costPerConversion: randomInRange(35 * totalMult, 55 * totalMult, 2)
  };
};

export function GoogleAdsMetrics() {
  const [region, setRegion] = useState<string>("all");
  const [campaignType, setCampaignType] = useState<string>("all");
  const [metrics, setMetrics] = useState(generateMetrics("all", "all"));

  // Update metrics when filters change
  useEffect(() => {
    setMetrics(generateMetrics(region, campaignType));
  }, [region, campaignType]);

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
          <GoogleAdsFunnel />
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

      <GA4EventsSection />
    </div>
  );
}