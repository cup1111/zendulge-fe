import api from '../config/axios';

export interface Service {
  id: string;
  name: string;
  category: string;
  duration: number; // Duration in minutes
  basePrice: number;
  description?: string;
  company: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCreateRequest {
  name: string;
  category: string;
  duration: number;
  basePrice: number;
  description?: string;
  status?: 'active' | 'inactive';
}

export interface ServiceUpdateRequest {
  name?: string;
  category?: string;
  duration?: number;
  basePrice?: number;
  description?: string;
  status?: 'active' | 'inactive';
}

export interface ServiceApiResponse {
  success: boolean;
  message: string;
  data: Service | Service[];
}

export class ServiceService {
  /**
   * Get all services for a company
   */
  static async getServices(companyId: string): Promise<Service[]> {
    const response = await api.get<ServiceApiResponse>(
      `/company/${companyId}/services`
    );
    return response.data.data as Service[];
  }

  /**
   * Get a single service by ID
   */
  static async getServiceById(
    companyId: string,
    serviceId: string
  ): Promise<Service> {
    const response = await api.get<ServiceApiResponse>(
      `/company/${companyId}/services/${serviceId}`
    );
    return response.data.data as Service;
  }

  /**
   * Create a new service
   */
  static async createService(
    companyId: string,
    serviceData: ServiceCreateRequest
  ): Promise<Service> {
    const response = await api.post<ServiceApiResponse>(
      `/company/${companyId}/services`,
      serviceData
    );
    return response.data.data as Service;
  }

  /**
   * Update a service
   */
  static async updateService(
    companyId: string,
    serviceId: string,
    serviceData: ServiceUpdateRequest
  ): Promise<Service> {
    const response = await api.patch<ServiceApiResponse>(
      `/company/${companyId}/services/${serviceId}`,
      serviceData
    );
    return response.data.data as Service;
  }

  /**
   * Delete a service
   */
  static async deleteService(
    companyId: string,
    serviceId: string
  ): Promise<void> {
    await api.delete(`/company/${companyId}/services/${serviceId}`);
  }
}

export default ServiceService;
