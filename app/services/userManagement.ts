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
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions?: string[];
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  jobTitle?: string;
  department?: string;
  location?: string;
  role: string; // Role ID
}

export interface UpdateUserRoleRequest {
  role: string; // Role ID
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export class UserManagementService {
  // Company-scoped operations (business owners/members)

  /**
   * Get all users in a company
   */
  static async getCompanyUsers(companyId: string): Promise<User[]> {
    const response = await api.get<User[]>(
      API_CONFIG.endpoints.company.users(companyId)
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
      API_CONFIG.endpoints.company.users(companyId),
      userData
    );
    return response.data;
  }

  /**
   * Update a user's role in a company
   */
  static async updateCompanyUserRole(
    companyId: string,
    userId: string,
    roleData: UpdateUserRoleRequest
  ): Promise<User> {
    const response = await api.patch<User>(
      API_CONFIG.endpoints.company.userRole(companyId, userId),
      roleData
    );
    return response.data;
  }

  /**
   * Remove a user's role in a company
   */
  static async removeCompanyUserRole(
    companyId: string,
    userId: string
  ): Promise<User> {
    const response = await api.patch<User>(
      API_CONFIG.endpoints.company.userRoleRemoval(companyId, userId)
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

  // Super admin operations (global)

  /**
   * Get all users across all companies (super admin only)
   */
  static async getAllUsers(): Promise<User[]> {
    const response = await api.get<User[]>(API_CONFIG.endpoints.admin.users);
    return response.data;
  }

  /**
   * Get all available roles (super admin only)
   */
  static async getAllRoles(): Promise<Role[]> {
    const response = await api.get<Role[]>(API_CONFIG.endpoints.admin.roles);
    return response.data;
  }
}

export default UserManagementService;
