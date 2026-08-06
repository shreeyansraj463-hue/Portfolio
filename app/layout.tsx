import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shreeyans Raj — Portfolio',
  description: 'Scrollytelling portfolio — creative developer',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
