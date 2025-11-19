import { createContext } from 'react';

import type { Business, User } from './AuthProvider';

export interface AuthContextType {
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

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
