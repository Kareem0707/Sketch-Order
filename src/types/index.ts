export type TemplateId =
  | 'sportech-sneakers'      // SPORTECH Sports & Sneakers
  | 'cloudrunner-product'    // Nike Cloud Runner 2 Single Product Page
  | 'dinereserve-food'       // DineReserve Luxury Dark Restaurant & Dining
  | 'fasco-fashion'          // FASCO Streetwear & Oversized Fashion
  | 'burger-club'            // Burger Club Fast Food & Sandwiches
  | 'panto-minimal'          // Panto Minimal Scandinavian Furniture
  | 'velvety-jewelry'        // Velvety Beauty, Perfumes & Jewelry
  | 'ctrl-yz'          // CTRL YZ 3D Oversized Cyberpunk & Streetwear
  | 'sketch-comic';          // The signature 2D stickman hand-drawn comic style

export type StoreThemeId = 'modern-clean' | 'comic-red' | 'minimal-luxury' | 'sketch-mono';

export interface StoreTheme {
  id: StoreThemeId;
  name: string;
  nameEn: string;
  styleMode: 'modern' | 'sketch';
  bgPaper: string;
  cardBg: string;
  inkColor: string;
  accentColor: string;
  secondaryAccent: string;
  borderColor: string;
  borderRadius: string;
  boxShadow: string;
  description: string;
  tag: string;
}

export interface StoreTemplate {
  id: TemplateId;
  name: string;
  nameEn: string;
  categoryName: string;
  badge: string;
  themeStyle: 'modern' | 'luxury-dark' | 'minimal' | 'retro' | 'sketch';
  accentColor: string;
  bgPage: string;
  cardBg: string;
  textColor: string;
  description: string;
  previewImage: string;
  categories: string[];
}

export interface CustomProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  costPrice?: number; // Cost price for calculating net profit
  category: string;
  description?: string;
  tag?: string;
  imageUrl: string;
  sketchSvg?: string;
  badge?: string;
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  rating?: number;
  reviewsCount?: number;
  soldCount?: string;
}

export interface StoreSectionToggle {
  id: string;
  label: string;
  icon: string;
  enabled: boolean;
}

export interface CustomStoreConfig {
  storeName: string;
  tagline: string;
  niche: 'sneakers' | 'streetwear' | 'coffee' | 'food' | 'handmade' | 'tech' | 'furniture' | 'beauty';
  templateId: TemplateId;
  themeId?: StoreThemeId;
  accentColor: string;
  customDomain: string;
  currency: string;
  whatsappNumber: string;
  governorate: string;
  sections: {
    heroBanner: boolean;
    categoriesBar: boolean;
    sizeGuide: boolean;
    bestSellers: boolean;
    flashSale: boolean;
    reviewsSection: boolean;
    instantWhatsappCart: boolean;
    analyticsDashboard: boolean;
  };
  categories: string[];
  products: CustomProduct[];
}

export type StoreProduct = CustomProduct;

export interface PricingPlan {
  id: 'standard' | 'pro' | 'custom';
  name: string;
  nameEn: string;
  price: number | 'custom';
  priceDisplay: string;
  badge?: string;
  description: string;
  features: string[];
  limitations?: string;
  isPopular?: boolean;
}

export interface CartItem extends CustomProduct {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  category: 'core' | 'orders' | 'marketing' | 'custom' | 'identity' | 'integrations';
  basePrice: number;
  daysNeeded: number;
  blueprintModule: string;
  sketchIcon: string;
}

export interface BlueprintFormData {
  fullName: string;
  customerEmail?: string;
  isGoogleVerified?: boolean;
  googleProfile?: {
    email: string;
    name: string;
    picture?: string;
  };
  storeName: string;
  storeType: string;
  whatsapp: string;
  governorate: string;
  paymentMethod: string;
  selectedPlan: 'standard' | 'pro' | 'custom';
  notes: string;
  selectedFeatures?: string[];
  themeId?: string;
  customStoreConfig?: CustomStoreConfig;
  subdomain?: string;
  receiptImageUrl?: string;
  transactionRef?: string;
}

export interface ClientOrderRequest {
  id: string;
  createdAt: string;
  clientName: string;
  customerEmail?: string;
  isGoogleVerified?: boolean;
  whatsappNumber: string;
  brandName: string;
  subdomain: string;
  selectedPlan: 'standard' | 'pro' | 'custom';
  planName: string;
  amount: number | string;
  templateId: TemplateId;
  templateName: string;
  paymentMethod: 'instapay' | 'vodafone_cash' | 'card';
  transactionRef?: string;
  receiptImageUrl?: string;
  notes?: string;
  status: 'pending_review' | 'approved_building' | 'deployed_live' | 'cancelled';
  approvedAt?: string;
}


export interface TenantCustomerOrder {
  id: string;
  tenantSubdomain: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerGovernorate: string;
  customerAddress: string;
  items: CartItem[];
  totalAmount: number;
  paymentMethod: 'cash_on_delivery' | 'instapay' | 'vodafone_cash';
  status: 'new' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
}

export interface TenantStoreAccount {
  tenantId: string;
  subdomain: string;
  brandName: string;
  ownerName: string;
  ownerPhone: string;
  planTier: 'standard' | 'pro' | 'custom';
  status: 'active' | 'pending' | 'suspended';
  templateId: TemplateId;
  storeConfig: CustomStoreConfig;
  createdAt: string;
  salesTotal: number;
  ordersCount: number;
}
