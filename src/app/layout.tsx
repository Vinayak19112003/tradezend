
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/auth-context';
import { StreamerModeProvider } from '@/contexts/streamer-mode-context';
import { cn } from '@/lib/utils';
import { CurrencyProvider } from '@/contexts/currency-context';
import { Inter, Space_Grotesk } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Anony Trading',
  description: 'A modern journal for professionals.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("font-body antialiased", inter.variable, spaceGrotesk.variable)}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <StreamerModeProvider>
                <CurrencyProvider>
                    {children}
                    <Toaster />
                </CurrencyProvider>
            </StreamerModeProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
