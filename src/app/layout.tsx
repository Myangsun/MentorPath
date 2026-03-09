import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppProvider } from '@/contexts/AppContext';

export const metadata: Metadata = {
  title: {
    default: 'MentorPath',
    template: '%s | MentorPath',
  },
  description: 'AI-powered alumni mentor discovery for graduate students',
  keywords: ['mentorship', 'alumni', 'career', 'graduate students', 'AI', 'networking'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-cream-100 text-neutral-900">
        <AuthProvider>
          <AppProvider>
            {children}
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
