import React, { useState, useCallback } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/StatsCard";
import { TrafficSourceCard } from "@/components/TrafficSourceCard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Mail, Facebook, RefreshCw } from "lucide-react";

// Function to generate random number within a range
const randomInRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Function to generate fresh demo data
const generateDemoData = () => [
  { name: '11 AM', current: randomInRange(500, 1000), previous: randomInRange(400, 900) },
  { name: '1 PM', current: randomInRange(500, 1000), previous: randomInRange(400, 900) },
  { name: '3 PM', current: randomInRange(1000, 1500), previous: randomInRange(800, 1200), campaign: 'Email Campaign 1', icon: Mail },
  { name: '5 PM', current: randomInRange(600, 1000), previous: randomInRange(500, 900) },
  { name: '7 PM', current: randomInRange(800, 1200), previous: randomInRange(700, 1100), campaign: 'Ad Campaign 4', icon: Facebook },
  { name: '9 PM', current: randomInRange(400, 800), previous: randomInRange(300, 700) },
];

function Index() {
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
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
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

        {/* Stats Grid - Updated to show 2 columns on mobile */}
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

        {/* Chart - Updated with full width and smaller font */}
        <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 w-full">
          <h2 className="text-lg font-medium mb-6">Performance Over Time</h2>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                {/* XAxis with reduced font size (25% smaller) */}
                <XAxis
                  dataKey="name"
                  stroke="#6B7280"
                  axisLine={{ strokeWidth: 1 }}
                  tick={{ dy: 10, fontSize: 9 }}
                />
                {/* YAxis with reduced font size (25% smaller) */}
                <YAxis 
                  stroke="#6B7280"
                  tick={{ fontSize: 9 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "9px"
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="current"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="previous"
                  stroke="#6B7280"
                  strokeWidth={2}
                  dot={false}
                />
                {data.map((entry) => 
                  entry.campaign ? (
                    <React.Fragment key={entry.campaign}>
                      <ReferenceLine
                        x={entry.name}
                        stroke="#10B981"
                        strokeDasharray="3 3"
                        label={{
                          position: 'bottom',
                          value: entry.campaign,
                          fill: '#10B981',
                          fontSize: 9,
                          dy: 40
                        }}
                      />
                    </React.Fragment>
                  ) : null
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Sources - Updated to show 2 columns on mobile */}
        <div>
          <h2 className="text-lg font-medium mb-6">Traffic Sources</h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <TrafficSourceCard
              title="Retargeting"
              cvr={2.9}
              revenue={55473}
              sessions={20307}
              change={{ value: 2.4, type: "increase" }}
            />
            <TrafficSourceCard
              title="Email"
              cvr={2.8}
              revenue={58573}
              sessions={3494}
              change={{ value: 4.1, type: "decrease" }}
            />
            <TrafficSourceCard
              title="Organic Search"
              cvr={1.4}
              revenue={22560}
              sessions={4562}
              change={{ value: 1.6, type: "increase" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;