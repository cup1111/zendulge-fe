import api from '../config/axios';

export interface OperatingHourDay {
  isClosed?: boolean;
  open?: string;
  close?: string;
}

export interface OperateSite {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  emailAddress: string;
  operatingHours: Record<string, OperatingHourDay>;
  specialInstruction?: string;
  business: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OperateSiteCreateRequest {
  name: string;
  address: string;
  phoneNumber: string;
  emailAddress: string;
  operatingHours?: Record<string, OperatingHourDay>;
  specialInstruction?: string;
  latitude: number;
  longitude: number;
  isActive?: boolean;
}

export interface OperateSiteUpdateRequest {
  name?: string;
  address?: string;
  phoneNumber?: string;
  emailAddress?: string;
  operatingHours?: Record<string, OperatingHourDay>;
  specialInstruction?: string;
  latitude?: number;
  longitude?: number;
  isActive?: boolean;
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
  static async getOperateSites(businessId: string): Promise<OperateSite[]> {
    const response = await api.get<OperateSiteApiResponse>(
      `/business/${businessId}/operate-sites`
    );
    return response.data.data.operateSites;
  }

  static async getOperateSiteById(
    businessId: string,
    siteId: string
  ): Promise<OperateSite> {
    const response = await api.get<{ success: boolean; data: OperateSite }>(
      `/business/${businessId}/operate-sites/${siteId}`
    );
    return response.data.data as OperateSite;
  }

  static async createOperateSite(
    businessId: string,
    siteData: OperateSiteCreateRequest
  ): Promise<OperateSite> {
    const response = await api.post<{ success: boolean; data: OperateSite }>(
      `/business/${businessId}/operate-sites`,
      siteData
    );
    return response.data.data;
  }

  static async updateOperateSite(
    businessId: string,
    siteId: string,
    siteData: OperateSiteUpdateRequest
  ): Promise<OperateSite> {
    const response = await api.patch<{ success: boolean; data: OperateSite }>(
      `/business/${businessId}/operate-sites/${siteId}`,
      siteData
    );
    return response.data.data as OperateSite;
  }

  static async deleteOperateSite(
    businessId: string,
    siteId: string
  ): Promise<void> {
    await api.delete(`/business/${businessId}/operate-sites/${siteId}`);
  }

  static async toggleOperateSiteStatus(
    businessId: string,
    siteId: string
  ): Promise<OperateSite> {
    const response = await api.patch<{ success: boolean; data: OperateSite }>(
      `/business/${businessId}/operate-sites/${siteId}/toggle-status`
    );
    return response.data.data as OperateSite;
  }
}

export default OperateSiteService;
