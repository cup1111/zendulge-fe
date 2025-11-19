import { useContext } from 'react';

import { AuthContext, type AuthContextType } from '../contexts/AuthContext';

export function useAuth(): AuthContextType {
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
