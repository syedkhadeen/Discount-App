import './globals.css';
import { Inter } from 'next/font/google';
import ClientLayout from './layout-client';
import { ThemeProvider } from 'next-themes';
import SessionProviderWrapper from '../components/SessionProviderWrapper';

export const metadata = {
  title: 'Food Discount - Best Deals on Food',
  description: 'Find the best food deals and discounts in your area',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#E53935',
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children, session }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background`}>
        <SessionProviderWrapper session={session}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <ClientLayout>
              {children}
            </ClientLayout>
          </ThemeProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
