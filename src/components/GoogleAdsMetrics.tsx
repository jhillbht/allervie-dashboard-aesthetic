import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { addDays } from "date-fns";
import { DateRange as DayPickerDateRange } from 'react-day-picker';

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

interface DateRange extends Required<DayPickerDateRange> {}

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

const GA4EventsSection = () => (
  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
    <Card className="p-4 bg-card/50 backdrop-blur-sm border border-border/50">
      <h3 className="text-sm font-medium mb-4">Patient Contact Forms</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Total Submissions</span>
          <span className="font-bold">247</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Completion Rate</span>
          <span className="font-bold">68.5%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Avg. Time to Complete</span>
          <span className="font-bold">2m 34s</span>
        </div>
      </div>
    </Card>
    
    <Card className="p-4 bg-card/50 backdrop-blur-sm border border-border/50">
      <h3 className="text-sm font-medium mb-4">Sponsor Contact Forms</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Total Submissions</span>
          <span className="font-bold">89</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Completion Rate</span>
          <span className="font-bold">72.3%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Avg. Time to Complete</span>
          <span className="font-bold">3m 12s</span>
        </div>
      </div>
    </Card>
  </div>
);

export function GoogleAdsMetrics() {
  const [region, setRegion] = useState<string>("all");
  const [campaignType, setCampaignType] = useState<string>("all");
  const [date, setDate] = useState<DateRange>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [compareDate, setCompareDate] = useState<DateRange>({
    from: addDays(new Date(), -60),
    to: addDays(new Date(), -31),
  });

  const handleDateChange = (newDate: DayPickerDateRange | undefined) => {
    if (newDate?.from && newDate?.to) {
      setDate({ from: newDate.from, to: newDate.to });
    }
  };

  const handleCompareDateChange = (newDate: DayPickerDateRange | undefined) => {
    if (newDate?.from && newDate?.to) {
      setCompareDate({ from: newDate.from, to: newDate.to });
    }
  };

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
          <div className="flex gap-2">
            <DatePickerWithRange date={date} setDate={handleDateChange} />
            <DatePickerWithRange date={compareDate} setDate={handleCompareDateChange} />
          </div>
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