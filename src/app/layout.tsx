
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/toaster';
// Authentication removed: no AuthProvider import
import { StreamerModeProvider } from '@/contexts/streamer-mode-context';
import { cn } from '@/lib/utils';
import { CurrencyProvider } from '@/contexts/currency-context';

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Space+Grotesk:wght@300..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn("font-body antialiased")}>
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
        {/* AuthProvider removed - app renders without global auth context */}
      </body>
    </html>
  );
}
