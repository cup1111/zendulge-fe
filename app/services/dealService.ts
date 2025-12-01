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
  sections: number;
  operatingSite: Array<{
    id: string;
    name: string;
    address: string;
  }>;
  allDay: boolean;
  startDate: string;
  recurrenceType:
    | 'none'
    | 'daily'
    | 'weekly'
    | 'weekdays'
    | 'monthly'
    | 'annually';
  currentBookings: number;
  assignee?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
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
  price: number;
  originalPrice?: number;
  duration: number;
  sections: number;
  operatingSite: string[];
  allDay: boolean;
  startDate: string;
  startTime?: string;
  recurrenceType:
    | 'none'
    | 'daily'
    | 'weekly'
    | 'weekdays'
    | 'monthly'
    | 'annually';
  currentBookings?: number;
  assignee?: string;
  status?: 'active' | 'inactive' | 'expired' | 'sold_out';
  images?: string[];
  tags?: string[];
  service: string;
}

export interface DealUpdateRequest {
  title?: string;
  description?: string;
  price?: number;
  originalPrice?: number;
  duration?: number;
  sections?: number;
  operatingSite?: string[];
  allDay?: boolean;
  startDate?: string;
  startTime?: string;
  recurrenceType?:
    | 'none'
    | 'daily'
    | 'weekly'
    | 'weekdays'
    | 'monthly'
    | 'annually';
  currentBookings?: number;
  assignee?: string;
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
  data: RawDealApiResponse | RawDealApiResponse[];
}

interface RawCategoryApiResponse {
  // eslint-disable-next-line no-underscore-dangle
  _id?: string;
  id?: string;
  name?: string;
  slug?: string;
  icon?: string;
}

interface RawDealApiResponse {
  _id?: string;
  id?: string;
  title?: string;
  description?: string;
  category?: RawCategoryApiResponse | string;
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
  allDay?: boolean;
  startDate?: string;
  recurrenceType?:
    | 'none'
    | 'daily'
    | 'weekly'
    | 'weekdays'
    | 'monthly'
    | 'annually';
  currentBookings?: number;
  assignee?: string;
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

const mapDealCategory = (deal: RawDealApiResponse): Deal => {
  let categoryObj: CategoryData = { _id: '', name: '', slug: '', icon: '' };

  if (
    deal.category &&
    typeof deal.category === 'object' &&
    deal.category !== null
  ) {
    const rawCategory = deal.category as RawCategoryApiResponse;
    categoryObj = {
      // eslint-disable-next-line no-underscore-dangle
      _id: rawCategory._id ?? rawCategory.id ?? '',
      name: rawCategory.name ?? '',
      slug: rawCategory.slug ?? '',
      icon: rawCategory.icon ?? '',
    };
  } else if (deal.service?.category) {
    categoryObj = {
      _id: '',
      name: deal.service.category,
      slug: deal.service.category,
      icon: '',
    };
  }

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
    const data = Array.isArray(response.data.data)
      ? response.data.data[0]
      : response.data.data;
    return mapDealCategory(data);
  }

  static async createDeal(
    businessId: string,
    dealData: DealCreateRequest
  ): Promise<Deal> {
    const response = await api.post<DealApiResponse>(
      `/business/${businessId}/deals`,
      dealData
    );
    const data = Array.isArray(response.data.data)
      ? response.data.data[0]
      : response.data.data;
    return mapDealCategory(data);
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
    const data = Array.isArray(response.data.data)
      ? response.data.data[0]
      : response.data.data;
    return mapDealCategory(data);
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
    const data = Array.isArray(response.data.data)
      ? response.data.data[0]
      : response.data.data;
    return mapDealCategory(data);
  }
}

export default DealService;
