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

// 详细的优惠数据
export const mockDealDetails: Record<number, DealDetail> = {
  1: {
    ...mockDeals[0],
    description:
      'Experience pure bliss with our signature 90-minute aromatherapy massage. Using a blend of premium essential oils including lavender, chamomile, and eucalyptus, our expert therapists will melt away your stress and tension. This deeply relaxing treatment includes a full body massage, focusing on pressure points to release built-up tension. Perfect for those seeking ultimate relaxation and stress relief.',
    urgencyLevel: 'medium',
    validUntil: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(), // 5 hours from now
    usedSlots: 1,
    businessPhone: '+61 3 9XXX XXXX',
    businessEmail: 'bookings@serenityspa.com.au',
    businessWebsite: 'https://serenityspa.com.au',
    images: [
      'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800',
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800',
    ],
    reviews: [
      {
        id: 1,
        userName: 'Sarah Johnson',
        rating: 5,
        comment:
          'Absolutely amazing! The therapist was so skilled and the atmosphere was perfect. I left feeling completely rejuvenated.',
        date: '2025-10-05',
        avatar: 'SJ',
      },
      {
        id: 2,
        userName: 'Michael Chen',
        rating: 5,
        comment:
          "Best massage I've ever had. Great value for the price, especially with this deal!",
        date: '2025-10-03',
        avatar: 'MC',
      },
      {
        id: 3,
        userName: 'Emma Wilson',
        rating: 4,
        comment:
          'Very relaxing experience. The oils they used smelled divine. Would definitely come back.',
        date: '2025-09-28',
        avatar: 'EW',
      },
    ],
  },
  2: {
    ...mockDeals[1],
    description:
      'Treat yourself to our luxurious deluxe facial treatment. This comprehensive 75-minute facial includes deep cleansing, gentle exfoliation with natural scrubs, a customized mask tailored to your skin type, and finishing with premium moisturizers and serums. Our expert estheticians use only organic, cruelty-free products to give you that healthy, glowing skin you deserve.',
    urgencyLevel: 'low',
    validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    usedSlots: 0,
    businessPhone: '+61 2 9XXX XXXX',
    businessEmail: 'hello@zengardenbeauty.com.au',
    businessWebsite: 'https://zengardenbeauty.com.au',
    images: [
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800',
    ],
    reviews: [
      {
        id: 4,
        userName: 'Lisa Anderson',
        rating: 5,
        comment:
          'My skin has never looked better! The staff is incredibly knowledgeable and professional.',
        date: '2025-10-07',
        avatar: 'LA',
      },
    ],
  },
  3: {
    ...mockDeals[2],
    description:
      'Indulge in our premium hydrotherapy experience. Enjoy 60 minutes of pure relaxation with full access to our state-of-the-art facilities including a Finnish sauna, aromatherapy steam room, ice fountain, and heated relaxation pool. Perfect for muscle recovery, stress relief, and overall wellness. Towels and robes provided.',
    urgencyLevel: 'low',
    validUntil: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    usedSlots: 2,
    businessPhone: '+61 7 3XXX XXXX',
    businessEmail: 'info@aquablissspa.com.au',
    businessWebsite: 'https://aquablissspa.com.au',
    images: [
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800',
    ],
    reviews: [],
  },
  4: {
    ...mockDeals[3],
    description:
      'Start your day right with our energizing morning yoga class. This 75-minute session is designed for all levels and focuses on building strength, flexibility, and mindfulness. Our certified instructors will guide you through a flow that combines traditional poses with modern techniques. Mats and props provided.',
    urgencyLevel: 'medium',
    validUntil: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    usedSlots: 4,
    businessPhone: '+61 8 9XXX XXXX',
    businessEmail: 'classes@purebalanceyoga.com.au',
    reviews: [],
  },
  5: {
    ...mockDeals[4],
    description:
      'Experience the ancient healing art of traditional Chinese acupuncture. Our licensed practitioner has over 15 years of experience treating various conditions including chronic pain, stress, anxiety, and more. Each 60-minute session is tailored to your specific needs and includes a comprehensive consultation.',
    urgencyLevel: 'low',
    validUntil: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    usedSlots: 1,
    businessPhone: '+61 8 8XXX XXXX',
    businessEmail: 'appointments@lotushealing.com.au',
    reviews: [],
  },
  6: {
    ...mockDeals[5],
    description:
      'Transform your skin with our advanced LED light therapy treatment. This non-invasive, painless treatment uses different wavelengths of light to target various skin concerns including anti-aging, acne, and inflammation. See visible results after just one session. Safe for all skin types.',
    urgencyLevel: 'high',
    validUntil: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    usedSlots: 2,
    businessPhone: '+61 3 9XXX XXXX',
    businessEmail: 'bookings@radiantskin.com.au',
    reviews: [],
  },
};

// 根据 ID 获取优惠详情
export function getDealById(id: number): DealDetail | undefined {
  return mockDealDetails[id];
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
  streetName: string;
  suburb: string;
  city: string;
  state: string;
  postalCode: string;
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
    streetName: 'Business Avenue',
    suburb: 'CBD',
    city: 'Sydney',
    state: 'NSW',
    postalCode: '2000',
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

export const mockRecentBookings = [
  {
    id: 1,
    customer: 'Sarah Johnson',
    service: 'Deep Tissue Massage',
    date: 'Today, 2:00 PM',
    status: 'confirmed' as const,
    amount: '$89',
  },
  {
    id: 2,
    customer: 'Mike Chen',
    service: 'Facial Treatment',
    date: 'Today, 4:30 PM',
    status: 'confirmed' as const,
    amount: '$65',
  },
  {
    id: 3,
    customer: 'Emma Wilson',
    service: 'Swedish Massage',
    date: 'Tomorrow, 10:00 AM',
    status: 'pending' as const,
    amount: '$75',
  },
  {
    id: 4,
    customer: 'David Lee',
    service: 'Hot Stone Massage',
    date: 'Tomorrow, 3:00 PM',
    status: 'confirmed' as const,
    amount: '$95',
  },
];

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
    details: 'Sarah Johnson booked Deep Tissue Massage',
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
