
import { SensorData, WeatherData, Device, UserProfile } from '../types';

export const SENSOR_DATA: SensorData = {
  moisture: 28, // Low moisture for demo
  temp: 24,
  ec: 1.2,
  battery: 85
};

export const WEATHER_DATA: WeatherData = {
  condition: "Rain",
  temp: 22,
  precipChance: 80,
  forecast: "Kuchli yomg'ir"
};

export const AI_SUGGESTION_MOCK = "Yomg'ir 8 soat ichida kutilmoqda. Sug'orishni bekor qilib, 45$ tejang.";

export const HISTORY_DATA = [
  { day: 'Dush', moisture: 45 },
  { day: 'Sesh', moisture: 42 },
  { day: 'Chor', moisture: 38 },
  { day: 'Pay', moisture: 35 },
  { day: 'Juma', moisture: 32 },
  { day: 'Shan', moisture: 30 },
  { day: 'Yak', moisture: 28 },
];

export const DEVICE_LIST: Device[] = [
  {
    id: 'd1',
    name: 'Base Stansiyasi',
    type: 'base_station',
    status: 'active',
    battery: 95,
    isSolar: false,
    location: 'Markaziy Post',
    connectionType: 'LoRaWAN'
  },
  {
    id: 'd2',
    name: 'Universal Monitor 1',
    type: 'monitor',
    status: 'active',
    battery: 70,
    isSolar: true,
    location: 'Hudud 2',
    connectionType: 'Zigbee'
  },
  {
    id: 'd3',
    name: 'Tuproq Sensori A',
    type: 'sensor',
    status: 'active',
    battery: 88,
    isSolar: true,
    location: 'Hudud 1 (Kritik)',
    connectionType: 'Zigbee'
  }
];

export const USER_PROFILE: UserProfile = {
  name: "Alisher Farmonov",
  email: "alisher.f@agronis.uz",
  farmId: "AGR-470",
  subscription: "Demo Rejimi",
  avatarInitials: "AF"
};
