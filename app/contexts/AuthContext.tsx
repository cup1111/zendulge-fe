import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

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

interface AuthContextType {
  user: User | null;
  currentCompany: Company | null;
  companies: Company[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  setCurrentCompany: (company: Company) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUserState] = useState<User | null>(null);
  const [currentCompany, setCurrentCompanyState] = useState<Company | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing authentication on init
  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        const token =
          localStorage.getItem("accessToken") || localStorage.getItem("token");

        if (!token) {
          setIsLoading(false);
          return;
        }

        // Check if token is expired
        const userData = decodeJWTUser(token);
        if (!userData) {
          // Token is invalid, logout
          logout();
          window.location.href = "/";
          return;
        }

        // Check token expiry
        const payload = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Date.now() / 1000;

        if (payload.exp && payload.exp < currentTime) {
          // Token is expired, logout and redirect
          logout();
          window.location.href = "/";
          return;
        }

        // Token is valid, set user data
        setUserState(userData);

        // Load saved company or auto-select first one
        const savedCurrentCompany = localStorage.getItem("currentCompany");
        if (savedCurrentCompany) {
          try {
            const parsedCompany = JSON.parse(savedCurrentCompany);
            setCurrentCompanyState(parsedCompany);
          } catch (error) {
            console.error("Error parsing saved company:", error);
          }
        } else if (userData.companies && userData.companies.length > 0) {
          // Auto-select first company if none selected
          const firstCompany = userData.companies[0];
          setCurrentCompanyState(firstCompany);
          localStorage.setItem("currentCompany", JSON.stringify(firstCompany));
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };
    login("user@example.com", "password123");
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const API_BASE_URL =
        process.env.NODE_ENV === "production"
          ? "https://api.zendulge.com"
          : "http://localhost:8000";

      const response = await fetch(`${API_BASE_URL}/api/v1/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      const { accessToken } = data.data;

      // Store token
      localStorage.setItem("accessToken", accessToken);

      // Decode user data from token
      const userData = decodeJWTUser(accessToken);
      if (!userData) {
        throw new Error("Invalid token received");
      }

      // Set user state
      setUserState(userData);

      // Auto-select first company if available
      if (userData.companies && userData.companies.length > 0) {
        const firstCompany = userData.companies[0];
        setCurrentCompanyState(firstCompany);
        localStorage.setItem("currentCompany", JSON.stringify(firstCompany));
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const setCurrentCompany = (company: Company) => {
    setCurrentCompanyState(company);
    localStorage.setItem("currentCompany", JSON.stringify(company));
  };

  const logout = () => {
    setUserState(null);
    setCurrentCompanyState(null);
    localStorage.removeItem("user");
    localStorage.removeItem("currentCompany");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("token");
  };

  const value: AuthContextType = {
    user,
    currentCompany,
    companies: user?.companies || [],
    isAuthenticated: !!user,
    isLoading,
    login,
    setCurrentCompany,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Return default values instead of throwing error to handle edge cases
    console.warn("useAuth called outside AuthProvider, using defaults");
    return {
      user: null,
      currentCompany: null,
      companies: [],
      isAuthenticated: false,
      isLoading: false,
      login: async () => {},
      setCurrentCompany: () => {},
      logout: () => {},
    };
  }
  return context;
}

// Helper function to decode JWT and extract user data
export function decodeJWTUser(token: string): User | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
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
    console.error("Error decoding JWT:", error);
    return null;
  }
}
