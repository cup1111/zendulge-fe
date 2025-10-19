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
    },
    company: {
      operateSites: (companyId: string) =>
        `/company/${companyId}/operate-sites`,
      users: (companyId: string) => `/company/${companyId}/users`,
      user: (companyId: string, userId: string) =>
        `/company/${companyId}/users/${userId}`,
      userRole: (companyId: string, userId: string) =>
        `/company/${companyId}/users/${userId}/role`,
      roles: (companyId: string) => `/company/${companyId}/roles`,
    },
  },
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string =>
  `${API_CONFIG.FULL_URL}${endpoint}`;

export default API_CONFIG;
