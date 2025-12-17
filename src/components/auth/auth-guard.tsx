
'use client';

import { type ReactNode } from 'react';

// In local-only mode, AuthGuard simply renders children without authentication check
export default function AuthGuard({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
