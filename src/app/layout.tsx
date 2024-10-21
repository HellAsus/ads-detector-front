import type { Metadata } from 'next';
import { ToastContainer } from 'react-toastify';
import { NextUIProvider } from '@nextui-org/react';
import localFont from 'next/font/local';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Ad detector',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased w-full h-dvh bg-slate-800 dark text-foreground bg-background`}>
        <NextUIProvider>{children}</NextUIProvider>
        <ToastContainer autoClose={false} />
      </body>
    </html>
  );
}
