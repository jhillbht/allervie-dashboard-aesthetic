import React from 'react';
import { ReferenceLine } from 'recharts';
import { ChartDataPoint, CHART_COLORS } from './chart-utils';

interface CampaignLabelsProps {
  data: ChartDataPoint[];
  isMobile: boolean;
  isLandscape: boolean;
}

export const CampaignLabels = ({ data, isMobile, isLandscape }: CampaignLabelsProps) => {
  if (isMobile) {
    return (
      <>
        {data.map((entry) =>
          entry.campaign ? (
            <ReferenceLine
              key={entry.campaign}
              x={entry.name}
              stroke={CHART_COLORS.green}
              strokeDasharray="3 3"
              label={{
                position: 'insideBottom',
                value: entry.campaign,
                fill: CHART_COLORS.green,
                fontSize: isLandscape ? 12 : 10,
                angle: 90,
                offset: 10
              }}
            />
          ) : null
        )}
      </>
    );
  }

  return (
    <div className="flex justify-center mt-4">
      {data.map((entry, index) =>
        entry.campaign ? (
          <text
            key={`label-${index}`}
            x={0}
            y={0}
            fill={CHART_COLORS.green}
            textAnchor="middle"
            fontSize={12}
            transform={`translate(${index * 100}, 50)`}
          >
            {entry.campaign}
          </text>
        ) : null
      )}
    </div>
  );
};