import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/contexts/AppContext';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';

export const metadata: Metadata = {
  title: {
    default: 'MentorPath',
    template: '%s | MentorPath',
  },
  description: 'AI-powered alumni mentor discovery for graduate students',
  keywords: ['mentorship', 'alumni', 'career', 'graduate students', 'networking'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-neutral-100 text-neutral-900">
        <AppProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <div className="flex flex-1">
              <Sidebar />
              {children}
            </div>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
