'use client';

import { createContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';

// Minimal mock user for local-only mode
interface MockUser {
  id: string;
  email: string;
}

interface AuthContextType {
  user: MockUser | null;
  session: null;
  isLoading: boolean;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // In local-only mode, we always have a "logged in" mock user
  const [user] = useState<MockUser>({ id: 'local-user', email: 'local@user.app' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate auth check completing
    setIsLoading(false);
  }, []);

  const logout = useCallback(async () => {
    // In local mode, logout just clears local storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tradezend_trades');
      localStorage.removeItem('tradezend_accounts');
      window.location.reload();
    }
  }, []);

  const value = useMemo(() => ({ user, session: null, isLoading, logout }), [user, isLoading, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
