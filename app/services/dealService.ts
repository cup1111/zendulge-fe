import api from '../config/axios';

interface CategoryData {
  _id: string;
  name?: string;
  slug?: string;
  icon?: string;
}

export interface Deal {
  id: string;
  title: string;
  description: string;
  category: CategoryData;
  price: number;
  originalPrice?: number;
  discount?: number;
  duration: number;
  operatingSite: Array<{
    id: string;
    name: string;
    address: string;
  }>;
  startDate: string;
  endDate: string;
  maxBookings?: number;
  currentBookings: number;
  status: 'active' | 'inactive' | 'expired' | 'sold_out';
  images?: string[];
  tags?: string[];
  business: string;
  service: {
    id: string;
    name: string;
    category: string;
    basePrice: number;
    duration: number;
  };
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DealCreateRequest {
  title: string;
  description: string;
  category: string; // Slug string when creating/updating
  price: number;
  originalPrice?: number;
  duration: number;
  operatingSite: string[];
  startDate: string;
  endDate: string;
  maxBookings?: number;
  currentBookings?: number;
  status?: 'active' | 'inactive' | 'expired' | 'sold_out';
  images?: string[];
  tags?: string[];
  service: string;
}

export interface DealUpdateRequest {
  title?: string;
  description?: string;
  category?: string;
  price?: number;
  originalPrice?: number;
  duration?: number;
  operatingSite?: string[];
  startDate?: string;
  endDate?: string;
  maxBookings?: number;
  currentBookings?: number;
  status?: 'active' | 'inactive' | 'expired' | 'sold_out';
  images?: string[];
  tags?: string[];
  service?: string;
}

export interface DealStatusUpdateRequest {
  status: 'active' | 'inactive' | 'expired' | 'sold_out';
}

export interface DealApiResponse {
  success: boolean;
  message: string;
  data: Deal | Deal[];
}

interface RawDealApiResponse {
  _id?: string;
  id?: string;
  title?: string;
  description?: string;
  category?: CategoryData | string;
  price?: number;
  originalPrice?: number;
  discount?: number;
  duration?: number;
  operatingSite?: Array<{
    id?: string;
    _id?: string;
    name?: string;
    address?: string;
  }>;
  startDate?: string;
  endDate?: string;
  maxBookings?: number;
  currentBookings?: number;
  status?: 'active' | 'inactive' | 'expired' | 'sold_out';
  images?: string[];
  tags?: string[];
  business?: string;
  service?: {
    id?: string;
    _id?: string;
    name?: string;
    category?: string;
    basePrice?: number;
    duration?: number;
  };
  createdBy?: {
    id?: string;
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

// Helper to map deal data, extracting category from populated object
const mapDealCategory = (deal: RawDealApiResponse): Deal => {
  // Category is always a populated object from backend
  const categoryObj: CategoryData =
    (typeof deal.category === 'object' && deal.category) || {};
  return {
    ...deal,
    category: categoryObj,
  } as Deal;
};

export class DealService {
  static async getDeals(businessId: string): Promise<Deal[]> {
    const response = await api.get<DealApiResponse>(
      `/business/${businessId}/deals`
    );
    const deals = Array.isArray(response.data.data)
      ? response.data.data
      : [response.data.data];
    return deals.map(mapDealCategory);
  }

  static async getDealById(businessId: string, dealId: string): Promise<Deal> {
    const response = await api.get<DealApiResponse>(
      `/business/${businessId}/deals/${dealId}`
    );
    return mapDealCategory(response.data.data);
  }

  static async createDeal(
    businessId: string,
    dealData: DealCreateRequest
  ): Promise<Deal> {
    const response = await api.post<DealApiResponse>(
      `/business/${businessId}/deals`,
      dealData
    );
    return mapDealCategory(response.data.data);
  }

  static async updateDeal(
    businessId: string,
    dealId: string,
    dealData: DealUpdateRequest
  ): Promise<Deal> {
    const response = await api.patch<DealApiResponse>(
      `/business/${businessId}/deals/${dealId}`,
      dealData
    );
    return mapDealCategory(response.data.data);
  }

  static async deleteDeal(businessId: string, dealId: string): Promise<void> {
    await api.delete(`/business/${businessId}/deals/${dealId}`);
  }

  static async updateDealStatus(
    businessId: string,
    dealId: string,
    statusData: DealStatusUpdateRequest
  ): Promise<Deal> {
    const response = await api.patch<DealApiResponse>(
      `/business/${businessId}/deals/${dealId}/status`,
      statusData
    );
    return mapDealCategory(response.data.data);
  }
}

export default DealService;
