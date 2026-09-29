'use client';

import React from 'react';

interface TrackingMapProps {
  currentLocation?: string;
  destinationCity: string;
}

export const TrackingMap: React.FC<TrackingMapProps> = ({
  currentLocation = 'In Transit - Regional Hub',
  destinationCity,
}) => {
  return (
    <div className="bg-slate-900 text-white rounded-lg p-6 relative overflow-hidden flex flex-col justify-between h-64 shadow-md">
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">Live GPS Tracking</span>
          <h3 className="text-lg font-bold">{currentLocation}</h3>
          <p className="text-xs text-slate-300">Destination: {destinationCity}</p>
        </div>
        <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
          ● Driver Active
        </div>
      </div>

      {/* Map simulation lines */}
      <div className="relative z-10 flex items-center justify-between px-8 text-xs font-bold text-slate-300">
        <div className="flex flex-col items-center">
          <span className="w-4 h-4 bg-emerald-500 rounded-full mb-1" />
          <span>Hub</span>
        </div>
        <div className="flex-1 h-0.5 bg-dashed bg-gradient-to-r from-emerald-500 to-orange-400 mx-3 border-t-2 border-dashed border-slate-600" />
        <div className="flex flex-col items-center">
          <span className="w-4 h-4 bg-orange-400 rounded-full mb-1 animate-bounce" />
          <span>Van</span>
        </div>
        <div className="flex-1 h-0.5 bg-slate-700 mx-3" />
        <div className="flex flex-col items-center">
          <span className="w-4 h-4 bg-slate-500 rounded-full mb-1" />
          <span>You</span>
        </div>
      </div>
    </div>
  );
};

export default TrackingMap;
