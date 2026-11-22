export type ProductCategory = 
  | 'all' 
  | 'hot' 
  | 'cold' 
  | 'specialty' 
  | 'tea' 
  | 'desserts' 
  | 'bakery' 
  | 'snacks';

export interface ProductSize {
  name: string;
  label: string;
  volume: string;
  priceMultiplier: number;
}

export interface Model3DConfig {
  cupColor: string;
  saucerColor: string;
  liquidColor: string;
  cremaColor?: string;
  foamHeight?: number;
  hasIce?: boolean;
  iceCount?: number;
  hasStraw?: boolean;
  topping?: 'none' | 'cinnamon' | 'caramel' | 'cocoa' | 'beans' | 'mint';
  glassType?: 'ceramic-mug' | 'glass-tumbler' | 'martini-glass' | 'paper-cup';
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: ProductCategory;
  price: number; // in INR
  description: string;
  longDescription: string;
  rating: number;
  reviewCount: number;
  calories: number;
  prepTime: string;
  roastLevel?: 'Light' | 'Light-Medium' | 'Medium' | 'Medium-Dark' | 'Dark';
  origin?: string;
  ingredients: string[];
  allergens?: string[];
  featured?: boolean;
  badge?: string;
  image: string;
  sizes: ProductSize[];
  model3D: Model3DConfig;
}

export interface CartItem {
  id: string; // unique item id (productId + size)
  product: Product;
  size: ProductSize;
  quantity: number;
  unitPrice: number;
}

export interface ReservationFormData {
  fullName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  seatingArea: 'main-floor' | 'terrace' | 'private-lounge' | 'bar';
  specialRequests?: string;
}

export interface ReservationConfirmation extends ReservationFormData {
  id: string;
  bookingRef: string;
  createdAt: string;
  status: 'confirmed' | 'pending';
}

export interface BrewingStep {
  step: number;
  title: string;
  instruction: string;
  durationSeconds: number;
}

export interface BrewingMethod {
  id: 'espresso' | 'pourover' | 'frenchpress' | 'coldbrew';
  name: string;
  tagline: string;
  iconName: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Master Barista';
  grindSize: string;
  coffeeRatio: string;
  waterTemp: string;
  totalTime: string;
  equipment: string[];
  description: string;
  tastingNotes: string[];
  steps: BrewingStep[];
}

export interface CafeZone {
  id: string;
  title: string;
  subtitle: string;
  shortTag: string;
  description: string;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  hotspotPosition: [number, number, number];
  ambiance: string;
  highlights: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'interior' | 'brewing' | 'beverage' | 'patisserie';
  imageUrl: string;
  caption: string;
  aspect: 'square' | 'portrait' | 'landscape';
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  location: string;
  rating: number;
  avatar: string;
}
