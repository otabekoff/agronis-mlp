
export interface SensorData {
  moisture: number;
  temp: number;
  ec: number;
  battery: number;
}

export interface WeatherData {
  condition: string;
  temp: number;
  precipChance: number;
  forecast: string;
}

export interface Device {
  id: string;
  name: string;
  type: 'base_station' | 'sensor' | 'monitor';
  status: 'active' | 'inactive' | 'maintenance';
  battery: number;
  isSolar: boolean;
  location: string;
  connectionType: string;
}

export interface UserProfile {
  name: string;
  email: string;
  farmId: string;
  subscription: string;
  avatarInitials: string;
}

export enum AppTab {
  DASHBOARD = 'dashboard',
  ANALYTICS = 'analytics',
  DEVICES = 'devices',
  SETTINGS = 'settings',
  CHAT = 'chat'
}

export const AppColors = {
  Optimal: '#4ADE80', // Yashil
  Warning: '#FACC15', // Sariq
  Critical: '#EF4444', // Qizil
  Saving: '#3B82F6',  // Ko'k
};