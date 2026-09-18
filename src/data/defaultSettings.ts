import { CafeSettings, DeliverySettings, PickupSettings } from '../types';

export const defaultDeliverySettings: DeliverySettings = {
  isEnabled: true,
  cafeCoordinates: {
    lat: 33.5651,
    lng: 73.0982,
  },
  cafeAddress: 'Sector F, Commercial Area, DHA Phase 4, Islamabad',
  maxDeliveryDistanceKm: 12,
  estimatedDeliveryTimeMins: 40,
  minOrderAmount: 600,
  zones: [
    {
      id: 'z-1',
      name: 'Zone 1 (DHA Phase 4 & Sector F Nearby)',
      minDistanceKm: 0,
      maxDistanceKm: 3,
      fee: 150,
    },
    {
      id: 'z-2',
      name: 'Zone 2 (DHA Phase 1, 2, 3 & 5)',
      minDistanceKm: 3,
      maxDistanceKm: 6,
      fee: 250,
    },
    {
      id: 'z-3',
      name: 'Zone 3 (Bahria Town & Executive Blocks)',
      minDistanceKm: 6,
      maxDistanceKm: 9,
      fee: 350,
    },
    {
      id: 'z-4',
      name: 'Zone 4 (Extended Islamabad Area up to 12 km)',
      minDistanceKm: 9,
      maxDistanceKm: 12,
      fee: 450,
    },
  ],
};

export const defaultPickupSettings: PickupSettings = {
  isEnabled: true,
  openingTime: '08:00',
  closingTime: '00:00',
  preparationTimeMins: 25,
  slotIntervalMins: 15,
  allowSameDay: true,
  allowScheduled: true,
  maxAdvanceDays: 3,
};

export const defaultCafeSettings: CafeSettings = {
  cafeName: 'CHAAYÉ KHANA – DHA-4',
  tagline: 'Tea Beyond Borders',
  logo: '',
  heroImage: '',
  phone: '+92 51 111 242 293',
  whatsapp: '+923005552429',
  instagram: '@chaayekhana',
  email: 'info@chaayekhanadha4.com',
  address: 'Sector F, Commercial Area, DHA Phase 4, Islamabad',
  city: 'Rawalpindi',
  googleMapsUrl: 'https://www.google.com/maps/place/Chaay%C3%A9+Khana+Sector+F+Commercial+Area+DHA+Phase+4+Rawalpindi/@33.5651,73.0982,17z',
  openingHoursDisplay: 'Monday – Sunday: 8:00 AM – 12:00 Midnight',
  aboutStory: 'Founded as Pakistan’s pioneering tea cafe, Chaayé Khana – DHA-4 brings together a warm community retreat and an expansive menu of artisanal teas, continental breakfasts, wholesome sandwiches, and comforting café classics.',
  foodPhilosophy: 'Tea is our muse, and craft is our commitment. From hand-picked loose leaf teas and specialty brews to freshly baked goods and wholesome comfort food, every detail is curated for peaceful moments and genuine conversations.',
  qualityMessage: 'Prepared strictly made-to-order using high-grade ingredients, pure dairy, and uncompromising kitchen cleanliness.',
  atmosphereMessage: 'Relaxed minimalist ambiance, warm lighting, quiet reading corners, and the soothing aroma of freshly brewed tea.',
  taxRatePercent: 5,
  adminPin: '1234',
  socialsConfig: [
    { platform: 'instagram', url: 'https://instagram.com/chaayekhana', isEnabled: true },
    { platform: 'facebook', url: 'https://facebook.com/chaayekhana', isEnabled: true },
    { platform: 'tiktok', url: 'https://tiktok.com/@chaayekhana', isEnabled: false },
    { platform: 'youtube', url: 'https://youtube.com/@chaayekhana', isEnabled: true }
  ]
};
