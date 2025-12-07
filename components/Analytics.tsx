
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Radio } from 'lucide-react';
import { TEXT } from '../utils/Localization';
import { AppColors } from '../types';

interface AnalyticsProps {
  historyData: any[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ historyData }) => {
  return (
    <div className="space-y-6 pb-24">
      {/* Realistic Field Heatmap Simulation */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-800">{TEXT.analytics.title}</h2>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                {TEXT.analytics.subtitle}
            </span>
        </div>
        
        <div className="aspect-[16/9] w-full relative rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-stone-200">
            {/* SVG Map Layer */}
            <svg className="w-full h-full" viewBox="0 0 800 450" preserveAspectRatio="none">
                <defs>
                    {/* Filter for Heatmap Blur Effect */}
                    <filter id="blurFilter" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="20" />
                    </filter>
                    {/* Pattern for Crop Rows */}
                    <pattern id="cropRows" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(15)">
                        <line x1="0" y1="0" x2="0" y2="20" stroke="#78716c" strokeWidth="1" opacity="0.15" />
                    </pattern>
                </defs>

                {/* Base Earth/Field Texture */}
                <rect width="800" height="450" fill="#e7e5e4" />
                <rect width="800" height="450" fill="url(#cropRows)" />

                {/* --- HEATMAP ZONES (4 Irregular Shapes) --- */}
                
                {/* Zone 1: RED (Critical) - Prominent Bottom Left */}
                <path 
                    d="M-50,250 Q150,200 300,300 Q250,500 -50,500 Z" 
                    fill={AppColors.Critical} 
                    opacity="0.6" 
                    filter="url(#blurFilter)"
                />

                {/* Zone 2: YELLOW (Warning) - Center Right */}
                <path 
                    d="M350,150 Q550,100 700,200 Q650,350 400,300 Z" 
                    fill={AppColors.Warning} 
                    opacity="0.5" 
                    filter="url(#blurFilter)"
                />

                {/* Zone 3: GREEN (Optimal) - Top Left */}
                <path 
                    d="M-50,-50 L350,-50 L300,200 L-50,200 Z" 
                    fill={AppColors.Optimal} 
                    opacity="0.3" 
                    filter="url(#blurFilter)"
                />

                {/* Zone 4: GREEN (Optimal) - Top Right Corner */}
                <path 
                    d="M600,-50 L850,-50 L850,250 Q700,100 600,-50 Z" 
                    fill={AppColors.Optimal} 
                    opacity="0.3" 
                    filter="url(#blurFilter)"
                />
            </svg>

            {/* --- SENSOR MARKERS (Overlay) --- */}
            
            {/* Sensor 1: Critical Zone */}
            <div className="absolute bottom-[20%] left-[15%] group">
                <div className="relative flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 duration-1000"></span>
                    <div className="bg-white p-1.5 rounded-full shadow-lg border-2 border-red-500 z-10">
                        <Radio className="w-4 h-4 text-red-600" />
                    </div>
                </div>
            </div>

            {/* Sensor 2: Warning Zone */}
            <div className="absolute top-[45%] right-[25%] group">
                 <div className="relative flex items-center justify-center">
                    <div className="bg-white p-1.5 rounded-full shadow-lg border-2 border-yellow-400 z-10">
                        <Radio className="w-4 h-4 text-yellow-600" />
                    </div>
                </div>
            </div>

             {/* Sensor 3: Optimal Zone */}
             <div className="absolute top-[20%] left-[20%] group">
                 <div className="relative flex items-center justify-center">
                    <div className="bg-white p-1.5 rounded-full shadow-lg border-2 border-green-500 z-10">
                        <Radio className="w-4 h-4 text-green-600" />
                    </div>
                </div>
            </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-4 mt-6 justify-center flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-100">
                <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: AppColors.Optimal }}></div>
                <span className="text-xs font-semibold text-green-800">{TEXT.analytics.legend.optimal}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 rounded-full border border-yellow-100">
                <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: AppColors.Warning }}></div>
                <span className="text-xs font-semibold text-yellow-800">{TEXT.analytics.legend.warning}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-full border border-red-100">
                <div className="w-3 h-3 rounded-full shadow-sm animate-pulse" style={{ backgroundColor: AppColors.Critical }}></div>
                <span className="text-xs font-semibold text-red-800">{TEXT.analytics.legend.critical}</span>
            </div>
        </div>
      </div>

      {/* Moisture Trends Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-6">{TEXT.analytics.chartTitle}</h2>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart data={historyData}>
              <defs>
                <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={AppColors.Optimal} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={AppColors.Optimal} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12}} 
                dy={10}
              />
              <YAxis 
                hide 
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                labelStyle={{color: '#64748b'}}
              />
              <Area 
                type="monotone" 
                dataKey="moisture" 
                stroke={AppColors.Optimal} 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorMoisture)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
