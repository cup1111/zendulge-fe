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
  // Company-scoped operations (business owners/members)

  /**
   * Get all users in a company
   */
  static async getCompanyUsers(companyId: string): Promise<User[]> {
    const response = await api.get<User[]>(
      API_CONFIG.endpoints.company.getUsers(companyId)
    );
    return response.data;
  }

  /**
   * Get a specific user in a company
   */
  static async getCompanyUser(
    companyId: string,
    userId: string
  ): Promise<User> {
    const response = await api.get<User>(
      API_CONFIG.endpoints.company.user(companyId, userId)
    );
    return response.data;
  }

  /**
   * Create a new user in a company
   */
  static async createCompanyUser(
    companyId: string,
    userData: CreateUserRequest
  ): Promise<User> {
    const response = await api.post<User>(
      API_CONFIG.endpoints.company.inviteUser(companyId),
      userData
    );
    return response.data;
  }

  /**
   * Update a user's role in a company
   */
  static async updateCompanyBusinessUserRole(
    companyId: string,
    userId: string,
    roleData: UpdateBusinessUserRoleRequest
  ): Promise<User> {
    const response = await api.patch<User>(
      API_CONFIG.endpoints.company.userRole(companyId, userId),
      roleData
    );
    return response.data;
  }

  /**
   * Update a user's information in a company
   */
  static async updateCompanyUser(
    companyId: string,
    userId: string,
    userData: UpdateUserRequest
  ): Promise<User> {
    const response = await api.patch<User>(
      API_CONFIG.endpoints.company.user(companyId, userId),
      userData
    );
    return response.data;
  }

  /**
   * Delete a user from a company
   */
  static async deleteCompanyUser(
    companyId: string,
    userId: string
  ): Promise<void> {
    await api.delete(API_CONFIG.endpoints.company.user(companyId, userId));
  }

  /**
   * Get all available roles for a company
   */
  static async getCompanyRoles(companyId: string): Promise<Role[]> {
    const response = await api.get<ApiResponse<Role[]>>(
      API_CONFIG.endpoints.company.roles(companyId)
    );
    return response.data.data;
  }
}

export default UserManagementService;
