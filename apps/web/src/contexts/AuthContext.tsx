'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * User data
 */
export interface User {
  id: string;
  username: string;
  avatar?: string;
  totalChips: number;
  level: number;
  xp: number;
  handsPlayed: number;
  handsWon: number;
  createdAt: number;
}

/**
 * Auth context type
 */
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  addChips: (amount: number) => void;
  addXP: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth Provider
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('pokermind_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('pokermind_user');
      }
    }
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('pokermind_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('pokermind_user');
    }
  }, [user]);

  const login = (username: string) => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      username,
      totalChips: 5000, // Starting chips
      level: 1,
      xp: 0,
      handsPlayed: 0,
      handsWon: 0,
      createdAt: Date.now()
    };

    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pokermind_user');
    localStorage.removeItem('activeProCoach');
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...updates });
  };

  const addChips = (amount: number) => {
    if (!user) return;
    setUser({
      ...user,
      totalChips: user.totalChips + amount
    });
  };

  const addXP = (amount: number) => {
    if (!user) return;

    const newXP = user.xp + amount;
    const xpForNextLevel = user.level * 100;

    if (newXP >= xpForNextLevel) {
      // Level up!
      setUser({
        ...user,
        xp: newXP - xpForNextLevel,
        level: user.level + 1,
        totalChips: user.totalChips + 500 // Bonus chips on level up
      });
    } else {
      setUser({
        ...user,
        xp: newXP
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
        addChips,
        addXP
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
