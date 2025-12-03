import axiosInstance from '~/config/axios';

export interface Appointment {
  id: string;
  customer: {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
  };
  business: {
    id: string;
    name: string;
    logo?: string;
  };
  deal: {
    id: string;
    title: string;
    price: number;
    duration: number;
  };
  service: {
    id: string;
    name: string;
    category: string;
  };
  operatingSite: {
    id: string;
    name: string;
    address: string;
  };
  assignee?: {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  appointmentDate: string; // ISO date string
  duration: number; // Duration in minutes
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentRequest {
  dealId: string;
  operatingSiteId: string;
  appointmentDate: string; // ISO date string
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  notes?: string;
}

export interface AppointmentListResponse {
  success: boolean;
  message: string;
  data: Appointment[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AppointmentResponse {
  success: boolean;
  message: string;
  data: Appointment;
}

class AppointmentService {
  /**
   * Create a new appointment
   */
  static async create(request: CreateAppointmentRequest): Promise<Appointment> {
    const response = await axiosInstance.post<AppointmentResponse>(
      '/appointments',
      request
    );
    return response.data.data;
  }

  /**
   * Get list of appointments with optional filters
   */
  static async list(params?: {
    businessId?: string;
    customerId?: string;
    assigneeId?: string;
    operatingSiteId?: string;
    dealId?: string;
    status?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<AppointmentListResponse> {
    const response = await axiosInstance.get<AppointmentListResponse>(
      '/appointments',
      { params }
    );
    return response.data;
  }

  /**
   * Get appointment by ID
   */
  static async getById(appointmentId: string): Promise<Appointment> {
    const response = await axiosInstance.get<AppointmentResponse>(
      `/appointments/${appointmentId}`
    );
    return response.data.data;
  }

  /**
   * Update appointment status
   */
  static async updateStatus(
    appointmentId: string,
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
  ): Promise<Appointment> {
    const response = await axiosInstance.patch<AppointmentResponse>(
      `/appointments/${appointmentId}/status`,
      { status }
    );
    return response.data.data;
  }

  /**
   * Delete appointment
   */
  static async delete(appointmentId: string): Promise<void> {
    await axiosInstance.delete(`/appointments/${appointmentId}`);
  }
}

export default AppointmentService;
