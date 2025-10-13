import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

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
  role?: string;
  companies: Company[];
}

interface CompanyContextType {
  user: User | null;
  currentCompany: Company | null;
  companies: Company[];
  setCurrentCompany: (company: Company) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

interface CompanyProviderProps {
  children: ReactNode;
}

export function CompanyProvider({ children }: CompanyProviderProps) {
  const [user, setUserState] = useState<User | null>(null);
  const [currentCompany, setCurrentCompanyState] = useState<Company | null>(null);

  // Load data from localStorage on init
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedCurrentCompany = localStorage.getItem('currentCompany');

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUserState(parsedUser);

        if (savedCurrentCompany) {
          const parsedCompany = JSON.parse(savedCurrentCompany);
          setCurrentCompanyState(parsedCompany);
        } else if (parsedUser.companies && parsedUser.companies.length > 0) {
          // Auto-select first company if none selected
          const firstCompany = parsedUser.companies[0];
          setCurrentCompanyState(firstCompany);
          localStorage.setItem('currentCompany', JSON.stringify(firstCompany));
        }
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        // Clear corrupted data
        localStorage.removeItem('user');
        localStorage.removeItem('currentCompany');
      }
    }
  }, []);

  const setUser = (newUser: User) => {
    setUserState(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));

    // Auto-select first company if user has companies
    if (newUser.companies && newUser.companies.length > 0 && !currentCompany) {
      const firstCompany = newUser.companies[0];
      setCurrentCompanyState(firstCompany);
      localStorage.setItem('currentCompany', JSON.stringify(firstCompany));
    }
  };

  const setCurrentCompany = (company: Company) => {
    setCurrentCompanyState(company);
    localStorage.setItem('currentCompany', JSON.stringify(company));
  };

  const logout = () => {
    setUserState(null);
    setCurrentCompanyState(null);
    localStorage.removeItem('user');
    localStorage.removeItem('currentCompany');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('token');
  };

  const value: CompanyContextType = {
    user,
    currentCompany,
    companies: user?.companies || [],
    setCurrentCompany,
    setUser,
    logout,
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    // Return default values instead of throwing error to handle edge cases
    console.warn('useCompany called outside CompanyProvider, using defaults');
    return {
      user: null,
      currentCompany: null,
      companies: [],
      setCurrentCompany: () => {},
      setUser: () => {},
      logout: () => {},
    };
  }
  return context;
}

// Helper function to decode JWT and extract user data
export function decodeJWTUser(token: string): User | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
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
      role: payload.role,
      companies: payload.companies || [],
    };
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}
