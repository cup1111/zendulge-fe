import api from '../config/axios';

// Types for company management
export interface CompanyInfo {
  id: string;
  name: string;
  email: string;
  description?: string;
  serviceCategory: string;
  businessAddress: {
    street: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  abn?: string;
  website?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  logo?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyUpdateRequest {
  name?: string;
  email?: string;
  description?: string;
  serviceCategory?: string;
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

export class CompanyService {
  /**
   * Get company information for the current user's company
   */
  static async getCompanyInfo(companyId: string): Promise<CompanyInfo> {
    const response = await api.get<ApiResponse<CompanyInfo>>(
      `/company/${companyId}`
    );
    return response.data.data;
  }

  /**
   * Update company information
   */
  static async updateCompanyInfo(
    companyId: string,
    companyData: CompanyUpdateRequest
  ): Promise<CompanyInfo> {
    const response = await api.patch<ApiResponse<CompanyInfo>>(
      `/company/${companyId}`,
      companyData
    );
    return response.data.data;
  }
}

export default CompanyService;
