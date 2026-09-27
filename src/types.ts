export interface Product {
  id: string;
  name: string;
  category: string;
  subCategory?: string;
  image: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  unit: string;
  variants?: { unit: string; price: number; originalPrice: number }[];
  deliveryTimeMins: number;
  inStock: boolean;
  inStockCount?: number;
  sku: string;
  mpn?: string;
  manufacturer?: string;
  warehouseBin?: string;
  etaMinutes?: number;
  rating: number;
  ratingCount: number;
  description: string;
  tags?: string[];
  brand?: string;
  shelfLife?: string;
  countryOfOrigin?: string;
  specifications?: Record<string, string>;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  bannerImage?: string;
  color?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  image: string;
  actionCategory: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedUnit?: string;
  price: number;
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  title: string;
  addressLine: string;
  landmark: string;
  pincode: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: CartItem[];
  totalAmount: number;
  status: 'placed' | 'packing' | 'out_for_delivery' | 'delivered';
  deliveryAddress: Address;
  riderName?: string;
  riderPhone?: string;
  etaMins: number;
}

export interface RentalTool {
  id: string;
  name: string;
  category: 'demolition-drilling' | 'concrete-earthwork' | 'laser-measuring' | 'welding-cutting' | 'scaffolding-cleaning';
  categoryLabel: string;
  image: string;
  dailyRate: number;
  weeklyRate: number;
  securityDeposit: number;
  brand: string;
  rating: number;
  ratingCount: number;
  description: string;
  powerSpecs: string;
  includes: string[];
  inStock: boolean;
  minDays: number;
}

export interface RentalBooking {
  id: string;
  tool: RentalTool;
  durationDays: number;
  startDate: string;
  endDate: string;
  dailyRate: number;
  totalRentalPrice: number;
  securityDeposit: number;
  hasOperatorAssistance: boolean;
  operatorFee: number;
  status: 'active' | 'scheduled' | 'return_requested' | 'completed';
}
