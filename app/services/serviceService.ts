import api from '../config/axios';

export interface Service {
  id: string;
  name: string;
  category: string;
  duration: number; // Duration in minutes
  basePrice: number;
  description?: string;
  business:
    | string
    | {
        _id: string;
        name: string;
        logo?: string;
        description?: string;
      };
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
   * Get all services for a business
   */
  static async getServices(businessId: string): Promise<Service[]> {
    const response = await api.get<ServiceApiResponse>(
      `/business/${businessId}/services`
    );
    return response.data.data as Service[];
  }

  /**
   * Get a single service by ID
   */
  static async getServiceById(
    businessId: string,
    serviceId: string
  ): Promise<Service> {
    const response = await api.get<ServiceApiResponse>(
      `/business/${businessId}/services/${serviceId}`
    );
    return response.data.data as Service;
  }

  /**
   * Create a new service
   */
  static async createService(
    businessId: string,
    serviceData: ServiceCreateRequest
  ): Promise<Service> {
    const response = await api.post<ServiceApiResponse>(
      `/business/${businessId}/services`,
      serviceData
    );
    return response.data.data as Service;
  }

  /**
   * Update a service
   */
  static async updateService(
    businessId: string,
    serviceId: string,
    serviceData: ServiceUpdateRequest
  ): Promise<Service> {
    const response = await api.patch<ServiceApiResponse>(
      `/business/${businessId}/services/${serviceId}`,
      serviceData
    );
    return response.data.data as Service;
  }

  /**
   * Delete a service
   */
  static async deleteService(
    businessId: string,
    serviceId: string
  ): Promise<void> {
    await api.delete(`/business/${businessId}/services/${serviceId}`);
  }

  /**
   * Get public service details (no authentication required)
   */
  static async getPublicServiceById(serviceId: string): Promise<Service> {
    const response = await api.get<ServiceApiResponse>(
      `/public/services/${serviceId}`
    );
    const service = response.data.data as {
      _id?: { toString: () => string };
      id?: string;
      name: string;
      category: string;
      duration: number;
      basePrice: number;
      description?: string;
      business?:
        | {
            _id?: { toString: () => string };
            name?: string;
            logo?: string;
            description?: string;
          }
        | string;
      status: 'active' | 'inactive' | string;
      createdAt: string;
      updatedAt: string;
    };
    // Map _id to id and handle business object
    // eslint-disable-next-line no-underscore-dangle
    const mappedServiceId = service._id?.toString() ?? service.id ?? '';

    let businessValue: Service['business'];
    if (typeof service.business === 'string') {
      businessValue = service.business;
    } else if (service.business && typeof service.business === 'object') {
      // eslint-disable-next-line no-underscore-dangle
      const businessId = service.business._id?.toString() ?? '';
      businessValue = {
        _id: businessId,
        name: service.business.name ?? 'Unknown',
        logo: service.business.logo,
        description: service.business.description,
      };
    } else {
      businessValue = '';
    }

    return {
      id: mappedServiceId,
      name: service.name,
      category: service.category,
      duration: service.duration,
      basePrice: service.basePrice,
      description: service.description,
      business: businessValue,
      status: (service.status === 'active' || service.status === 'inactive'
        ? service.status
        : 'active') as 'active' | 'inactive',
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    };
  }
}

export default ServiceService;
