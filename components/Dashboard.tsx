
import React, { useState, useEffect } from 'react';
import { CloudRain, Droplets, Thermometer, Zap, Sparkles, RefreshCw, ArrowRight, Cloud, MessageCircle } from 'lucide-react';
import { SensorData, WeatherData } from '../types';
import * as GeminiService from '../services/geminiService';
import { TEXT } from '../utils/Localization';
import { AI_SUGGESTION_MOCK } from '../utils/Data';

interface DashboardProps {
  data: SensorData;
  weather: WeatherData;
  onOpenChat: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, weather, onOpenChat }) => {
  const [aiSummary, setAiSummary] = useState<string>("Tahlil qilinmoqda...");
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  // Initial fast check using Flash-Lite
  useEffect(() => {
    let mounted = true;
    const fetchQuickStatus = async () => {
      const summary = await GeminiService.getQuickFieldStatus(data);
      if (mounted) setAiSummary(summary);
    };
    fetchQuickStatus();
    return () => { mounted = false; };
  }, [data]);

  const handleGetDetailedAdvice = async () => {
    setLoadingAdvice(true);
    const advice = await GeminiService.getAgronomyAdvice(data, weather);
    setAiAdvice(advice);
    setLoadingAdvice(false);
  };

  return (
    <div className="space-y-4 pb-24">
      
      {/* 1. Blue Card: Rain Expected (Top) */}
      <div className="bg-blue-50 rounded-3xl p-5 border border-blue-100 flex items-center gap-4 shadow-sm">
          <div className="bg-blue-100 p-3 rounded-full shrink-0">
             <CloudRain className="w-8 h-8 text-blue-600" />
          </div>
          <div>
             <h3 className="text-lg font-bold text-slate-800">{TEXT.dashboard.rainAlertTitle}</h3>
             <p className="text-blue-700 text-sm font-medium leading-tight">
                {AI_SUGGESTION_MOCK}
             </p>
          </div>
      </div>

      {/* 2. Sensor Grid: Moisture & Temp */}
      <div className="grid grid-cols-2 gap-4">
        {/* Moisture */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-40">
          <div className="flex items-center gap-2 text-slate-400">
            <Droplets className="w-5 h-5" />
            <span className="text-xs font-bold uppercase">{TEXT.dashboard.sensors.moisture}</span>
          </div>
          <div>
             <span className="text-4xl font-bold" style={{ color: '#EAB308' }}>
              {data.moisture}
            </span>
            <span className="text-sm text-slate-400 ml-1">%</span>
            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-2 mt-3 rounded-full overflow-hidden">
                <div 
                className="h-full rounded-full" 
                style={{ width: `${data.moisture}%`, backgroundColor: '#EAB308' }}
                ></div>
            </div>
          </div>
        </div>

        {/* Temp */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-40">
          <div className="flex items-center gap-2 text-slate-400">
            <Thermometer className="w-5 h-5" />
            <span className="text-xs font-bold uppercase">{TEXT.dashboard.sensors.temp}</span>
          </div>
          <div>
            <span className="text-4xl font-bold text-slate-800">{data.temp}</span>
            <span className="text-sm text-slate-400 ml-1">°C</span>
            <p className="text-xs text-green-500 font-medium mt-3">
                {TEXT.dashboard.sensors.optimal}
            </p>
          </div>
        </div>
      </div>

      {/* 3. EC Level Card (Full Width) */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
               <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <Zap className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase">{TEXT.dashboard.sensors.ec}</span>
              </div>
              <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-slate-800">{data.ec}</span>
                  <span className="text-sm text-slate-400">dS/m</span>
              </div>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
               <div className="w-3 h-3 rounded-full bg-green-400"></div>
               {TEXT.dashboard.sensors.nutrients}
          </div>
      </div>

      {/* 4. Field Status Card (Title + Summary) */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{TEXT.dashboard.title}</h2>
            <p className="text-slate-400 text-xs font-medium">{TEXT.dashboard.lastSynced}</p>
          </div>
          <div className="bg-slate-100 p-2 rounded-xl">
            <Cloud className="w-5 h-5 text-slate-600" />
          </div>
        </div>
        
        {/* Summary Box */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 relative">
           <div className="absolute left-0 top-3 bottom-3 w-1 bg-green-400 rounded-r-full"></div>
           <p className="text-slate-700 text-sm font-medium leading-relaxed pl-2">
             {aiSummary}
           </p>
        </div>
      </div>

      {/* 5. AgroNIS Advisor (Green Card - Bottom) */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-green-100 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Sparkles className="w-32 h-32 text-green-500" />
        </div>

        <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-green-500" />
                <h3 className="font-bold text-slate-800">{TEXT.dashboard.aiAdvisor}</h3>
            </div>
            
            <p className="text-slate-500 text-sm mb-6 max-w-[85%]">
                Namlik darajasi ({data.moisture}%) va ob-havo ma'lumotlariga asoslanib sug'orish bo'yicha maslahat oling.
            </p>

            {!aiAdvice ? (
                <button
                onClick={handleGetDetailedAdvice}
                disabled={loadingAdvice}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-green-200 w-full justify-center md:w-auto"
                >
                {loadingAdvice ? (
                    <>
                    <RefreshCw className="w-5 h-5 animate-spin" /> {TEXT.dashboard.analyzing}
                    </>
                ) : (
                    <>
                    {TEXT.dashboard.analyzeBtn} <ArrowRight className="w-5 h-5" />
                    </>
                )}
                </button>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-2 bg-green-50 p-4 rounded-xl border border-green-100">
                    <p className="text-slate-800 font-medium text-sm leading-relaxed whitespace-pre-line">
                        {aiAdvice}
                    </p>
                    <button 
                        onClick={onOpenChat}
                        className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md shadow-green-200 flex items-center gap-2 transition-colors w-full justify-center md:w-auto"
                    >
                        <MessageCircle className="w-4 h-4" /> {TEXT.dashboard.continueChat}
                    </button>
                </div>
            )}
        </div>
      </div>

    </div>
  );
};