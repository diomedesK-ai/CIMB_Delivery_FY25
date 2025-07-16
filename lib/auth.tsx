'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

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
  const pathname = usePathname();

  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const localToken = localStorage.getItem('authToken');
        const cookieToken = document.cookie
          .split('; ')
          .find(row => row.startsWith('authToken='))
          ?.split('=')[1];
        
        const isAuth = !!(localToken && cookieToken);
        setIsAuthenticated(isAuth);
        
        // If not authenticated and not on login page, redirect
        if (!isAuth && pathname !== '/login') {
          router.replace('/login');
        }
      } catch (e) {
        console.error("Could not access local storage, continuing without auth token.");
        setIsAuthenticated(false);
        if (pathname !== '/login') {
          router.replace('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [pathname, router]);

  const login = async (username: string, password: string) => {
    if (username === 'admin' && password === 'ilovemicrosites_1507!') {
      try {
        localStorage.setItem('authToken', 'dummy-token');
        // Also set a cookie for middleware detection
        document.cookie = 'authToken=dummy-token; path=/; secure; samesite=strict';
      } catch (e) {
        console.error("Could not access local storage, continuing without storing auth token.");
      }
      setIsAuthenticated(true);
      router.replace('/');
    } else {
      throw new Error('Invalid username or password');
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('authToken');
      // Also remove the cookie
      document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    } catch (e) {
        console.error("Could not access local storage, continuing without removing auth token.");
    }
    setIsAuthenticated(false);
    router.replace('/login');
  };
  
  const value = { isAuthenticated, login, logout, isLoading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 