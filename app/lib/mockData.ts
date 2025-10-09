
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
      businessName: "Serenity Spa & Wellness",
      serviceName: "90-Minute Aromatherapy Massage",
      category: "Massage",
      description: "Indulge in a luxurious 90-minute aromatherapy massage using premium essential oils. Perfect for stress relief and deep relaxation.",
      originalPrice: 180,
      discountedPrice: 89,
      discountPercentage: 51,
      startTime: "14:00",
      endTime: "16:00",
      availableSlots: 3,
      imageUrl: "/assets/massage-1.jpg",
      address: "123 Tranquility Lane, Melbourne VIC 3000",
      latitude: -37.8136,
      longitude: 144.9631,
      rating: 4.8,
      reviewCount: 127
    },
    {
      id: 2,
      businessName: "Zen Garden Beauty",
      serviceName: "Deluxe Facial Treatment",
      category: "Beauty",
      description: "Experience our signature facial treatment with organic products. Includes deep cleansing, exfoliation, mask, and moisturizer.",
      originalPrice: 150,
      discountedPrice: 75,
      discountPercentage: 50,
      startTime: "10:00",
      endTime: "12:00",
      availableSlots: 2,
      imageUrl: "/assets/beauty-salon.jpg",
      address: "456 Beauty Boulevard, Sydney NSW 2000",
      latitude: -33.8688,
      longitude: 151.2093,
      rating: 4.9,
      reviewCount: 203
    },
    {
      id: 3,
      businessName: "Aqua Bliss Spa",
      serviceName: "Hydrotherapy Session",
      category: "Spa",
      description: "60-minute hydrotherapy session in our state-of-the-art facilities. Includes sauna, steam room, and relaxation pool access.",
      originalPrice: 120,
      discountedPrice: 60,
      discountPercentage: 50,
      startTime: "09:00",
      endTime: "11:00",
      availableSlots: 5,
      imageUrl: "/assets/sauna.avif",
      address: "789 Wellness Way, Brisbane QLD 4000",
      latitude: -27.4698,
      longitude: 153.0251,
      rating: 4.7,
      reviewCount: 89
    },
    {
      id: 4,
      businessName: "Pure Balance Yoga",
      serviceName: "Morning Yoga Class",
      category: "Fitness",
      description: "Start your day with a rejuvenating 75-minute yoga session. All levels welcome.",
      originalPrice: 35,
      discountedPrice: 20,
      discountPercentage: 43,
      startTime: "07:00",
      endTime: "08:30",
      availableSlots: 8,
      address: "321 Harmony Street, Perth WA 6000",
      latitude: -31.9505,
      longitude: 115.8605,
      rating: 4.6,
      reviewCount: 156
    },
    {
      id: 5,
      businessName: "Lotus Healing Center",
      serviceName: "Acupuncture Session",
      category: "Alternative",
      description: "Traditional Chinese acupuncture treatment for pain relief and wellness. 60-minute session with licensed practitioner.",
      originalPrice: 95,
      discountedPrice: 55,
      discountPercentage: 42,
      startTime: "13:00",
      endTime: "15:00",
      availableSlots: 4,
      address: "567 Eastern Avenue, Adelaide SA 5000",
      latitude: -34.9285,
      longitude: 138.6007,
      rating: 4.8,
      reviewCount: 94
    },
    {
      id: 6,
      businessName: "Radiant Skin Clinic",
      serviceName: "LED Light Therapy",
      category: "Beauty",
      description: "Advanced LED light therapy for anti-aging and skin rejuvenation. Non-invasive treatment with visible results.",
      originalPrice: 110,
      discountedPrice: 65,
      discountPercentage: 41,
      startTime: "11:00",
      endTime: "13:00",
      availableSlots: 3,
      address: "890 Glow Street, Melbourne VIC 3000",
      latitude: -37.8140,
      longitude: 144.9633,
      rating: 4.7,
      reviewCount: 72
    }
  ];
  
  export const categories = [
    { id: "massage", name: "Massage", icon: "💆", count: 45 },
    { id: "beauty", name: "Beauty", icon: "💅", count: 38 },
    { id: "spa", name: "Spa", icon: "🛁", count: 32 },
    { id: "fitness", name: "Fitness", icon: "🏃", count: 28 },
    { id: "alternative", name: "Alternative", icon: "🌿", count: 24 },
    { id: "salon", name: "Hair Salon", icon: "💇", count: 19 }
  ];
  
  export const recentBookings = [
    {
      id: 101,
      dealId: 1,
      userName: "Sarah M.",
      businessName: "Serenity Spa & Wellness",
      serviceName: "Aromatherapy Massage",
      bookedAt: "2 hours ago",
      avatar: "SM"
    },
    {
      id: 102,
      dealId: 2,
      userName: "James L.",
      businessName: "Zen Garden Beauty",
      serviceName: "Deluxe Facial",
      bookedAt: "3 hours ago",
      avatar: "JL"
    },
    {
      id: 103,
      dealId: 3,
      userName: "Emma W.",
      businessName: "Aqua Bliss Spa",
      serviceName: "Hydrotherapy",
      bookedAt: "5 hours ago",
      avatar: "EW"
    }
  ];