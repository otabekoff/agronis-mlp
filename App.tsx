
import React, { useState } from 'react';
import { ZeroState } from './components/ZeroState';
import { Dashboard } from './components/Dashboard';
import { Analytics } from './components/Analytics';
import { Devices } from './components/Devices';
import { Settings } from './components/Settings';
import { Chat } from './components/Chat';
import { AppTab } from './types';
import { LayoutGrid, BarChart3, Settings as SettingsIcon, Sprout, Cpu, Info } from 'lucide-react';
import { Demo } from './components/Demo';
import { TEXT } from './utils/Localization';
import { SENSOR_DATA, WEATHER_DATA, HISTORY_DATA } from './utils/Data';

const App: React.FC = () => {
  const [hasDevice, setHasDevice] = useState(false);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);

  if (!hasDevice) {
    return <ZeroState onDeviceAdded={() => setHasDevice(true)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.DASHBOARD:
        return <Dashboard 
          data={SENSOR_DATA} 
          weather={WEATHER_DATA} 
          onOpenChat={() => setActiveTab(AppTab.CHAT)} 
        />;
      case AppTab.ANALYTICS:
        return <Analytics historyData={HISTORY_DATA} />;
      case AppTab.DEVICES:
        return <Devices />;
      case AppTab.SETTINGS:
        return <Settings />;
      case AppTab.DEMO:
        return <Demo />;
      case AppTab.CHAT:
        return <Chat onBack={() => setActiveTab(AppTab.DASHBOARD)} />;
      default:
        return <Dashboard 
          data={SENSOR_DATA} 
          weather={WEATHER_DATA} 
          onOpenChat={() => setActiveTab(AppTab.CHAT)} 
        />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* Sidebar Navigation (Web) */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="bg-green-500 p-2 rounded-xl shadow-lg shadow-green-200">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">AgroNIS</h1>
            <p className="text-xs text-slate-400 font-medium">Uzbekistan IoT</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-2">
           <button 
             onClick={() => setActiveTab(AppTab.DASHBOARD)}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${activeTab === AppTab.DASHBOARD ? 'bg-green-50 text-green-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
           >
             <LayoutGrid className="w-5 h-5" />
             {TEXT.nav.dashboard}
           </button>

           <button 
             onClick={() => setActiveTab(AppTab.ANALYTICS)}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${activeTab === AppTab.ANALYTICS ? 'bg-green-50 text-green-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
           >
             <BarChart3 className="w-5 h-5" />
             {TEXT.nav.analytics}
           </button>

           <button 
             onClick={() => setActiveTab(AppTab.DEVICES)}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${activeTab === AppTab.DEVICES ? 'bg-green-50 text-green-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
           >
             <Cpu className="w-5 h-5" />
             {TEXT.nav.devices}
           </button>

           <button 
             onClick={() => setActiveTab(AppTab.DEMO)}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${activeTab === AppTab.DEMO ? 'bg-green-50 text-green-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
           >
             <Info className="w-5 h-5" />
             Demo / API
           </button>

           <button 
             onClick={() => setActiveTab(AppTab.SETTINGS)}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${activeTab === AppTab.SETTINGS ? 'bg-green-50 text-green-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
           >
             <SettingsIcon className="w-5 h-5" />
             {TEXT.nav.settings}
           </button>
        </nav>

        <div className="p-6 border-t border-slate-100">
           <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-sm font-bold text-slate-700 shadow-sm">AF</div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-800 truncate">Alisher Farmonov</p>
                <p className="text-xs text-slate-400 truncate">alisher.f@agronis.uz</p>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
         {/* Mobile Header (Hidden when Chat is active to give full screen feel) */}
         {activeTab !== AppTab.CHAT && (
            <header className="md:hidden bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
              <div className="flex items-center gap-2">
                <div className="bg-green-500 p-1.5 rounded-lg">
                  <Sprout className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-lg font-bold tracking-tight text-slate-800">AgroNIS</h1>
              </div>
              <div className="w-8 h-8 bg-green-50 border border-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-700">
                  AF
              </div>
            </header>
         )}

        <main className={`flex-1 overflow-y-auto ${activeTab === AppTab.CHAT ? 'p-0' : 'p-4 md:p-8'} scrollbar-hide`}>
          <div className={`${activeTab === AppTab.CHAT ? 'h-full' : 'max-w-4xl mx-auto'}`}>
             {renderContent()}
          </div>
        </main>

        {/* Mobile Navigation (Bottom) - Hidden in Chat Mode */}
        {activeTab !== AppTab.CHAT && (
          <nav className="md:hidden bg-white border-t border-slate-100 px-6 py-3 flex justify-between items-center pb-safe">
            <button 
              onClick={() => setActiveTab(AppTab.DASHBOARD)}
              className={`flex flex-col items-center gap-1 transition-colors ${activeTab === AppTab.DASHBOARD ? 'text-green-500' : 'text-slate-400'}`}
            >
              <LayoutGrid className="w-6 h-6" />
              <span className="text-[10px] font-medium">{TEXT.nav.dashboard}</span>
            </button>

            <button 
              onClick={() => setActiveTab(AppTab.ANALYTICS)}
              className={`flex flex-col items-center gap-1 transition-colors ${activeTab === AppTab.ANALYTICS ? 'text-green-500' : 'text-slate-400'}`}
            >
              <BarChart3 className="w-6 h-6" />
              <span className="text-[10px] font-medium">{TEXT.nav.analytics}</span>
            </button>

            <button 
              onClick={() => setActiveTab(AppTab.DEVICES)}
              className={`flex flex-col items-center gap-1 transition-colors ${activeTab === AppTab.DEVICES ? 'text-green-500' : 'text-slate-400'}`}
            >
              <Cpu className="w-6 h-6" />
              <span className="text-[10px] font-medium">{TEXT.nav.devices}</span>
            </button>

            <button 
              onClick={() => setActiveTab(AppTab.SETTINGS)}
              className={`flex flex-col items-center gap-1 transition-colors ${activeTab === AppTab.SETTINGS ? 'text-green-500' : 'text-slate-400'}`}
            >
              <SettingsIcon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{TEXT.nav.settings}</span>
            </button>

            <button 
              onClick={() => setActiveTab(AppTab.DEMO)}
              className={`flex flex-col items-center gap-1 transition-colors ${activeTab === AppTab.DEMO ? 'text-green-500' : 'text-slate-400'}`}
            >
              <Info className="w-6 h-6" />
              <span className="text-[10px] font-medium">Demo</span>
            </button>
          </nav>
        )}
      </div>
    </div>
  );
};

export default App;