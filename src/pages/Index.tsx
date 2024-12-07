import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatsCard } from "@/components/StatsCard";
import { TrafficSourceCard } from "@/components/TrafficSourceCard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Mail, Facebook } from "lucide-react";

const data = [
  { name: '11 AM', current: 800, previous: 700 },
  { name: '1 PM', current: 600, previous: 500 },
  { name: '3 PM', current: 1200, previous: 1000, campaign: 'Email Campaign 1', icon: Mail },
  { name: '5 PM', current: 800, previous: 700 },
  { name: '7 PM', current: 1000, previous: 900, campaign: 'Ad Campaign 4', icon: Facebook },
  { name: '9 PM', current: 500, previous: 400 },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <div className="flex items-center gap-4">
            <Select defaultValue="today">
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
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </div>

        {/* Chart */}
        <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-lg font-medium mb-6">Performance Over Time</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "8px",
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
                {data.map((entry, index) => 
                  entry.campaign ? (
                    <ReferenceLine
                      key={entry.campaign}
                      x={entry.name}
                      stroke="#10B981"
                      strokeDasharray="3 3"
                      label={{
                        value: (
                          <g transform="translate(-10, -20)">
                            {entry.icon && React.createElement(entry.icon, {
                              size: 16,
                              color: '#10B981',
                              className: "mb-1"
                            })}
                            <text x="0" y="20" fill="#10B981" fontSize="12">
                              {entry.campaign}
                            </text>
                          </g>
                        ) as unknown as string,
                        position: 'top',
                      }}
                    />
                  ) : null
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Sources */}
        <div>
          <h2 className="text-lg font-medium mb-6">Traffic Sources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
};

export default Index;
