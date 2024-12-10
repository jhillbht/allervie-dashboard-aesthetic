import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Mail, Facebook } from "lucide-react";

interface ChartDataPoint {
  name: string;
  current: number;
  previous: number;
  campaign?: string;
  icon?: typeof Mail | typeof Facebook;
}

interface PerformanceChartProps {
  data: ChartDataPoint[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 w-full">
      <h2 className="text-lg font-medium mb-6">Performance Over Time</h2>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="name"
              stroke="#6B7280"
              axisLine={{ strokeWidth: 1 }}
              tick={{ dy: 10, fontSize: 9 }}
            />
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
  );
}