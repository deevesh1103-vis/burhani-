export interface Product {
  id: string;
  title: string;
  category: 'Sanitaryware & Closets' | 'Wash Basins & Countertops' | 'Faucets & Showers' | 'Plumbing Pipes & Valves' | 'Heavy Duty Manhole Covers & Chambers' | 'Plumbing Tools';
  price: number; // in INR (₹)
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  stock: number;
  sku: string;
  brand: string;
  images: string[];
  description: string;
  material: string;
  dimensions: string;
  warranty: string;
  features: string[];
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderTimelineEvent {
  title: string;
  timestamp: string;
  description: string;
  completed: boolean;
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  items: {
    product: Product;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  tax: number; // 18% GST typical for hardware
  shippingFee: number;
  total: number;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'CashOnDelivery' | 'StorePickup';
  paymentStatus: 'Paid' | 'Pending';
  orderStatus: 'Placed' | 'Packed' | 'Dispatched' | 'Out for Delivery' | 'Delivered';
  trackingNumber: string;
  carrier: string;
  timeline: OrderTimelineEvent[];
}

export interface EmailNotification {
  id: string;
  orderId: string;
  recipient: string;
  subject: string;
  type: 'order_confirmation' | 'tracking_update' | 'delivery_complete';
  sentAt: string;
  status: 'Delivered' | 'Sent';
  contentSnippet: string;
  orderStatusSnapshot: string;
  orderDetails: {
    customerName: string;
    totalAmount: number;
    itemCount: number;
    itemsList: { name: string; qty: number; price: number }[];
    trackingNumber: string;
    address: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  source?: 'gemini-3.8-flash' | 'knowledge-engine';
  suggestedAction?: {
    label: string;
    actionType: 'open-catalog' | 'open-location' | 'call' | 'track-order';
    payload?: string;
  };
}

export interface ChatQuickPrompt {
  id: string;
  label: string;
  prompt: string;
  iconName?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'staff' | 'customer';
  storeBranch?: string;
  firmName?: string;
}

