// API Configuration
// Centralized API base URL configuration for the entire application

export const API_CONFIG = {
  // Base URL for the backend API (from environment variable or fallback)
  BASE_URL:
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.MODE === 'production'
      ? 'https://zendulge-be-production.up.railway.app'
      : 'http://localhost:8000'),

  // API version prefix (from environment variable or fallback)
  API_PREFIX: import.meta.env.VITE_API_PREFIX || '/api/v1',

  // Full API base URL
  get FULL_URL() {
    return `${this.BASE_URL}${this.API_PREFIX}`;
  },

  // Helper methods for common endpoints
  endpoints: {
    auth: {
      login: '/login',
      logout: '/logout',
      refresh: '/refresh-token',
      profile: '/me',
      updateProfile: '/me',
      role: (businessId: string) => `/business/${businessId}/me/role`,
    },
    business: {
      operateSites: (businessId: string) =>
        `/business/${businessId}/operate-sites`,
      inviteUser: (businessId: string) => `/business/${businessId}/invite`,
      getUsers: (businessId: string) => `/business/${businessId}/users`,
      getCustomers: (businessId: string) => `/business/${businessId}/customers`,
      user: (businessId: string, userId: string) =>
        `/business/${businessId}/users/${userId}`,
      userRole: (businessId: string, userId: string) =>
        `/business/${businessId}/users/${userId}/role`,
      roles: (businessId: string) => `/business/${businessId}/roles`,
      uploadImage: 'Upload',
    },
  },
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string =>
  `${API_CONFIG.FULL_URL}${endpoint}`;

export default API_CONFIG;
