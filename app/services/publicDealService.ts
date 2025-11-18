import api from '~/config/axios';

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
  endDate?: string;
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
    endDate?: string;
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
    endDate: raw.endDate,
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
  };
};

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
}
