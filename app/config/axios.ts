import axios from 'axios';

import { API_CONFIG } from './api';

// Helper function to get auth token from localStorage
const getAuthToken = (): string | null =>
  localStorage.getItem('accessToken') ?? localStorage.getItem('token');

// Create the global axios instance
const zendulge = axios.create({
  baseURL: API_CONFIG.FULL_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authentication token
zendulge.interceptors.request.use(
  config => {
    const token = getAuthToken();
    if (token) {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor to handle common errors
zendulge.interceptors.response.use(
  response => response,
  error => {
    // Handle common HTTP errors
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login or refresh token
      // eslint-disable-next-line no-console
      console.warn('Authentication failed - token may be expired');
      // You could dispatch a logout action here or redirect to login
    } else if (error.response?.status === 403) {
      // eslint-disable-next-line no-console
      console.warn('Access forbidden - insufficient permissions');
    } else if (error.response?.status >= 500) {
      // eslint-disable-next-line no-console
      console.error('Server error occurred');
    }

    return Promise.reject(error);
  }
);

export default zendulge;

// Export the instance with a named export as well for flexibility
export { zendulge };

// Export types for better TypeScript support
export type ZendulgeAxiosInstance = typeof zendulge;
