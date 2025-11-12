import { API_CONFIG } from '../config/api';
import api from '../config/axios';

// Types for profile management
export interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  userName?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  userName?: string;
  avatarIcon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ProfileApiResponse {
  success: boolean;
  message: string;
  user: UserProfile;
}

export class ProfileService {
  /**
   * Get current user profile
   */
  static async getProfile(): Promise<UserProfile> {
    const response = await api.get<ProfileApiResponse>(
      API_CONFIG.endpoints.auth.profile
    );
    return response.data.user;
  }

  /**
   * Update current user profile
   */
  static async updateProfile(
    profileData: ProfileUpdateRequest
  ): Promise<UserProfile> {
    const response = await api.patch<ApiResponse<{ user: UserProfile }>>(
      API_CONFIG.endpoints.auth.updateProfile,
      profileData
    );
    return response.data.data.user;
  }

  /**
   * Delete current user account
   */
  static async deleteAccount(): Promise<void> {
    await api.delete(API_CONFIG.endpoints.auth.profile);
  }
}

export default ProfileService;
