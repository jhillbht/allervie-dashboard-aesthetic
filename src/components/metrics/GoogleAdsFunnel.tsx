import React from 'react';

export const GoogleAdsFunnel = () => (
  <div className="relative w-full h-64 bg-gradient-to-b from-[#9b87f5] via-[#7E69AB] to-[#0EA5E9] rounded-lg overflow-hidden">
    <div className="absolute inset-0 flex flex-col justify-between p-4">
      <div className="w-full text-center p-2 bg-white/10 backdrop-blur-sm rounded border border-white/20">
        <p className="text-sm font-medium text-white">Impressions</p>
        <p className="text-lg font-bold text-white">154K</p>
      </div>
      <div className="w-3/4 mx-auto text-center p-2 bg-white/10 backdrop-blur-sm rounded border border-white/20">
        <p className="text-sm font-medium text-white">Clicks</p>
        <p className="text-lg font-bold text-white">1,845</p>
      </div>
      <div className="w-1/2 mx-auto text-center p-2 bg-white/10 backdrop-blur-sm rounded border border-white/20">
        <p className="text-sm font-medium text-white">Conversions</p>
        <p className="text-lg font-bold text-white">155.99</p>
      </div>
    </div>
  </div>
);