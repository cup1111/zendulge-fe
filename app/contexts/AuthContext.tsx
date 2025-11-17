import type { AxiosError } from 'axios';
import type { ReactNode } from 'react';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router';

import { API_CONFIG } from '~/config/api';
import zendulgeAxios from '~/config/axios';

import type { BusinessUserRole } from '../constants/enums';

interface Business {
  id: string;
  name: string;
}

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  userName?: string;
  avatarIcon?: string;
  role?: { slug: BusinessUserRole; name: string; id: string };
  businesses: Business[];
}

interface AuthContextType {
  user: User | null;
  currentBusiness: Business | null;
  businesses: Business[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  setCurrentBusiness: (business: Business) => void;
  logout: () => void;
  errorMessage: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

interface ServerErrorResponse {
  success: boolean;
  statusCode: number;
  message: string;
  errors?: { field: string; message: string }[];
}

// Decodes a JWT token and extracts user information from the payload
// JWT tokens consist of three parts separated by dots: header.payload.signature
// This function extracts the payload (second part), converts base64url to base64,
// decodes it, and parses the JSON to extract user data
// Returns null if the token is invalid or cannot be decoded
function decodeJWTTokenToUser(token: string): User | null {
  try {
    // Extract the payload part (second part of the JWT)
    const base64Url = token.split('.')[1];
    // Convert base64url to base64 (replace URL-safe characters)
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    // Decode base64 and convert to URI component format
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    );

    // Parse JSON and extract user data
    const payload = JSON.parse(jsonPayload);

    return {
      id: payload.id,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      userName: payload.userName,
      avatarIcon: payload.avatarIcon,
      businesses: payload.businesses || [],
    };
  } catch {
    return null;
  }
}

// Retrieves the current business from localStorage or defaults to the first business
// Priority: 1) Check localStorage for saved 'currentBusiness'
//           2) If not found, use the first business from user's businesses array
//           3) Save the selected business to localStorage for future use
//           4) Return null if no businesses are available
function getCurrentBusinessFromStorage(userData: User): Business | null {
  // Try to load saved business from localStorage
  const savedCurrentBusiness = localStorage.getItem('currentBusiness');
  if (savedCurrentBusiness) {
    try {
      return JSON.parse(savedCurrentBusiness);
    } catch {
      // Ignore parse error, fallback to first business
    }
  }
  // Fallback to first business if available
  if (userData.businesses && userData.businesses.length > 0) {
    const [firstBusiness] = userData.businesses;
    // Save to localStorage for future use
    localStorage.setItem('currentBusiness', JSON.stringify(firstBusiness));
    return firstBusiness;
  }
  return null;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUserState] = useState<User | null>(null);
  const [currentBusiness, setCurrentBusinessState] = useState<Business | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Clears the current error message from the auth context
  const clearErrorMessage = () => setErrorMessage(null);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    setUserState(null);
    setCurrentBusinessState(null);
    localStorage.removeItem('user');
    localStorage.removeItem('currentBusiness');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('token');
    navigate('/');
  }, [navigate]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        if (!email) {
          setErrorMessage('Email is missing.'); // this will change the errorMessage, then isAuthenticated, if a user user enter wrong eamil, maybe he will not see the errorMessage
          return;
        }
        if (!password) {
          setErrorMessage('Password is missing');
          return;
        }
        const response = await zendulgeAxios.post(
          API_CONFIG.endpoints.auth.login,
          { email, password }
        );
        if (!response?.data) return;

        const { data } = response;
        const { accessToken } = data.data;

        // Store token
        localStorage.setItem('accessToken', accessToken);

        // Decode user data from token
        const userData = decodeJWTTokenToUser(accessToken);
        if (!userData) {
          throw new Error('Invalid token received');
        }

        // Set user state
        setUserState(userData);
        localStorage.setItem('user', JSON.stringify(userData));

        // Auto-select first business if available
        if (userData.businesses && userData.businesses.length > 0) {
          const firstBusiness = userData.businesses[0];
          setCurrentBusinessState(firstBusiness);
          localStorage.setItem(
            'currentBusiness',
            JSON.stringify(firstBusiness)
          );
          clearErrorMessage();
          navigate('/business-management');
        } else {
          navigate('/');
        }
      } catch (error: unknown) {
        const axiosError = error as AxiosError<ServerErrorResponse>;
        const data = axiosError.response?.data;
        // if no data in response, means something is worong
        if (!data) {
          setErrorMessage('Something went wrong. Please try again.');
          return;
        }
        // if not activated, shows the problem
        if (data.message?.includes('Account not activated')) {
          setErrorMessage(
            'Account not activated. Please check your email for activation instructions.'
          );
          return;
        }
        // if multiple error message, just show the first one
        if (data.statusCode === 422 && data.errors && data.errors.length > 0) {
          setErrorMessage(data.errors[0].message);
          return;
        }
        // if invalid email or password, shows the case
        if (data.message.includes('Invalid email or password')) {
          setErrorMessage('Invalid email or password');
          return;
        }
        setErrorMessage(
          data.message || 'Something went wrong. Please try again.'
        );
      }
    },
    [navigate]
  );

  const setCurrentBusiness = (business: Business) => {
    setCurrentBusinessState(business);
    localStorage.setItem('currentBusiness', JSON.stringify(business));
  };

  // Check for existing authentication on init
  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        const token =
          localStorage.getItem('accessToken') ?? localStorage.getItem('token');

        if (!token) {
          setIsLoading(false);
          return;
        }

        // Check if token is expired
        const userData = decodeJWTTokenToUser(token);
        if (!userData) {
          logout();
          return;
        }

        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;

        if (payload.exp && payload.exp < currentTime) {
          logout();
          return;
        }

        // Load saved business or auto-select first one
        const business = getCurrentBusinessFromStorage(userData);
        setCurrentBusinessState(business);

        const response = await zendulgeAxios.get(
          API_CONFIG.endpoints.auth.role(business?.id ?? '')
        );
        // Token is valid, set user data
        setUserState({ ...userData, role: response.data.role });
      } catch (error: unknown) {
        // Error initializing auth - log out user
        logout();
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, [logout]);

  const value: AuthContextType = React.useMemo(
    () => ({
      user,
      currentBusiness,
      businesses: user?.businesses ?? [],
      isAuthenticated: !!user,
      isLoading,
      login,
      setCurrentBusiness,
      logout,
      errorMessage,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      user,
      currentBusiness,
      isLoading,
      errorMessage,
      login,
      logout,
      setCurrentBusiness,
    ]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Return default values instead of throwing error to handle edge cases
    return {
      user: null,
      currentBusiness: null,
      businesses: [],
      isAuthenticated: false,
      isLoading: false,
      login: async () => {},
      setCurrentBusiness: () => {},
      logout: () => {},
      errorMessage: null,
    };
  }
  return context;
}
