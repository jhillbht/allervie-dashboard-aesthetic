
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useIsMobile } from "@/hooks/use-mobile";
import { CampaignLabels } from './chart/CampaignLabels';
import { ChartHeader } from './chart/ChartHeader';
import { ChartDataPoint, CHART_COLORS, getChartMargins } from './chart/chart-utils';
import { generateChartData } from './chart/data-generation';

interface PerformanceChartProps {
  region?: string;
  campaignType?: string;
  timePeriod?: string;
}

export function PerformanceChart({ 
  region = 'all', 
  campaignType = 'all', 
  timePeriod = 'today' 
}: PerformanceChartProps) {
  const [isLandscape, setIsLandscape] = React.useState(false);
  const isMobile = useIsMobile();
  const chartRef = React.useRef<HTMLDivElement>(null);
  const [chartData, setChartData] = React.useState(() => 
    generateChartData(region, campaignType, timePeriod)
  );

  React.useEffect(() => {
    setChartData(generateChartData(region, campaignType, timePeriod));
  }, [region, campaignType, timePeriod]);

  React.useEffect(() => {
    const handleOrientationChange = () => {
      setIsLandscape(window.orientation === 90 || window.orientation === -90);
    };

    handleOrientationChange();
    window.addEventListener('orientationchange', handleOrientationChange);
    return () => window.removeEventListener('orientationchange', handleOrientationChange);
  }, []);

  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value;
  };

  return (
    <div className={`bg-card/50 backdrop-blur-sm rounded-lg p-6 w-full ${
      isLandscape ? 'fixed inset-0 z-50' : ''
    }`}>
      <ChartHeader chartRef={chartRef} />
      <div ref={chartRef} className={`${isLandscape ? 'h-screen' : 'h-[400px]'} w-full`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={getChartMargins(isLandscape, isMobile)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.border} />
            <XAxis
              dataKey="name"
              stroke={CHART_COLORS.gray}
              axisLine={{ strokeWidth: 1 }}
              tick={{
                dy: 20,
                fontSize: isLandscape ? 14 : 12,
                fill: CHART_COLORS.gray
              }}
              interval={0}
              height={isMobile ? 40 : 60}
              tickMargin={10}
            />
            <YAxis
              stroke={CHART_COLORS.gray}
              tick={{
                fontSize: isLandscape ? 14 : 12,
                fill: CHART_COLORS.gray
              }}
              width={isLandscape ? 60 : 50}
              tickMargin={8}
              tickFormatter={formatYAxis}
              label={{ 
                value: 'Conversions', 
                angle: -90, 
                position: 'insideLeft',
                style: { 
                  textAnchor: 'middle',
                  fill: CHART_COLORS.gray,
                  fontSize: isLandscape ? 14 : 12
                },
                dx: -10
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "none",
                borderRadius: "8px",
                fontSize: isLandscape ? "14px" : "12px",
                padding: "8px 12px"
              }}
              formatter={(value: number) => [`${value.toLocaleString()} conversions`, 'Conversions']}
            />
            <Line
              type="monotone"
              dataKey="current"
              name="Current Period"
              stroke={CHART_COLORS.blue}
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="previous"
              name="Previous Period"
              stroke={CHART_COLORS.gray}
              strokeWidth={2}
              dot={false}
            />
            <CampaignLabels
              data={chartData}
              isMobile={isMobile}
              isLandscape={isLandscape}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
