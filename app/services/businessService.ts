import { API_CONFIG } from '../config/api';
import api from '../config/axios';

// Types for business management
export interface BusinessInfo {
  id: string;
  name: string;
  email: string;
  description?: string;
  businessAddress: {
    street: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  contact: string;
  abn?: string;
  website?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  logo?: string;
  owner: string;
  members?: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  }>;
  customers?: Customer[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BusinessUpdateRequest {
  name?: string;
  email?: string;
  description?: string;
  businessAddress?: {
    street?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  abn?: string;
  website?: string;
  facebookUrl?: string;
  twitterUrl?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  active: boolean;
}

export class BusinessService {
  /**
   * Get business information for the current user's business
   */
  static async getBusinessInfo(businessId: string): Promise<BusinessInfo> {
    const response = await api.get<ApiResponse<BusinessInfo>>(
      `/business/${businessId}`
    );
    return response.data.data;
  }

  /**
   * Update business information
   */
  static async updateBusinessInfo(
    businessId: string,
    businessData: BusinessUpdateRequest
  ): Promise<BusinessInfo> {
    const response = await api.patch<ApiResponse<BusinessInfo>>(
      `/business/${businessId}`,
      businessData
    );
    return response.data.data;
  }

  /**
   * Get customers for a business
   */
  static async getCustomers(businessId: string): Promise<Customer[]> {
    const response = await api.get<ApiResponse<Customer[]>>(
      API_CONFIG.endpoints.business.getCustomers(businessId)
    );
    return response.data.data;
  }
}

export default BusinessService;
