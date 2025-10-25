import api from '../config/axios';

export interface OperateSite {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  emailAddress: string;
  operatingHours: Record<string, any>;
  specialInstruction?: string;
  company: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OperateSiteApiResponse {
  success: boolean;
  message: string;
  data: {
    operateSites: OperateSite[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalSites: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export class OperateSiteService {
  static async getOperateSites(companyId: string): Promise<OperateSite[]> {
    const response = await api.get<OperateSiteApiResponse>(
      `/company/${companyId}/operate-sites`
    );
    return (response.data.data as any).operateSites as OperateSite[];
  }

  static async getOperateSiteById(
    companyId: string,
    siteId: string
  ): Promise<OperateSite> {
    const response = await api.get<{ success: boolean; data: OperateSite }>(
      `/company/${companyId}/operate-sites/${siteId}`
    );
    return response.data.data as OperateSite;
  }

  static async createOperateSite(
    companyId: string,
    siteData: any
  ): Promise<OperateSite> {
    const response = await api.post<{ success: boolean; data: OperateSite }>(
      `/company/${companyId}/operate-sites`,
      siteData
    );
    return response.data.data as OperateSite;
  }

  static async updateOperateSite(
    companyId: string,
    siteId: string,
    siteData: any
  ): Promise<OperateSite> {
    const response = await api.patch<{ success: boolean; data: OperateSite }>(
      `/company/${companyId}/operate-sites/${siteId}`,
      siteData
    );
    return response.data.data as OperateSite;
  }

  static async deleteOperateSite(
    companyId: string,
    siteId: string
  ): Promise<void> {
    await api.delete(`/company/${companyId}/operate-sites/${siteId}`);
  }

  static async toggleOperateSiteStatus(
    companyId: string,
    siteId: string
  ): Promise<OperateSite> {
    const response = await api.patch<{ success: boolean; data: OperateSite }>(
      `/company/${companyId}/operate-sites/${siteId}/toggle-status`
    );
    return response.data.data as OperateSite;
  }
}

export default OperateSiteService;
