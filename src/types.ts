export interface MenuItemOption {
  name: string;
  price: number; // additional price in Rs.
}

export interface MenuItemVariant {
  name: string; // e.g. "Regular", "Large", "Single", "Double"
  price: number; // base price for this variant in Rs.
}

export interface MenuItem {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  price: number; // in Rs.
  image: string;
  variants?: MenuItemVariant[];
  options?: MenuItemOption[];
  isAvailable: boolean;
  isPopular?: boolean;
  isChefsSpecial?: boolean;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  isNew?: boolean;
  priceNote?: string;
  note?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  order: number;
  isActive: boolean;
  iconName?: string;
  description?: string;
}

export interface CartItem {
  cartItemId: string; // unique per configuration (item + variant + options + instructions)
  menuItem: MenuItem;
  selectedVariant?: MenuItemVariant;
  selectedOptions: MenuItemOption[];
  specialInstructions: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type OrderType = 'delivery' | 'pickup';

export type DeliveryOrderStatus =
  | 'New'
  | 'Confirmed'
  | 'Preparing'
  | 'Out for Delivery'
  | 'Completed'
  | 'Cancelled';

export type PickupOrderStatus =
  | 'Order Received'
  | 'New'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready for Pickup'
  | 'Picked Up'
  | 'Cancelled';

export type OrderStatus = DeliveryOrderStatus | PickupOrderStatus;

export interface DeliveryZone {
  id: string;
  name: string;
  minDistanceKm: number;
  maxDistanceKm: number;
  fee: number; // in Rs.
  estimatedMinutes?: number;
}

export interface DeliverySettings {
  isEnabled: boolean;
  cafeCoordinates: {
    lat: number;
    lng: number;
  };
  cafeAddress: string;
  maxDeliveryDistanceKm: number;
  estimatedDeliveryTimeMins: number;
  minOrderAmount: number; // in Rs.
  zones: DeliveryZone[];
}

export interface PickupSettings {
  isEnabled: boolean;
  openingTime: string; // "09:00"
  closingTime: string; // "23:00"
  preparationTimeMins: number; // e.g. 30
  slotIntervalMins: number; // e.g. 15
  allowSameDay: boolean;
  allowScheduled: boolean;
  maxAdvanceDays: number;
}

export interface SocialPlatformConfig {
  platform: 'instagram' | 'facebook' | 'tiktok' | 'youtube' | string;
  url: string;
  isEnabled: boolean;
}

export interface CafeSettings {
  cafeName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  instagram: string; // legacy support
  email: string;
  address: string;
  city: string;
  googleMapsUrl: string;
  openingHoursDisplay: string;
  aboutStory: string;
  foodPhilosophy: string;
  qualityMessage: string;
  atmosphereMessage: string;
  taxRatePercent: number; // e.g. 5
  adminPin?: string; // legacy field
  adminPasswordHash?: string; // SHA-256 secure hash
  logo?: string;
  socialsConfig?: SocialPlatformConfig[];
}

export interface CustomerUser {
  name: string;
  phone: string;
  email?: string;
}

export interface CustomerOrder {
  id: string; // e.g. "ORD-8492"
  orderType: OrderType;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  createdAt: string; // ISO string
  estimatedPreparationTimeMins: number;
  expectedTimeDisplay: string; // e.g. "7:45 PM"

  // Delivery-specific
  deliveryAddress?: string;
  deliveryLandmark?: string;
  deliveryCoordinates?: {
    lat: number;
    lng: number;
  };
  deliveryDistanceKm?: number;
  deliveryZoneName?: string;

  // Pickup-specific
  pickupMode?: 'asap' | 'scheduled';
  pickupDate?: string; // e.g. "2026-09-04"
  pickupTime?: string; // e.g. "19:30"
  pickupNotes?: string;
}
