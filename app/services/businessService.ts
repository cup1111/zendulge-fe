import { API_CONFIG } from '../config/api';
import api from '../config/axios';
import { BusinessStatus } from '../constants/businessStatus';

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
  status: BusinessStatus;
  createdAt?: string;
  updatedAt?: string;
}

interface RawCustomer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  active: boolean;
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
  warning?: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  active: boolean;
}

class BusinessService {
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
  ): Promise<BusinessInfo & { warning?: string }> {
    const response = await api.patch<ApiResponse<BusinessInfo>>(
      `/business/${businessId}`,
      businessData
    );
    return {
      ...response.data.data,
      warning: response.data.warning,
    };
  }

  /**
   * Get customers for a business
   */
  static async getCustomers(businessId: string): Promise<Customer[]> {
    const response = await api.get<ApiResponse<RawCustomer[]>>(
      API_CONFIG.endpoints.business.getCustomers(businessId)
    );

    return response.data.data.map(c => ({
      id: c._id, // ✅ now valid
      firstName: c.firstName,
      lastName: c.lastName,
      email: c.email,
      phoneNumber: c.phoneNumber,
      active: c.active,
    }));
  }
}

export default BusinessService;
