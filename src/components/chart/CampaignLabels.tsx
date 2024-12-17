import React from 'react';
import { ReferenceLine } from 'recharts';
import { ChartDataPoint, CHART_COLORS } from './chart-utils';

interface CampaignLabelsProps {
  data: ChartDataPoint[];
  isMobile: boolean;
  isLandscape: boolean;
}

export const CampaignLabels = ({ data, isMobile, isLandscape }: CampaignLabelsProps) => {
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
              position: 'top',
              value: entry.campaign,
              fill: CHART_COLORS.green,
              fontSize: isLandscape ? 12 : 10,
              offset: 10
            }}
          />
        ) : null
      )}
    </>
  );
};