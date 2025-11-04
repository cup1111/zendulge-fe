import api from '../config/axios';

export interface Deal {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  duration: number;
  operatingSite: Array<{
    id: string;
    name: string;
    address: string;
  }>;
  availability: {
    startDate: string;
    endDate: string;
    maxBookings?: number;
    currentBookings: number;
  };
  status: 'active' | 'inactive' | 'expired' | 'sold_out';
  images?: string[];
  tags?: string[];
  company: string;
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
  category: string;
  price: number;
  originalPrice?: number;
  duration: number;
  operatingSite: string[];
  availability: {
    startDate: string;
    endDate: string;
    maxBookings?: number;
  };
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
  availability?: {
    startDate?: string;
    endDate?: string;
    maxBookings?: number;
  };
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

export class DealService {
  static async getDeals(companyId: string): Promise<Deal[]> {
    const response = await api.get<DealApiResponse>(
      `/company/${companyId}/deals`
    );
    return response.data.data as Deal[];
  }

  static async getDealById(companyId: string, dealId: string): Promise<Deal> {
    const response = await api.get<DealApiResponse>(
      `/company/${companyId}/deals/${dealId}`
    );
    return response.data.data as Deal;
  }

  static async createDeal(
    companyId: string,
    dealData: DealCreateRequest
  ): Promise<Deal> {
    const response = await api.post<DealApiResponse>(
      `/company/${companyId}/deals`,
      dealData
    );
    return response.data.data as Deal;
  }

  static async updateDeal(
    companyId: string,
    dealId: string,
    dealData: DealUpdateRequest
  ): Promise<Deal> {
    const response = await api.patch<DealApiResponse>(
      `/company/${companyId}/deals/${dealId}`,
      dealData
    );
    return response.data.data as Deal;
  }

  static async deleteDeal(companyId: string, dealId: string): Promise<void> {
    await api.delete(`/company/${companyId}/deals/${dealId}`);
  }

  static async updateDealStatus(
    companyId: string,
    dealId: string,
    statusData: DealStatusUpdateRequest
  ): Promise<Deal> {
    const response = await api.patch<DealApiResponse>(
      `/company/${companyId}/deals/${dealId}/status`,
      statusData
    );
    return response.data.data as Deal;
  }
}

export default DealService;
