import api from '~/config/axios';

export interface TimeSlot {
  date: string; // ISO date string (YYYY-MM-DD)
  dateTime: string; // ISO datetime string for the start of the slot
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  available: boolean;
  siteId?: string; // Operating site ID if multiple sites
}

export interface PublicDeal {
  id: string;
  title: string;
  description?: string;
  category?: string;
  price?: number;
  originalPrice?: number;
  duration?: number;
  allDay?: boolean;
  startDate?: string;
  recurrenceType?:
    | 'none'
    | 'daily'
    | 'weekly'
    | 'weekdays'
    | 'monthly'
    | 'annually';
  discount?: number;
  business: { id: string; name: string; status: string };
  service: {
    id: string;
    name: string;
    category?: string;
    basePrice?: number;
    duration?: number;
  };
  sites?: Array<{ id: string; name: string; address: string }>;
  availableTimeSlots?: TimeSlot[];
}

export interface PublicDealsResponse {
  success: boolean;
  message: string;
  data: Array<{
    _id: string;
    title: string;
    description?: string;
    category?: string;
    price?: number;
    originalPrice?: number;
    duration?: number;
    allDay?: boolean;
    startDate?: string;
    recurrenceType?:
      | 'none'
      | 'daily'
      | 'weekly'
      | 'weekdays'
      | 'monthly'
      | 'annually';
    discount?: number;
    business: { _id: string; name: string; status: string };
    service: {
      _id: string;
      name: string;
      category?: string;
      basePrice?: number;
      duration?: number;
    };
    sites?: Array<{ _id: string; name: string; address: string }>;
    availableTimeSlots?: Array<{
      date: string;
      dateTime: string;
      startTime: string;
      endTime: string;
      available: boolean;
      siteId?: string;
    }>;
  }>;
}

const mapDeal = (raw: PublicDealsResponse['data'][number]): PublicDeal => {
  const { _id: id } = raw;
  const { _id: businessId } = raw.business;
  const { _id: serviceId } = raw.service;
  return {
    id,
    title: raw.title,
    description: raw.description,
    category: raw.category,
    price: raw.price,
    originalPrice: raw.originalPrice,
    duration: raw.duration,
    allDay: raw.allDay,
    startDate: raw.startDate,
    recurrenceType: raw.recurrenceType,
    discount: raw.discount,
    business: {
      id: businessId,
      name: raw.business.name,
      status: raw.business.status,
    },
    service: {
      id: serviceId,
      name: raw.service.name,
      category: raw.service.category,
      basePrice: raw.service.basePrice,
      duration: raw.service.duration,
    },
    sites: raw.sites?.map(({ _id: siteId, name, address }) => ({
      id: siteId,
      name,
      address,
    })),
    availableTimeSlots: raw.availableTimeSlots,
  };
};

export interface Location {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance?: number;
  business: {
    id: string;
    name: string;
  };
}

export interface RecommendResponse {
  success: boolean;
  message: string;
  type: 'locations' | 'deals';
  data: Location[] | PublicDeal[];
}

export default class PublicDealService {
  static async list(params?: {
    category?: string;
    limit?: number;
    skip?: number;
    latitude?: number;
    longitude?: number;
    radiusKm?: number;
    q?: string;
    title?: string;
  }): Promise<PublicDeal[]> {
    const response = await api.get<PublicDealsResponse>('/public/deals', {
      params,
    });
    return response.data.data.map(mapDeal);
  }

  static async getById(id: string): Promise<PublicDeal> {
    const response = await api.get<{
      success: boolean;
      data: PublicDealsResponse['data'][number];
    }>(`/public/deals/${id}`);
    return mapDeal(response.data.data);
  }

  static async recommend(params?: {
    latitude?: number;
    longitude?: number;
    radiusKm?: number;
    limit?: number;
    skip?: number;
    userLatitude?: number;
    userLongitude?: number;
  }): Promise<RecommendResponse> {
    const response = await api.get<RecommendResponse>('/public/recommend', {
      params,
    });

    // If it's deals, map them
    if (response.data.type === 'deals') {
      return {
        ...response.data,
        data: (response.data.data as unknown[]).map((raw: unknown) => {
          // Handle both mapped and unmapped deal formats
          if (raw.id) {
            return raw;
          }
          return mapDeal(raw);
        }),
      };
    }

    return response.data;
  }

  static async getLocationsForService(serviceId: string): Promise<Location[]> {
    const response = await api.get<{
      success: boolean;
      message: string;
      data: Location[];
    }>(`/public/services/${serviceId}/locations`);
    return response.data.data;
  }

  static async getDealsForLocation(siteId: string): Promise<PublicDeal[]> {
    const response = await api.get<PublicDealsResponse>(
      `/public/locations/${siteId}/deals`
    );
    return response.data.data.map(mapDeal);
  }
}
