
import React from 'react';
import { Radio, Battery, Zap, MapPin, CheckCircle2, Cpu } from 'lucide-react';
import { TEXT } from '../utils/Localization';
import { DEVICE_LIST } from '../utils/Data';
import { AppColors } from '../types';

export const Devices: React.FC = () => {
  return (
    <div className="space-y-6 pb-24">
      <h2 className="text-2xl font-bold text-slate-800 px-2">{TEXT.devices.title}</h2>

      <div className="grid gap-4">
        {DEVICE_LIST.map((device) => (
          <div key={device.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 relative overflow-hidden group hover:border-green-200 transition-colors">
            {/* Status Indicator Stripe */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: device.status === 'active' ? AppColors.Optimal : AppColors.Warning }}></div>
            
            <div className="flex justify-between items-start mb-4 pl-3 relative">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700">
                        {device.type === 'base_station' ? <Radio className="w-6 h-6" /> : <Cpu className="w-6 h-6" />}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">{device.name}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="relative flex h-2.5 w-2.5">
                              {device.status === 'active' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: device.status === 'active' ? AppColors.Optimal : AppColors.Warning }}></span>
                            </span>
                            <span className="text-xs font-medium text-slate-600">
                                {device.status === 'active' ? TEXT.devices.active : TEXT.devices.inactive}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-50 border border-slate-100">
                        <Battery className="w-3 h-3 text-slate-400" />
                        <span className="text-xs font-bold text-slate-700">{device.battery}%</span>
                        {device.isSolar && <Zap className="w-3 h-3 text-yellow-500 ml-1" />}
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-4 pl-3">
                 <div className="bg-slate-50 rounded-lg p-2.5">
                    <span className="text-xs text-slate-400 block mb-1">{TEXT.devices.location}</span>
                    <div className="flex items-center gap-1.5 text-slate-700 font-medium text-sm truncate">
                        <MapPin className="w-3.5 h-3.5" />
                        {device.location}
                    </div>
                 </div>
                 <div className="bg-slate-50 rounded-lg p-2.5">
                    <span className="text-xs text-slate-400 block mb-1">{TEXT.devices.network}</span>
                    <div className="flex items-center gap-1.5 text-slate-700 font-medium text-sm">
                        <Zap className="w-3.5 h-3.5" />
                        {device.connectionType}
                    </div>
                 </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
