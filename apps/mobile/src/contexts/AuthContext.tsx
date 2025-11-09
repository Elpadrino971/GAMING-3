import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * User data structure
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
 * Auth context interface
 */
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  addChips: (amount: number) => void;
  addXP: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = '@pokermind_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from AsyncStorage on mount
  useEffect(() => {
    loadUser();
  }, []);

  // Save user to AsyncStorage whenever it changes
  useEffect(() => {
    if (user) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }
  }, [user]);

  const loadUser = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string) => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      username,
      totalChips: 5000, // Starting bonus
      level: 1,
      xp: 0,
      handsPlayed: 0,
      handsWon: 0,
      createdAt: Date.now(),
    };

    setUser(newUser);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...updates });
  };

  const addChips = (amount: number) => {
    if (!user) return;
    setUser({
      ...user,
      totalChips: user.totalChips + amount,
    });
  };

  const addXP = (amount: number) => {
    if (!user) return;

    const newXP = user.xp + amount;
    const xpForNextLevel = user.level * 100;

    if (newXP >= xpForNextLevel) {
      // Level up! +500 chips bonus
      setUser({
        ...user,
        level: user.level + 1,
        xp: newXP - xpForNextLevel,
        totalChips: user.totalChips + 500,
      });
    } else {
      setUser({
        ...user,
        xp: newXP,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        updateUser,
        addChips,
        addXP,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
