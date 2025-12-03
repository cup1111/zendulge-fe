export interface Deal {
  id: number;
  businessName: string;
  serviceName: string;
  category: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  startTime: string;
  endTime: string;
  availableSlots: number;
  imageUrl?: string;
  address: string;
  latitude: number;
  longitude: number;
  rating?: number;
  reviewCount?: number;
}

export const mockDeals: Deal[] = [
  {
    id: 1,
    businessName: 'Serenity Spa & Wellness',
    serviceName: '90-Minute Aromatherapy Massage',
    category: 'Massage',
    description:
      'Indulge in a luxurious 90-minute aromatherapy massage using premium essential oils. Perfect for stress relief and deep relaxation.',
    originalPrice: 180,
    discountedPrice: 89,
    discountPercentage: 51,
    startTime: '14:00',
    endTime: '16:00',
    availableSlots: 3,
    imageUrl: '/assets/massage-1.jpg',
    address: '123 Tranquility Lane, Melbourne VIC 3000',
    latitude: -37.8136,
    longitude: 144.9631,
    rating: 4.8,
    reviewCount: 127,
  },
  {
    id: 2,
    businessName: 'Zen Garden Beauty',
    serviceName: 'Deluxe Facial Treatment',
    category: 'Beauty',
    description:
      'Experience our signature facial treatment with organic products. Includes deep cleansing, exfoliation, mask, and moisturizer.',
    originalPrice: 150,
    discountedPrice: 75,
    discountPercentage: 50,
    startTime: '10:00',
    endTime: '12:00',
    availableSlots: 2,
    imageUrl: '/assets/beauty-salon.jpg',
    address: '456 Beauty Boulevard, Sydney NSW 2000',
    latitude: -33.8688,
    longitude: 151.2093,
    rating: 4.9,
    reviewCount: 203,
  },
  {
    id: 3,
    businessName: 'Aqua Bliss Spa',
    serviceName: 'Hydrotherapy Session',
    category: 'Spa',
    description:
      '60-minute hydrotherapy session in our state-of-the-art facilities. Includes sauna, steam room, and relaxation pool access.',
    originalPrice: 120,
    discountedPrice: 60,
    discountPercentage: 50,
    startTime: '09:00',
    endTime: '11:00',
    availableSlots: 5,
    imageUrl: '/assets/sauna.avif',
    address: '789 Wellness Way, Brisbane QLD 4000',
    latitude: -27.4698,
    longitude: 153.0251,
    rating: 4.7,
    reviewCount: 89,
  },
  {
    id: 4,
    businessName: 'Pure Balance Yoga',
    serviceName: 'Morning Yoga Class',
    category: 'Fitness',
    description:
      'Start your day with a rejuvenating 75-minute yoga session. All levels welcome.',
    originalPrice: 35,
    discountedPrice: 20,
    discountPercentage: 43,
    startTime: '07:00',
    endTime: '08:30',
    availableSlots: 8,
    address: '321 Harmony Street, Perth WA 6000',
    latitude: -31.9505,
    longitude: 115.8605,
    rating: 4.6,
    reviewCount: 156,
  },
  {
    id: 5,
    businessName: 'Lotus Healing Center',
    serviceName: 'Acupuncture Session',
    category: 'Alternative',
    description:
      'Traditional Chinese acupuncture treatment for pain relief and wellness. 60-minute session with licensed practitioner.',
    originalPrice: 95,
    discountedPrice: 55,
    discountPercentage: 42,
    startTime: '13:00',
    endTime: '15:00',
    availableSlots: 4,
    address: '567 Eastern Avenue, Adelaide SA 5000',
    latitude: -34.9285,
    longitude: 138.6007,
    rating: 4.8,
    reviewCount: 94,
  },
  {
    id: 6,
    businessName: 'Radiant Skin Clinic',
    serviceName: 'LED Light Therapy',
    category: 'Beauty',
    description:
      'Advanced LED light therapy for anti-aging and skin rejuvenation. Non-invasive treatment with visible results.',
    originalPrice: 110,
    discountedPrice: 65,
    discountPercentage: 41,
    startTime: '11:00',
    endTime: '13:00',
    availableSlots: 3,
    address: '890 Glow Street, Melbourne VIC 3000',
    latitude: -37.814,
    longitude: 144.9633,
    rating: 4.7,
    reviewCount: 72,
  },
];

export const categories = [
  { id: 'massage', name: 'Massage', icon: '💆', count: 45 },
  { id: 'beauty', name: 'Beauty', icon: '💅', count: 38 },
  { id: 'spa', name: 'Spa', icon: '🛁', count: 32 },
  { id: 'fitness', name: 'Fitness', icon: '🏃', count: 28 },
  { id: 'alternative', name: 'Alternative', icon: '🌿', count: 24 },
  { id: 'salon', name: 'Hair Salon', icon: '💇', count: 19 },
];

export const recentBookings = [
  {
    id: 101,
    dealId: 1,
    userName: 'Sarah M.',
    businessName: 'Serenity Spa & Wellness',
    serviceName: 'Aromatherapy Massage',
    bookedAt: '2 hours ago',
    avatar: 'SM',
  },
  {
    id: 102,
    dealId: 2,
    userName: 'James L.',
    businessName: 'Zen Garden Beauty',
    serviceName: 'Deluxe Facial',
    bookedAt: '3 hours ago',
    avatar: 'JL',
  },
  {
    id: 103,
    dealId: 3,
    userName: 'Emma W.',
    businessName: 'Aqua Bliss Spa',
    serviceName: 'Hydrotherapy',
    bookedAt: '5 hours ago',
    avatar: 'EW',
  },
];

export interface DealDetail extends Deal {
  description: string;
  urgencyLevel: 'low' | 'medium' | 'high';
  validUntil: string;
  usedSlots: number;
  businessPhone?: string;
  businessEmail?: string;
  businessWebsite?: string;
  images?: string[];
  reviews?: Review[];
}

export interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

// 获取相关推荐优惠
export function getRelatedDeals(
  currentDealId: number,
  category?: string
): Deal[] {
  return mockDeals
    .filter(
      deal =>
        deal.id !== currentDealId && (!category || deal.category === category)
    )
    .slice(0, 3);
}

export const WELLNESS_CATEGORIES = [
  'Massage Therapy',
  'Spa & Recovery',
  'Hair & Beauty',
  'Fitness & Yoga',
  'Holistic Healing',
  'Skincare',
  'Meditation',
  'Nutrition',
] as const;

export type WellnessCategory = (typeof WELLNESS_CATEGORIES)[number];

// Address interface for structured address data
export interface Address {
  country: string;
  streetNumber: string;
  street: string;
  suburb: string;
  city: string;
  state: string;
  postcode: string;
  fullAddress: string;
}

// 更新用户数据接口
export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'customer' | 'business' | 'owner';
  address?: Address;
  joinedDate: string;
  bookingsCount: number;
  favoritesCount: number;
  interests?: WellnessCategory[];
  businessesCount?: number;
}

// Mock 预订历史
export interface Booking {
  id: number;
  dealId: number;
  serviceName: string;
  businessName: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  amount: number;
}

export const mockBookings: Booking[] = [
  {
    id: 1,
    dealId: 1,
    serviceName: '90-Minute Aromatherapy Massage',
    businessName: 'Serenity Spa & Wellness',
    date: '2025-10-15',
    time: '14:00',
    status: 'upcoming',
    amount: 89,
  },
  {
    id: 2,
    dealId: 3,
    serviceName: 'Hydrotherapy Session',
    businessName: 'Aqua Bliss Spa',
    date: '2025-09-28',
    time: '10:00',
    status: 'completed',
    amount: 60,
  },
  {
    id: 3,
    dealId: 2,
    serviceName: 'Deluxe Facial Treatment',
    businessName: 'Zen Garden Beauty',
    date: '2025-09-15',
    time: '11:00',
    status: 'completed',
    amount: 75,
  },
];

// 更新 mockUser 为 Business 角色
export const mockUser: UserProfile = {
  id: 1,
  firstName: 'Business',
  lastName: 'Owner',
  email: 'business@example.com',
  phone: '+61 4XX XXX XXX',
  role: 'business',
  address: {
    country: 'Australia',
    streetNumber: '456',
    street: 'Business Avenue',
    suburb: 'CBD',
    city: 'Sydney',
    state: 'NSW',
    postcode: '2000',
    fullAddress: '456 Business Avenue, CBD, Sydney NSW 2000',
  },
  joinedDate: '2024-01-15',
  bookingsCount: 0,
  favoritesCount: 0,
  interests: ['Massage Therapy', 'Spa & Recovery'],
  businessesCount: 2,
};

// Mock 商家数据
export interface Business {
  id: number;
  name: string;
  description: string;
  address: string;
  isActive: boolean;
  category: WellnessCategory;
  totalRevenue: number;
  totalBookings: number;
}

export const mockBusinesses: Business[] = [
  {
    id: 1,
    name: 'Serenity Spa & Wellness',
    description:
      'Premium spa services offering massage, facials, and holistic treatments',
    address: '123 Wellness St, Melbourne VIC 3000',
    isActive: true,
    category: 'Spa & Recovery',
    totalRevenue: 45000,
    totalBookings: 320,
  },
  {
    id: 2,
    name: 'Zen Garden Beauty',
    description: 'Organic beauty treatments and skincare specialists',
    address: '456 Beauty Lane, Sydney NSW 2000',
    isActive: true,
    category: 'Hair & Beauty',
    totalRevenue: 32000,
    totalBookings: 215,
  },
];

// Business Management Mock Data
export const mockBusinessStats = {
  totalRevenue: 12485,
  revenueGrowth: 12,
  totalBookings: 147,
  bookingsGrowth: 8,
  activeDeals: 23,
  expiringDeals: 5,
  customerRating: 4.8,
  reviewCount: 89,
};

export const mockBusinessUsers = [
  {
    id: 1,
    name: 'Jennifer Smith',
    email: 'jennifer@zenspa.com',
    phone: '+1 (555) 123-4567',
    role: 'Manager',
    status: 'active' as const,
    lastActive: '2 hours ago',
    avatar: 'JS',
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'michael@zenspa.com',
    phone: '+1 (555) 234-5678',
    role: 'Therapist',
    status: 'active' as const,
    lastActive: '5 minutes ago',
    avatar: 'MC',
  },
  {
    id: 3,
    name: 'Sarah Wilson',
    email: 'sarah@zenspa.com',
    phone: '+1 (555) 345-6789',
    role: 'Receptionist',
    status: 'active' as const,
    lastActive: '1 hour ago',
    avatar: 'SW',
  },
  {
    id: 4,
    name: 'David Rodriguez',
    email: 'david@zenspa.com',
    phone: '+1 (555) 456-7890',
    role: 'Therapist',
    status: 'inactive' as const,
    lastActive: '3 days ago',
    avatar: 'DR',
  },
  {
    id: 5,
    name: 'Emma Thompson',
    email: 'emma@zenspa.com',
    phone: '+1 (555) 567-8901',
    role: 'Owner',
    status: 'active' as const,
    lastActive: '30 minutes ago',
    avatar: 'ET',
  },
];

export const mockOperatingSites = [
  {
    id: 1,
    name: 'Zen Spa & Wellness - Downtown',
    address: '123 Wellness Street, San Francisco, CA 94110',
    phone: '+1 (555) 123-4567',
    email: 'downtown@zenspa.com',
    status: 'active' as const,
    manager: 'Jennifer Smith',
    services: ['Massage', 'Facial', 'Sauna'],
    hours: '9:00 AM - 8:00 PM',
    revenue: '$45,200',
    bookings: 89,
  },
  {
    id: 2,
    name: 'Zen Spa & Wellness - Marina',
    address: '456 Ocean Avenue, San Francisco, CA 94123',
    phone: '+1 (555) 234-5678',
    email: 'marina@zenspa.com',
    status: 'active' as const,
    manager: 'Michael Chen',
    services: ['Massage', 'Yoga', 'Meditation'],
    hours: '10:00 AM - 7:00 PM',
    revenue: '$32,800',
    bookings: 67,
  },
  {
    id: 3,
    name: 'Zen Spa & Wellness - SOMA',
    address: '789 Market Street, San Francisco, CA 94103',
    phone: '+1 (555) 345-6789',
    email: 'soma@zenspa.com',
    status: 'opening_soon' as const,
    manager: 'Sarah Wilson',
    services: ['Massage', 'Beauty', 'Fitness'],
    hours: 'Coming Soon',
    revenue: '$0',
    bookings: 0,
  },
];

export const mockRecentBookings = [];

export const mockActiveDeals = [
  {
    id: 1,
    title: '50% Off Deep Tissue Massage',
    timeSlot: '2:00 PM - 4:00 PM',
    bookings: 12,
    status: 'active' as const,
  },
  {
    id: 2,
    title: '30% Off Facial Treatment',
    timeSlot: '10:00 AM - 12:00 PM',
    bookings: 8,
    status: 'active' as const,
  },
  {
    id: 3,
    title: '40% Off Swedish Massage',
    timeSlot: '6:00 PM - 8:00 PM',
    bookings: 5,
    status: 'expiring' as const,
  },
];

export const mockRecentActivity = [
  {
    action: 'New booking received',
    details: 'New booking received',
    time: '2 hours ago',
  },
  {
    action: 'Deal updated',
    details: '50% Off Swedish Massage deal was modified',
    time: '4 hours ago',
  },
  {
    action: 'Payment received',
    details: '$89 payment processed for booking #1247',
    time: '6 hours ago',
  },
  {
    action: 'Review received',
    details: '5-star review from Emma Wilson',
    time: '1 day ago',
  },
];
