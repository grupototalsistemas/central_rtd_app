'use client';

import { useCompanySwitch } from '@/context/CompanySwitchContext';
import {
  ArrowPathIcon,
  BuildingOffice2Icon,
} from '@heroicons/react/24/outline';
import React from 'react';

const CompanySwitchLoading: React.FC = () => {
  const { isSwitching, switchMessage } = useCompanySwitch();

  if (!isSwitching) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--background)]/95 backdrop-blur-sm dark:bg-[var(--dark-background)]/95">
      <div className="mx-4 flex max-w-md flex-col items-center gap-6 rounded-2xl border border-[var(--cor-borda)] bg-[var(--cor-background-componentes)] p-8 shadow-2xl dark:border-[var(--dark-cor-borda)] dark:bg-[var(--dark-cor-background-componentes)]">
        {/* Ícone animado */}
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-[var(--cor-button-hover)] opacity-20 dark:bg-[var(--dark-cor-button-hover)]"></div>
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[var(--cor-button)] dark:bg-[var(--dark-cor-button)]">
            <BuildingOffice2Icon className="h-10 w-10 text-white" />
          </div>
        </div>

        {/* Spinner */}
        <div className="flex items-center gap-3">
          <ArrowPathIcon className="h-6 w-6 animate-spin text-[var(--cor-button)] dark:text-[var(--dark-cor-button)]" />
          <span className="text-lg font-medium text-[var(--cor-texto)] dark:text-[var(--dark-cor-texto)]">
            {switchMessage || 'Trocando de empresa...'}
          </span>
        </div>

        {/* Barra de progresso */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--cor-borda)] dark:bg-[var(--dark-cor-borda)]">
          <div
            className="animate-progress h-full rounded-full bg-gradient-to-r from-[var(--cor-button)] to-[var(--cor-button-hover)] dark:from-[var(--dark-cor-button)] dark:to-[var(--dark-cor-button-hover)]"
            style={{
              animation: 'progress 2s ease-in-out infinite',
            }}
          />
        </div>

        <p className="text-center text-sm text-[var(--cor-texto)]/70 dark:text-[var(--dark-cor-texto)]/70">
          Por favor, aguarde enquanto preparamos tudo para você...
        </p>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% {
            width: 0%;
            margin-left: 0%;
          }
          50% {
            width: 60%;
            margin-left: 20%;
          }
          100% {
            width: 0%;
            margin-left: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default CompanySwitchLoading;
