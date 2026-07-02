import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import Navbar from '@/components/Navbar';
import './globals.css';

export const metadata: Metadata = {
  title: 'QuisShield - Quishing Awareness Platform',
  description: 'Protect yourself from QR code phishing attacks',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="m-0 p-0 font-body bg-background text-foreground">
        <Navbar />
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
