import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MetricCard } from './metrics/MetricCard';
import { GoogleAdsFunnel } from './metrics/GoogleAdsFunnel';
import { GA4EventsSection } from './metrics/GA4EventsSection';

export function GoogleAdsMetrics() {
  const [region, setRegion] = useState<string>("all");
  const [campaignType, setCampaignType] = useState<string>("all");

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

      <GA4EventsSection />
    </div>
  );
}