// API Configuration
// Centralized API base URL configuration for the entire application

export const API_CONFIG = {
  // Base URL for the backend API
  BASE_URL: process.env.NODE_ENV === "production" 
    ? "https://zendulge-be-production.up.railway.app"
    : "http://localhost:8000",
  
  // API version prefix
  API_PREFIX: "/api/v1",
  
  // Full API base URL
  get FULL_URL() {
    return `${this.BASE_URL}${this.API_PREFIX}`;
  },
  
  // Helper methods for common endpoints
  endpoints: {
    auth: {
      login: "/login",
      logout: "/logout",
      refresh: "/refresh-token",
      profile: "/me",
    },
    company: {
      operateSites: (companyId: string) => `/company/${companyId}/operate-sites`,
      users: (companyId: string) => `/company/${companyId}/users`,
    },
  },
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.FULL_URL}${endpoint}`;
};

export default API_CONFIG;
