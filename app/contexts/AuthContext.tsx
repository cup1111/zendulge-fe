import type { ReactNode } from 'react';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { API_CONFIG } from '~/config/api';
import zendulgeAxios from '~/config/axios';

import type { UserRole } from '../constants/enums';

interface Company {
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
  role?: { slug: UserRole; name: string; id: string };
  companies: Company[];
}

interface AuthContextType {
  user: User | null;
  currentCompany: Company | null;
  companies: Company[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  setCurrentCompany: (company: Company) => void;
  logout: () => void;
  errorMessage: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Helper function to decode JWT and extract user data
function decodeJWTUser(token: string): User | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    );

    const payload = JSON.parse(jsonPayload);

    return {
      id: payload.id,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      userName: payload.userName,
      avatarIcon: payload.avatarIcon,
      companies: payload.companies || [],
    };
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

function getCurrentCompany(userData: User): Company | null {
  const savedCurrentCompany = localStorage.getItem('currentCompany');
  if (savedCurrentCompany) {
    try {
      return JSON.parse(savedCurrentCompany);
    } catch {
      // Ignore parse error, fallback to first company
    }
  }
  if (userData.companies && userData.companies.length > 0) {
    const [firstCompany] = userData.companies;
    localStorage.setItem('currentCompany', JSON.stringify(firstCompany));
    return firstCompany;
  }
  return null;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUserState] = useState<User | null>(null);
  const [currentCompany, setCurrentCompanyState] = useState<Company | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const clearError = () => setErrorMessage(null);

  const logout = () => {
    setUserState(null);
    setCurrentCompanyState(null);
    localStorage.removeItem('user');
    localStorage.removeItem('currentCompany');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('token');
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
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
      const userData = decodeJWTUser(accessToken);
      if (!userData) {
        throw new Error('Invalid token received');
      }

      // Set user state
      setUserState(userData);

      // Auto-select first company if available
      if (userData.companies && userData.companies.length > 0) {
        const firstCompany = userData.companies[0];
        setCurrentCompanyState(firstCompany);
        localStorage.setItem('currentCompany', JSON.stringify(firstCompany));
        clearError();
      }
    } catch (error: any) {
      // console.error('Login error:', error.response.data);
      if (error.response.data.includes('Account not activated')) {
        setErrorMessage(
          'Account not activated. Please check your email for activation instructions.'
        );
      } else {
        setErrorMessage('Invalid email or password. Please try again.');
      }
    }
  }, []);

  const setCurrentCompany = (company: Company) => {
    setCurrentCompanyState(company);
    localStorage.setItem('currentCompany', JSON.stringify(company));
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
        const userData = decodeJWTUser(token);
        if (!userData) {
          // Token is invalid, logout
          logout();
          window.location.href = '/';
          return;
        }

        // Check token expiry
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;

        if (payload.exp && payload.exp < currentTime) {
          // Token is expired, logout and redirect
          logout();
          window.location.href = '/';
          return;
        }

        // Load saved company or auto-select first one
        const company = getCurrentCompany(userData);
        setCurrentCompanyState(company);

        const response = await zendulgeAxios.get(
          API_CONFIG.endpoints.auth.role(company?.id ?? '')
        );
        // Token is valid, set user data
        setUserState({ ...userData, role: response.data.role });
      } catch (error: any) {
        console.error('Error initializing auth:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const value: AuthContextType = React.useMemo(
    () => ({
      user,
      currentCompany,
      companies: user?.companies ?? [],
      isAuthenticated: !!user,
      isLoading,
      login,
      setCurrentCompany,
      logout,
      errorMessage,
    }),
    [user, currentCompany, isLoading, errorMessage]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Return default values instead of throwing error to handle edge cases
    console.warn('useAuth called outside AuthProvider, using defaults');
    return {
      user: null,
      currentCompany: null,
      companies: [],
      isAuthenticated: false,
      isLoading: false,
      login: async () => {},
      setCurrentCompany: () => {},
      logout: () => {},
      errorMessage: null,
    };
  }
  return context;
}
