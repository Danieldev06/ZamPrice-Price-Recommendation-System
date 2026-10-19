export const STORES = [
  { id: 'shoprite', name: 'Shoprite', color: '#E31837', logo: '🛒', avgBasket: 450, deals: 18, products: 934 },
  { id: 'choppies', name: 'Choppies', color: '#0066CC', logo: '🏪', avgBasket: 438, deals: 12, products: 876 },
  { id: 'picknpay', name: 'Pick n Pay', color: '#009F44', logo: '🛍️', avgBasket: 468, deals: 9, products: 812 },
  { id: 'spar', name: 'Spar', color: '#007A33', logo: '🏬', avgBasket: 472, deals: 7, products: 654 },
  { id: 'game', name: 'Game', color: '#E8291C', logo: '🎯', avgBasket: 490, deals: 5, products: 520 },
];

export const STORE_LOCATIONS = [
  { storeId: 'shoprite', branch: 'Kabulonga', distance: 2.1, travelTime: '8 min', lat: -15.41, lng: 28.30, hours: '08:00–21:00', available: 11, total: 12, basketPrice: 450 },
  { storeId: 'shoprite', branch: 'Manda Hill', distance: 3.8, travelTime: '15 min', lat: -15.40, lng: 28.31, hours: '08:00–21:00', available: 12, total: 12, basketPrice: 447 },
  { storeId: 'choppies', branch: 'Cairo Road', distance: 4.2, travelTime: '18 min', lat: -15.42, lng: 28.28, hours: '07:00–20:00', available: 10, total: 12, basketPrice: 432 },
  { storeId: 'picknpay', branch: 'Arcades', distance: 5.1, travelTime: '20 min', lat: -15.43, lng: 28.32, hours: '08:00–20:00', available: 9, total: 12, basketPrice: 468 },
  { storeId: 'spar', branch: 'Woodlands', distance: 6.3, travelTime: '25 min', lat: -15.44, lng: 28.29, hours: '07:30–20:30', available: 8, total: 12, basketPrice: 472 },
];

export const CATEGORIES = [
  { id: 'mealie', name: 'Mealie Meal', icon: '🌽', count: 24 },
  { id: 'oil', name: 'Cooking Oil', icon: '🫙', count: 18 },
  { id: 'sugar', name: 'Sugar', icon: '🧂', count: 12 },
  { id: 'rice', name: 'Rice', icon: '🍚', count: 31 },
  { id: 'bread', name: 'Bread', icon: '🍞', count: 16 },
  { id: 'milk', name: 'Milk', icon: '🥛', count: 22 },
  { id: 'eggs', name: 'Eggs', icon: '🥚', count: 8 },
  { id: 'cereals', name: 'Cereals', icon: '🥣', count: 35 },
  { id: 'beverages', name: 'Beverages', icon: '🥤', count: 64 },
  { id: 'household', name: 'Household', icon: '🧴', count: 89 },
];

export interface ProductPrice {
  storeId: string;
  price: number;
  unitPrice: number;
  unitLabel: string;
  available: boolean;
  stock: 'in_stock' | 'limited' | 'out_of_stock';
  promotion?: string;
  discount?: number;
  updatedAgo: string;
  freshness: 'fresh' | 'recent' | 'stale';
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  quantity: string;
  category: string;
  image: string;
  prices: ProductPrice[];
  priceHistory: { date: string; shoprite: number; choppies: number; picknpay: number }[];
}

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Mealie Meal',
    brand: "Roller's Choice",
    quantity: '5kg',
    category: 'Mealie Meal',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=300&fit=crop&auto=format',
    prices: [
      { storeId: 'shoprite', price: 185, unitPrice: 37, unitLabel: '/kg', available: true, stock: 'in_stock', updatedAgo: '2 hours ago', freshness: 'fresh' },
      { storeId: 'choppies', price: 192, unitPrice: 38.4, unitLabel: '/kg', available: true, stock: 'in_stock', updatedAgo: '1 hour ago', freshness: 'fresh' },
      { storeId: 'picknpay', price: 205, unitPrice: 41, unitLabel: '/kg', available: true, stock: 'limited', updatedAgo: 'Yesterday', freshness: 'recent' },
      { storeId: 'spar', price: 210, unitPrice: 42, unitLabel: '/kg', available: true, stock: 'in_stock', updatedAgo: '3 days ago', freshness: 'stale' },
    ],
    priceHistory: [
      { date: '05 Aug', shoprite: 210, choppies: 215, picknpay: 220 },
      { date: '12 Aug', shoprite: 205, choppies: 210, picknpay: 218 },
      { date: '19 Aug', shoprite: 198, choppies: 205, picknpay: 212 },
      { date: '26 Aug', shoprite: 190, choppies: 200, picknpay: 208 },
      { date: '02 Sep', shoprite: 185, choppies: 192, picknpay: 205 },
    ],
  },
  {
    id: 'p2',
    name: 'Cooking Oil',
    brand: 'Freshmark',
    quantity: '2L',
    category: 'Cooking Oil',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=300&fit=crop&auto=format',
    prices: [
      { storeId: 'shoprite', price: 75, unitPrice: 37.5, unitLabel: '/L', available: true, stock: 'in_stock', updatedAgo: '2 hours ago', freshness: 'fresh' },
      { storeId: 'choppies', price: 70, unitPrice: 35, unitLabel: '/L', available: true, stock: 'in_stock', promotion: 'Special Offer', discount: 8, updatedAgo: '1 hour ago', freshness: 'fresh' },
      { storeId: 'picknpay', price: 80, unitPrice: 40, unitLabel: '/L', available: true, stock: 'in_stock', updatedAgo: '5 hours ago', freshness: 'fresh' },
    ],
    priceHistory: [
      { date: '05 Aug', shoprite: 82, choppies: 80, picknpay: 85 },
      { date: '12 Aug', shoprite: 80, choppies: 78, picknpay: 83 },
      { date: '19 Aug', shoprite: 78, choppies: 75, picknpay: 81 },
      { date: '26 Aug', shoprite: 76, choppies: 72, picknpay: 80 },
      { date: '02 Sep', shoprite: 75, choppies: 70, picknpay: 80 },
    ],
  },
  {
    id: 'p3',
    name: 'White Sugar',
    brand: 'Zambia Sugar',
    quantity: '2kg',
    category: 'Sugar',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&auto=format',
    prices: [
      { storeId: 'shoprite', price: 48, unitPrice: 24, unitLabel: '/kg', available: true, stock: 'in_stock', updatedAgo: '2 hours ago', freshness: 'fresh' },
      { storeId: 'choppies', price: 52, unitPrice: 26, unitLabel: '/kg', available: true, stock: 'in_stock', updatedAgo: '3 hours ago', freshness: 'fresh' },
      { storeId: 'picknpay', price: 50, unitPrice: 25, unitLabel: '/kg', available: true, stock: 'in_stock', updatedAgo: 'Yesterday', freshness: 'recent' },
    ],
    priceHistory: [
      { date: '05 Aug', shoprite: 52, choppies: 55, picknpay: 53 },
      { date: '12 Aug', shoprite: 50, choppies: 54, picknpay: 52 },
      { date: '19 Aug', shoprite: 49, choppies: 53, picknpay: 51 },
      { date: '26 Aug', shoprite: 48, choppies: 52, picknpay: 50 },
      { date: '02 Sep', shoprite: 48, choppies: 52, picknpay: 50 },
    ],
  },
  {
    id: 'p4',
    name: 'Long Grain Rice',
    brand: 'Golden Dish',
    quantity: '1kg',
    category: 'Rice',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop&auto=format',
    prices: [
      { storeId: 'shoprite', price: 32, unitPrice: 32, unitLabel: '/kg', available: true, stock: 'in_stock', updatedAgo: '2 hours ago', freshness: 'fresh' },
      { storeId: 'choppies', price: 35, unitPrice: 35, unitLabel: '/kg', available: true, stock: 'in_stock', updatedAgo: '4 hours ago', freshness: 'fresh' },
      { storeId: 'picknpay', price: 38, unitPrice: 38, unitLabel: '/kg', available: false, stock: 'out_of_stock', updatedAgo: '2 days ago', freshness: 'recent' },
    ],
    priceHistory: [
      { date: '05 Aug', shoprite: 38, choppies: 40, picknpay: 42 },
      { date: '12 Aug', shoprite: 36, choppies: 38, picknpay: 40 },
      { date: '19 Aug', shoprite: 34, choppies: 36, picknpay: 39 },
      { date: '26 Aug', shoprite: 33, choppies: 35, picknpay: 38 },
      { date: '02 Sep', shoprite: 32, choppies: 35, picknpay: 38 },
    ],
  },
  {
    id: 'p5',
    name: 'Sliced White Bread',
    brand: 'Shoprite Bakery',
    quantity: '700g',
    category: 'Bread',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop&auto=format',
    prices: [
      { storeId: 'shoprite', price: 18, unitPrice: 25.7, unitLabel: '/kg', available: true, stock: 'in_stock', updatedAgo: '1 hour ago', freshness: 'fresh' },
      { storeId: 'choppies', price: 18, unitPrice: 25.7, unitLabel: '/kg', available: true, stock: 'in_stock', updatedAgo: '2 hours ago', freshness: 'fresh' },
      { storeId: 'picknpay', price: 20, unitPrice: 28.6, unitLabel: '/kg', available: true, stock: 'in_stock', updatedAgo: '3 hours ago', freshness: 'fresh' },
    ],
    priceHistory: [
      { date: '05 Aug', shoprite: 18, choppies: 18, picknpay: 20 },
      { date: '12 Aug', shoprite: 18, choppies: 18, picknpay: 20 },
      { date: '19 Aug', shoprite: 18, choppies: 18, picknpay: 20 },
      { date: '26 Aug', shoprite: 18, choppies: 18, picknpay: 20 },
      { date: '02 Sep', shoprite: 18, choppies: 18, picknpay: 20 },
    ],
  },
  {
    id: 'p6',
    name: 'Free Range Eggs',
    brand: 'Zamchick',
    quantity: '18 pcs',
    category: 'Eggs',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&h=300&fit=crop&auto=format',
    prices: [
      { storeId: 'shoprite', price: 35, unitPrice: 1.94, unitLabel: '/egg', available: true, stock: 'in_stock', updatedAgo: '2 hours ago', freshness: 'fresh' },
      { storeId: 'choppies', price: 38, unitPrice: 2.11, unitLabel: '/egg', available: true, stock: 'in_stock', updatedAgo: '5 hours ago', freshness: 'fresh' },
      { storeId: 'picknpay', price: 40, unitPrice: 2.22, unitLabel: '/egg', available: true, stock: 'limited', updatedAgo: 'Yesterday', freshness: 'recent' },
    ],
    priceHistory: [
      { date: '05 Aug', shoprite: 38, choppies: 40, picknpay: 42 },
      { date: '12 Aug', shoprite: 37, choppies: 39, picknpay: 42 },
      { date: '19 Aug', shoprite: 36, choppies: 38, picknpay: 41 },
      { date: '26 Aug', shoprite: 35, choppies: 38, picknpay: 40 },
      { date: '02 Sep', shoprite: 35, choppies: 38, picknpay: 40 },
    ],
  },
  {
    id: 'p7',
    name: 'Cooking Oil',
    brand: 'Freshmark',
    quantity: '5L',
    category: 'Cooking Oil',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=300&fit=crop&auto=format',
    prices: [
      { storeId: 'shoprite', price: 165, unitPrice: 33, unitLabel: '/L', available: true, stock: 'in_stock', updatedAgo: '2 hours ago', freshness: 'fresh' },
      { storeId: 'choppies', price: 159, unitPrice: 31.8, unitLabel: '/L', available: true, stock: 'in_stock', promotion: '14% OFF', discount: 14, updatedAgo: '1 hour ago', freshness: 'fresh' },
      { storeId: 'picknpay', price: 172, unitPrice: 34.4, unitLabel: '/L', available: true, stock: 'in_stock', updatedAgo: '4 hours ago', freshness: 'fresh' },
    ],
    priceHistory: [
      { date: '05 Aug', shoprite: 180, choppies: 185, picknpay: 188 },
      { date: '12 Aug', shoprite: 175, choppies: 178, picknpay: 182 },
      { date: '19 Aug', shoprite: 170, choppies: 170, picknpay: 176 },
      { date: '26 Aug', shoprite: 168, choppies: 162, picknpay: 174 },
      { date: '02 Sep', shoprite: 165, choppies: 159, picknpay: 172 },
    ],
  },
];

export const BASKET_ITEMS = [
  { productId: 'p1', qty: 1 },
  { productId: 'p2', qty: 1 },
  { productId: 'p3', qty: 1 },
  { productId: 'p4', qty: 1 },
  { productId: 'p5', qty: 1 },
  { productId: 'p6', qty: 1 },
];

export const PRICE_ALERTS = [
  { id: 'a1', productName: '5L Cooking Oil', currentPrice: 165, targetPrice: 150, preferredStore: 'Choppies', status: 'waiting' as const, notif: 'Push + Email' },
  { id: 'a2', productName: '5kg Mealie Meal', currentPrice: 175, targetPrice: 180, preferredStore: 'Shoprite', status: 'reached' as const, notif: 'Push' },
  { id: 'a3', productName: 'Free Range Eggs (18)', currentPrice: 38, targetPrice: 35, preferredStore: 'Any', status: 'waiting' as const, notif: 'Email' },
];

export const DEALS = [
  { id: 'd1', productName: 'Cooking Oil 5L', store: 'Choppies', was: 185, now: 159, discount: 14, category: 'Cooking Oil', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=200&fit=crop&auto=format', expires: 'Ends Sunday' },
  { id: 'd2', productName: 'Mealie Meal 10kg', store: 'Shoprite', was: 360, now: 295, discount: 18, category: 'Mealie Meal', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop&auto=format', expires: 'Ends Today' },
  { id: 'd3', productName: 'Rice 5kg', store: 'Pick n Pay', was: 185, now: 158, discount: 15, category: 'Rice', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop&auto=format', expires: '3 days left' },
  { id: 'd4', productName: 'Milk 1L × 6', store: 'Spar', was: 175, now: 148, discount: 15, category: 'Milk', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=200&fit=crop&auto=format', expires: '5 days left' },
  { id: 'd5', productName: 'Eggs 30 pcs', store: 'Shoprite', was: 58, now: 48, discount: 17, category: 'Eggs', image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&h=200&fit=crop&auto=format', expires: 'Ends Sunday' },
  { id: 'd6', productName: 'Bread 700g × 2', store: 'Choppies', was: 40, now: 32, discount: 20, category: 'Bread', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=200&fit=crop&auto=format', expires: '2 days left' },
];

export const NOTIFICATIONS = [
  { id: 'n1', type: 'price_drop', title: 'Price Drop 🎉', message: '5kg Mealie Meal dropped from K195 to K180 at Shoprite.', time: '5 min ago', read: false },
  { id: 'n2', type: 'alert_reached', title: 'Target Reached ✅', message: 'Your price alert for Mealie Meal (K180) has been reached at Shoprite!', time: '1 hour ago', read: false },
  { id: 'n3', type: 'deal', title: 'New Deal 🔥', message: 'Cooking Oil 5L now 14% OFF at Choppies — only this week.', time: '3 hours ago', read: false },
  { id: 'n4', type: 'in_stock', title: 'Back in Stock', message: 'Long Grain Rice 1kg is back in stock at Pick n Pay.', time: 'Yesterday', read: true },
  { id: 'n5', type: 'price_increase', title: 'Price Increase ⚠️', message: 'Cooking Oil 2L increased from K68 to K75 at Shoprite.', time: '2 days ago', read: true },
];
