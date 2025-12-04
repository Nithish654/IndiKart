import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for persisted mock session
    const storedUser = localStorage.getItem('indikart_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // 1. Try Real Supabase Login
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      // Retrieve profile/role logic here in a real app
    }

    // 2. Mock Login (Demo Mode)
    // Simple logic: If email contains "admin", they are an admin.
    const isAdmin = email.toLowerCase().includes('admin');
    
    const mockUser: User = {
      id: 'user-' + Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      role: isAdmin ? 'admin' : 'customer'
    };

    setUser(mockUser);
    localStorage.setItem('indikart_user', JSON.stringify(mockUser));
    return {};
  };

  const signup = async (email: string, password: string, name: string) => {
     // 1. Try Real Supabase Signup
    if (supabase) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) return { error: error.message };
    }

    // 2. Mock Signup
    const mockUser: User = {
      id: 'user-' + Math.random().toString(36).substr(2, 9),
      email,
      name,
      role: 'customer' // Default to customer
    };
    
    setUser(mockUser);
    localStorage.setItem('indikart_user', JSON.stringify(mockUser));
    return {};
  };

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('indikart_user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      signup, 
      logout,
      isAdmin: user?.role === 'admin' 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
