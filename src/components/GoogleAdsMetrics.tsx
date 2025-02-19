import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MetricCard } from './metrics/MetricCard';
import { GoogleAdsFunnel } from './metrics/GoogleAdsFunnel';
import { GA4EventsSection } from './metrics/GA4EventsSection';
import { campaignsByRegion } from './chart/data-generation';

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

  const timeMultipliers = {
    today: 1/30,
    yesterday: 0.95/30,
    'last-week': 7/30,
    'last-month': 1,
    'last-quarter': 3
  };

  const regionMult = regionMultipliers[region as keyof typeof regionMultipliers] || 1;
  const campaignMult = campaignMultipliers[campaignType as keyof typeof campaignMultipliers] || 1;
  const timeMult = timeMultipliers[timePeriod as keyof typeof timeMultipliers] || 1;
  const totalMult = regionMult * campaignMult * timeMult;

  const baseImpressions = randomInRange(1200000, 1300000, 0);
  const baseCtr = randomInRange(1.8, 1.95, 2);
  const baseClicks = Math.floor((baseImpressions * baseCtr) / 100);
  const baseCostPerConversion = randomInRange(33, 36, 2);
  const baseConversionRate = randomInRange(1.7, 2.0, 2);
  
  const impressions = Math.floor(baseImpressions * totalMult);
  const clickThruRate = Number((baseCtr * (1 + (regionMult * 0.1))).toFixed(2));
  const clicks = Math.floor((impressions * clickThruRate) / 100);
  const conversionRate = Number((baseConversionRate * (1 + (campaignMult * 0.1))).toFixed(2));
  const conversions = Math.floor((clicks * conversionRate) / 100);
  const costPerConversion = Number((baseCostPerConversion * (1 + (regionMult * 0.1))).toFixed(2));
  const cost = Math.floor(conversions * costPerConversion);

  return {
    cost: Math.max(0, cost),
    conversions: Math.max(0, conversions),
    clicks: Math.max(0, clicks),
    conversionRate: Math.max(0, conversionRate),
    clickThruRate: Math.max(0, clickThruRate),
    costPerConversion: Math.max(0, costPerConversion),
    impressions: Math.max(0, impressions)
  };
};

interface GoogleAdsMetricsProps {
  timePeriod?: string;
}

export function GoogleAdsMetrics({ timePeriod = 'today' }: GoogleAdsMetricsProps) {
  const [region, setRegion] = useState<string>("all");
  const [campaignType, setCampaignType] = useState<string>("all");
  const [metrics, setMetrics] = useState(generateMetrics("all", "all", timePeriod));

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
            value={metrics.conversionRate.toFixed(2)}
            change={{ value: randomInRange(10, 60, 1), type: Math.random() > 0.5 ? 'increase' : 'decrease' }}
            suffix="%"
          />
          <MetricCard
            label="Click-Thru Rate"
            value={metrics.clickThruRate.toFixed(2)}
            change={{ value: randomInRange(10, 60, 1), type: Math.random() > 0.5 ? 'increase' : 'decrease' }}
            suffix="%"
          />
          <MetricCard
            label="Cost / Conversion"
            value={metrics.costPerConversion.toFixed(2)}
            change={{ value: randomInRange(10, 60, 1), type: Math.random() > 0.5 ? 'increase' : 'decrease' }}
            prefix="$"
          />
        </div>
      </div>

      <GA4EventsSection region={region} campaignType={campaignType} />
    </div>
  );
}
