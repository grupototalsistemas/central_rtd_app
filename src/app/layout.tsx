import { NotificationProvider } from '@/context/NotificationContext';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ValuesVisibilityProvider } from '@/context/ValuesVisibilityContext';
import { ReduxProvider } from '@/store/ReduxProvider';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  icons: {
    icon: [
      {
        url: '/favicon.svg?v=7',
        type: 'image/svg+xml',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body
        className="overflow-x-hidden dark:bg-gray-900"
        suppressHydrationWarning
      >
        <ReduxProvider>
          <ThemeProvider>
            <ValuesVisibilityProvider>
              <NotificationProvider
                websocketUrl={
                  process.env.NEXT_PUBLIC_WEBSOCKET_URL ||
                  'http://localhost:3001'
                }
                maxNotifications={50}
              >
                <SidebarProvider>{children}</SidebarProvider>
              </NotificationProvider>
            </ValuesVisibilityProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
