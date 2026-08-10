'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { type UserProfile } from './supabase';
import { getUserByPhone, createUser } from './user';

const TOKEN_KEY = 'wec_token';

type StoredToken = { phone: string };

type AuthContextValue = {
  user: UserProfile | null;
  loading: boolean;
  login: (phone: string) => Promise<{ isNew: boolean }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  setUser: (u: UserProfile) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = localStorage.getItem(TOKEN_KEY);
        if (!raw) {
          setLoading(false);
          return;
        }
        const token = JSON.parse(raw) as StoredToken;
        const profile = await getUserByPhone(token.phone);
        if (profile) {
          setUserState(profile);
        } else {
          localStorage.removeItem(TOKEN_KEY);
        }
      } catch {
        localStorage.removeItem(TOKEN_KEY);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (phone: string) => {
    let profile = await getUserByPhone(phone);
    let isNew = false;
    if (!profile) {
      profile = await createUser(phone);
      isNew = true;
    }
    localStorage.setItem(TOKEN_KEY, JSON.stringify({ phone } satisfies StoredToken));
    setUserState(profile);
    return { isNew };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUserState(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!user) return;
    const profile = await getUserByPhone(user.phone);
    if (profile) setUserState(profile);
  }, [user]);

  const setUser = useCallback((u: UserProfile) => setUserState(u), []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, refreshUser, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
