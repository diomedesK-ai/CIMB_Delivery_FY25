'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.error("Could not access local storage, continuing without auth token.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    if (username === 'admin' && password === 'ilovemicrosites_1507!') {
      try {
        localStorage.setItem('authToken', 'dummy-token');
      } catch (e) {
        console.error("Could not access local storage, continuing without storing auth token.");
      }
      setIsAuthenticated(true);
      router.push('/');
    } else {
      throw new Error('Invalid username or password');
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('authToken');
    } catch (e) {
        console.error("Could not access local storage, continuing without removing auth token.");
    }
    setIsAuthenticated(false);
    router.push('/login');
  };
  
  const value = { isAuthenticated, login, logout, isLoading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 