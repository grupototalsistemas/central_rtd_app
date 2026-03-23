'use client';

import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { useValuesVisibility } from '../../context/ValuesVisibilityContext';

/**
 * Botão para alternar a visibilidade de valores sensíveis no app
 * Similar ao comportamento de apps de banco
 */
export const ValuesVisibilityToggle: React.FC = () => {
  const { isValuesVisible, toggleValuesVisibility } = useValuesVisibility();

  return (
    <button
      onClick={toggleValuesVisibility}
      className="header-button relative flex h-11 w-11 items-center justify-center rounded-full text-[var(--cor-texto)] transition-colors hover:text-[var(--dark-cor-texto)] dark:text-[var(--dark-cor-texto)] dark:hover:text-[var(--cor-texto)]"
      title={isValuesVisible ? 'Ocultar valores' : 'Mostrar valores'}
      aria-label={isValuesVisible ? 'Ocultar valores' : 'Mostrar valores'}
    >
      {isValuesVisible ? (
        <EyeIcon className="h-5 w-5" />
      ) : (
        <EyeSlashIcon className="h-5 w-5" />
      )}
    </button>
  );
};
