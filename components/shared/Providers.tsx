'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1E293B', 
            color: '#E2E8F0',    
            border: '1px solid #334155', 
          },
        }}
      />
      {children}
    </SessionProvider>
  );
}