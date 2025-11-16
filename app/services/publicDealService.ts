import api from '~/config/axios';

export interface PublicDeal {
  id: string;
  title: string;
  description?: string;
  category?: string;
  price?: number;
  originalPrice?: number;
  duration?: number;
  startDate?: string;
  endDate?: string;
  discount?: number;
  business: { id: string; name: string; status: string };
  service: {
    id: string;
    name: string;
    category?: string;
    basePrice?: number;
    duration?: number;
  };
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
    startDate?: string;
    endDate?: string;
    discount?: number;
    business: { _id: string; name: string; status: string };
    service: {
      _id: string;
      name: string;
      category?: string;
      basePrice?: number;
      duration?: number;
    };
  }>;
}

const mapDeal = (raw: PublicDealsResponse['data'][number]): PublicDeal => {
  const { _id: id } = raw as any;
  const { _id: businessId } = raw.business as any;
  const { _id: serviceId } = raw.service as any;
  return {
    id,
    title: raw.title,
    description: raw.description,
    category: raw.category,
    price: raw.price,
    originalPrice: raw.originalPrice,
    duration: raw.duration,
    startDate: raw.startDate,
    endDate: raw.endDate,
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
  };
};

export default class PublicDealService {
  static async list(params?: {
    category?: string;
    limit?: number;
    skip?: number;
  }): Promise<PublicDeal[]> {
    const response = await api.get<PublicDealsResponse>('/public/deals', {
      params,
    });
    return response.data.data.map(mapDeal);
  }
}
