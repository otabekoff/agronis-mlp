
import React from 'react';
import { Hash, CreditCard, ChevronRight, LogOut, Bell, Shield, Globe } from 'lucide-react';
import { TEXT } from '../utils/Localization';
import { USER_PROFILE } from '../utils/Data';
import { AppColors } from '../types';

export const Settings: React.FC = () => {
  return (
    <div className="space-y-6 pb-24">
      <h2 className="text-2xl font-bold text-slate-800 px-2">{TEXT.settings.title}</h2>

      {/* User Profile Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-green-600 font-bold text-xl border-2 border-green-100">
                {USER_PROFILE.avatarInitials}
            </div>
            <div>
                <h3 className="text-lg font-bold text-slate-900">{USER_PROFILE.name}</h3>
                <p className="text-sm text-slate-500">{USER_PROFILE.email}</p>
            </div>
        </div>

        <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3 text-slate-600">
                    <Hash className="w-4 h-4" />
                    <span className="text-sm font-medium">{TEXT.settings.farmId}</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{USER_PROFILE.farmId}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3 text-slate-600">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-sm font-medium">{TEXT.settings.subscription}</span>
                </div>
                <span className="text-xs font-bold px-2 py-1 bg-yellow-100 text-yellow-700 rounded-md border border-yellow-200">
                    {USER_PROFILE.subscription}
                </span>
            </div>
        </div>
      </div>

      {/* Menu Options */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-50">
            <div className="flex items-center gap-3 text-slate-700">
                <Globe className="w-5 h-5" />
                <span className="font-medium">{TEXT.settings.language}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">O'zbekcha</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
        </button>
        <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-50">
            <div className="flex items-center gap-3 text-slate-700">
                <Bell className="w-5 h-5" />
                <span className="font-medium">{TEXT.settings.notifications}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
        <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-50">
            <div className="flex items-center gap-3 text-slate-700">
                <Shield className="w-5 h-5" />
                <span className="font-medium">{TEXT.settings.privacy}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
         <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-red-500">
            <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">{TEXT.settings.logout}</span>
            </div>
        </button>
      </div>
    </div>
  );
};
