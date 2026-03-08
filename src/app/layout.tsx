import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MentorPath',
  description: 'AI-powered alumni mentor discovery for graduate students',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-neutral-100 text-neutral-900">
        {children}
      </body>
    </html>
  );
}
