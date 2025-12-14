
'use client';

// Authentication disabled: provide a no-op `useAuth` hook so components
// depending on it continue to work without a global AuthProvider.
import { useCallback } from 'react';

export const useAuth = () => {
  const logout = useCallback(async () => {}, []);
  return {
    user: null,
    session: null,
    isLoading: false,
    logout,
  } as const;
};
