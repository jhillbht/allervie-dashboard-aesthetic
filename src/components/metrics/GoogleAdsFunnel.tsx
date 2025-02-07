import React from 'react';

interface GoogleAdsFunnelProps {
  impressions: number;
  clicks: number;
  conversions: number;
}

export const GoogleAdsFunnel = ({ impressions, clicks, conversions }: GoogleAdsFunnelProps) => {
  // Calculate relative widths based on the largest value
  const maxValue = Math.max(impressions, clicks, conversions);
  const getRelativeWidth = (value: number) => {
    return Math.max((value / maxValue) * 100, 20); // Minimum 20% width to maintain readability
  };

  return (
    <div className="relative w-full h-64 bg-gradient-to-b from-[#9b87f5] via-[#7E69AB] to-[#0EA5E9] rounded-lg overflow-hidden">
      <div className="absolute inset-0 flex flex-col justify-between p-4">
        <div 
          className="w-full text-center p-2 bg-white/10 backdrop-blur-sm rounded border border-white/20 transition-all duration-300"
          style={{ width: `${getRelativeWidth(impressions)}%` }}
        >
          <p className="text-sm font-medium text-white">Impressions</p>
          <p className="text-lg font-bold text-white">{impressions.toLocaleString()}</p>
        </div>
        <div 
          className="mx-auto text-center p-2 bg-white/10 backdrop-blur-sm rounded border border-white/20 transition-all duration-300"
          style={{ width: `${getRelativeWidth(clicks)}%` }}
        >
          <p className="text-sm font-medium text-white">Clicks</p>
          <p className="text-lg font-bold text-white">{clicks.toLocaleString()}</p>
        </div>
        <div 
          className="mx-auto text-center p-2 bg-white/10 backdrop-blur-sm rounded border border-white/20 transition-all duration-300"
          style={{ width: `${getRelativeWidth(conversions)}%` }}
        >
          <p className="text-sm font-medium text-white">Conversions</p>
          <p className="text-lg font-bold text-white">{conversions.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};