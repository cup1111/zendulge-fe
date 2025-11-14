import { API_CONFIG } from '../config/api';
import api from '../config/axios';

// Types for user management
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  jobTitle?: string;
  department?: string;
  location?: string;
  role?: Role;
  active: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  operateSites?: OperateSite[]; // Added for frontend store access
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions?: string[];
}

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  jobTitle?: string;
  department?: string;
  location?: string;
  role: string; // Role ID
  operateSiteIds?: string[]; // Array of operate site IDs the user has access to
}

export interface UpdateBusinessUserRoleRequest {
  role: string; // Role ID
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  jobTitle?: string;
  department?: string;
  location?: string;
  role?: string; // Role ID
  operateSiteIds?: string[]; // Array of operate site IDs the user has access to
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface OperateSite {
  id: string;
  name: string;
  address: string;
  isActive: boolean;
  members?: { id: string }[]; // Add members for user assignment
}

export class UserManagementService {
  // Business-scoped operations (business owners/members)

  /**
   * Get all users in a business
   */
  static async getBusinessUsers(businessId: string): Promise<User[]> {
    const response = await api.get<User[]>(
      API_CONFIG.endpoints.business.getUsers(businessId)
    );
    return response.data;
  }

  /**
   * Get a specific user in a business
   */
  static async getBusinessUser(
    businessId: string,
    userId: string
  ): Promise<User> {
    const response = await api.get<User>(
      API_CONFIG.endpoints.business.user(businessId, userId)
    );
    return response.data;
  }

  /**
   * Create a new user in a business
   */
  static async createBusinessUser(
    businessId: string,
    userData: CreateUserRequest
  ): Promise<User> {
    const response = await api.post<User>(
      API_CONFIG.endpoints.business.inviteUser(businessId),
      userData
    );
    return response.data;
  }

  /**
   * Update a user's role in a business
   */
  static async updateBusinessUserRole(
    businessId: string,
    userId: string,
    roleData: UpdateBusinessUserRoleRequest
  ): Promise<User> {
    const response = await api.patch<User>(
      API_CONFIG.endpoints.business.userRole(businessId, userId),
      roleData
    );
    return response.data;
  }

  /**
   * Update a user's information in a business
   */
  static async updateBusinessUser(
    businessId: string,
    userId: string,
    userData: UpdateUserRequest
  ): Promise<User> {
    const response = await api.patch<User>(
      API_CONFIG.endpoints.business.user(businessId, userId),
      userData
    );
    return response.data;
  }

  /**
   * Delete a user from a business
   */
  static async deleteBusinessUser(
    businessId: string,
    userId: string
  ): Promise<void> {
    await api.delete(API_CONFIG.endpoints.business.user(businessId, userId));
  }

  /**
   * Get all available roles for a business
   */
  static async getBusinessRoles(businessId: string): Promise<Role[]> {
    const response = await api.get<ApiResponse<Role[]>>(
      API_CONFIG.endpoints.business.roles(businessId)
    );
    return response.data.data;
  }
}

export default UserManagementService;
