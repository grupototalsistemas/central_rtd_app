import GridShape from '@/components/common/GridShape';
import ThemeTogglerTwo from '@/components/common/ThemeTogglerTwo';
import { ThemeProvider } from '@/context/ThemeContext';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';
import { ToastContainer } from 'react-toastify';

export const metadata: Metadata = {
  title: 'Faça Login | Central RTD',
  description: 'Pagina de login do sistema',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-1 bg-white p-6 sm:p-0 dark:bg-[var(--dark-background)]">
      <ThemeProvider>
        <div className="relative flex h-screen w-full flex-col justify-center sm:p-0 lg:flex-row dark:bg-gray-900">
          {children}
          <div className="hidden h-full w-full items-center bg-[var(--cor-button-hover)] lg:grid lg:w-1/2">
            <div className="relative z-1 flex items-center justify-center">
              <GridShape />
              <div className="flex max-w-xs flex-col items-center">
                <Link href="/" className="mb-4 block">
                  <h1 className="text-8xl font-bold text-white">Central RTD</h1>
                </Link>
              </div>
            </div>
          </div>
          <div className="fixed right-6 bottom-6 z-50 hidden sm:block">
            <ThemeTogglerTwo />
          </div>
        </div>
      </ThemeProvider>
      <ToastContainer theme="colored" />
    </div>
  );
}
