
import React, { useState } from 'react';
import { Plus, Scan, Leaf } from 'lucide-react';
import { TEXT } from '../utils/Localization';

interface ZeroStateProps {
  onDeviceAdded: () => void;
}

export const ZeroState: React.FC<ZeroStateProps> = ({ onDeviceAdded }) => {
  const [isScanning, setIsScanning] = useState(false);

  const handleAddDevice = () => {
    setIsScanning(true);
    // Simulate API call / Scanning delay
    setTimeout(() => {
      onDeviceAdded();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-64 bg-green-400 rounded-b-[3rem] opacity-10 z-0"></div>
      
      <div className="z-10 flex flex-col items-center text-center max-w-md w-full animate-in fade-in duration-700">
        <div className="mb-8 p-4 bg-white rounded-2xl shadow-xl shadow-green-100">
          <Leaf className="w-12 h-12 text-green-500" />
        </div>

        <h1 className="text-3xl font-bold text-slate-800 mb-3">{TEXT.zeroState.welcome}</h1>
        <p className="text-slate-500 mb-10 text-lg">
          {TEXT.zeroState.subtext}
        </p>

        {isScanning ? (
          <div className="flex flex-col items-center animate-in fade-in duration-500">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-green-200 border-t-green-500 animate-spin mb-6"></div>
            </div>
            <p className="text-green-600 font-medium">{TEXT.zeroState.scanning}</p>
            <p className="text-slate-400 text-sm mt-2">{TEXT.zeroState.verifying}</p>
          </div>
        ) : (
          <div className="relative group">
            <button
              onClick={handleAddDevice}
              className="w-64 h-20 bg-green-400 hover:bg-green-500 text-white rounded-full flex items-center justify-center gap-3 shadow-lg shadow-green-200 transition-all transform hover:scale-105 active:scale-95 duration-300"
            >
              <Plus className="w-8 h-8" />
              <span className="font-bold text-lg">{TEXT.zeroState.button}</span>
            </button>
            <div className="absolute -inset-2 border-2 border-green-300 rounded-full animate-ping opacity-20 pointer-events-none"></div>
          </div>
        )}
      </div>

      <div className="absolute bottom-8 text-center w-full">
        <p className="text-xs text-slate-300">{TEXT.zeroState.version}</p>
      </div>
    </div>
  );
};
