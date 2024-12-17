import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Mail, Facebook } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [isLandscape, setIsLandscape] = React.useState(false);
  const isMobile = useIsMobile();

  React.useEffect(() => {
    const handleOrientationChange = () => {
      setIsLandscape(window.orientation === 90 || window.orientation === -90);
    };

    // Initial check
    handleOrientationChange();

    // Listen for orientation changes
    window.addEventListener('orientationchange', handleOrientationChange);
    return () => window.removeEventListener('orientationchange', handleOrientationChange);
  }, []);

  const renderCampaignLabels = () => {
    if (isMobile) {
      return data.map((entry) => 
        entry.campaign ? (
          <React.Fragment key={entry.campaign}>
            <ReferenceLine
              x={entry.name}
              stroke="#10B981"
              strokeDasharray="3 3"
              label={{
                position: 'insideBottom',
                value: entry.campaign,
                fill: '#10B981',
                fontSize: isLandscape ? 12 : 10,
                angle: 90,
                offset: 10
              }}
            />
          </React.Fragment>
        ) : null
      );
    }

    return null;
  };

  const renderDesktopLabels = () => {
    if (!isMobile) {
      return data.map((entry, index) => 
        entry.campaign ? (
          <text
            key={`label-${index}`}
            x={0}
            y={0}
            fill="#6B7280"
            textAnchor="middle"
            fontSize={12}
            transform={`translate(${index * 100}, 50)`}
          >
            {entry.campaign}
          </text>
        ) : null
      );
    }

    return null;
  };

  return (
    <div className={`bg-card/50 backdrop-blur-sm rounded-lg p-6 w-full ${isLandscape ? 'fixed inset-0 z-50' : ''}`}>
      <h2 className="text-lg font-medium mb-6">Performance Over Time</h2>
      <div className={`${isLandscape ? 'h-screen' : 'h-[400px]'} w-full`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ 
              top: 20, 
              right: isLandscape ? 50 : 40, 
              left: isLandscape ? 60 : 50, 
              bottom: isMobile ? 40 : 60 
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            {!isMobile && (
              <XAxis
                dataKey="name"
                stroke="#6B7280"
                axisLine={{ strokeWidth: 1 }}
                tick={{ 
                  dy: 20, 
                  fontSize: isLandscape ? 14 : 12,
                  fill: "#6B7280"
                }}
                interval={0}
                height={60}
                tickMargin={10}
              />
            )}
            {isMobile && (
              <XAxis
                dataKey="name"
                stroke="#6B7280"
                axisLine={{ strokeWidth: 1 }}
                tick={{ 
                  dy: 20, 
                  fontSize: isLandscape ? 14 : 12,
                  fill: "#6B7280"
                }}
                interval={0}
                height={40}
                tickMargin={10}
              />
            )}
            <YAxis 
              stroke="#6B7280"
              tick={{ 
                fontSize: isLandscape ? 14 : 12,
                fill: "#6B7280"
              }}
              width={isLandscape ? 60 : 50}
              tickMargin={8}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "none",
                borderRadius: "8px",
                fontSize: isLandscape ? "14px" : "12px",
                padding: "8px 12px"
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
            {renderCampaignLabels()}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {!isMobile && (
        <div className="flex justify-center mt-4">
          {renderDesktopLabels()}
        </div>
      )}
    </div>
  );
}