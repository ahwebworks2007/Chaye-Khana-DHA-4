import { DeliverySettings, DeliveryZone, PickupSettings } from '../types';

/**
 * Calculates distance between two coordinates in kilometers using Haversine formula
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // 1 decimal place
}

/**
 * Determines delivery zone and fee for a given distance in km
 */
export function evaluateDeliveryZone(
  distanceKm: number,
  deliverySettings: DeliverySettings
): {
  isDeliverable: boolean;
  zone?: DeliveryZone;
  fee: number;
  message: string;
} {
  if (!deliverySettings.isEnabled) {
    return {
      isDeliverable: false,
      fee: 0,
      message: 'Delivery service is currently offline. Please choose pickup.',
    };
  }

  if (distanceKm > deliverySettings.maxDeliveryDistanceKm) {
    return {
      isDeliverable: false,
      fee: 0,
      message: "Sorry, we currently don't deliver to this location.",
    };
  }

  const matchingZone = deliverySettings.zones.find(
    (z) => distanceKm >= z.minDistanceKm && distanceKm <= z.maxDistanceKm
  );

  if (matchingZone) {
    return {
      isDeliverable: true,
      zone: matchingZone,
      fee: matchingZone.fee,
      message: 'Great! We deliver to your area.',
    };
  }

  // Fallback if within maximum distance
  const lastZone = deliverySettings.zones[deliverySettings.zones.length - 1];
  const fee = lastZone ? lastZone.fee : 250;
  return {
    isDeliverable: true,
    fee,
    message: 'Great! We deliver to your area.',
  };
}

/**
 * Formats price in PKR (Rs.)
 */
export function formatPrice(amount: number): string {
  return `Rs. ${Math.round(amount).toLocaleString()}`;
}

/**
 * Parses "HH:mm" time string into minutes from midnight
 */
export function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + (minutes || 0);
}

/**
 * Formats minutes from midnight to "HH:mm" or "h:mm A"
 */
export function minutesToDisplayTime(totalMinutes: number): string {
  const hours24 = Math.floor(totalMinutes / 60) % 24;
  const mins = totalMinutes % 60;
  const ampm = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 || 12;
  const minsStr = mins < 10 ? `0${mins}` : `${mins}`;
  return `${hours12}:${minsStr} ${ampm}`;
}

/**
 * Checks if current time is within operating hours
 */
export function isCurrentlyOpen(pickupSettings: PickupSettings): boolean {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openMins = timeToMinutes(pickupSettings.openingTime);
  const closeMins = timeToMinutes(pickupSettings.closingTime);

  if (closeMins > openMins) {
    return currentMinutes >= openMins && currentMinutes < closeMins;
  } else {
    // Overnight hours (e.g. 10:00 to 02:00)
    return currentMinutes >= openMins || currentMinutes < closeMins;
  }
}

/**
 * Generates available pickup slots for a given target date
 */
export function generateAvailablePickupSlots(
  targetDateStr: string, // "YYYY-MM-DD"
  pickupSettings: PickupSettings
): { timeValue: string; displayLabel: string; isAvailable: boolean }[] {
  const slots: { timeValue: string; displayLabel: string; isAvailable: boolean }[] = [];

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const isToday = targetDateStr === todayStr;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openMins = timeToMinutes(pickupSettings.openingTime);
  const closeMins = timeToMinutes(pickupSettings.closingTime);
  const prepTime = pickupSettings.preparationTimeMins;
  const interval = pickupSettings.slotIntervalMins || 15;

  // Earliest allowable pickup time for today is now + prepTime
  const earliestAllowableMinsToday = currentMinutes + prepTime;

  for (let m = openMins; m <= closeMins - 15; m += interval) {
    const hours24 = Math.floor(m / 60);
    const mins = m % 60;
    const timeValue = `${hours24.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    const displayLabel = minutesToDisplayTime(m);

    let isAvailable = true;
    if (isToday && m < earliestAllowableMinsToday) {
      isAvailable = false;
    }

    slots.push({
      timeValue,
      displayLabel,
      isAvailable,
    });
  }

  return slots;
}

/**
 * Calculates earliest pickup time and estimated preparation range based on prep time
 */
export function calculateEarliestPickupInfo(prepTimeMins: number = 30): {
  earliestPickupDisplay: string;
  earliestPickupDate: Date;
  prepRangeDisplay: string;
} {
  const prep = Math.max(5, prepTimeMins);
  const minPrep = Math.max(5, prep - 5);
  const prepRangeDisplay = `${minPrep}–${prep} minutes`;

  const now = new Date();
  const earliestPickupDate = new Date(now.getTime() + prep * 60 * 1000);
  const totalMins = earliestPickupDate.getHours() * 60 + earliestPickupDate.getMinutes();
  const earliestPickupDisplay = minutesToDisplayTime(totalMins);

  return {
    earliestPickupDisplay,
    earliestPickupDate,
    prepRangeDisplay,
  };
}

/**
 * Formats a date for display
 */
export function formatDateDisplay(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}
