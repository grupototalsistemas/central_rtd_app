'use client';

import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

type ValuesVisibilityContextType = {
  /** Se true, os valores estão visíveis. Se false, estão ocultos */
  isValuesVisible: boolean;
  /** Alterna a visibilidade dos valores */
  toggleValuesVisibility: () => void;
  /** Define a visibilidade dos valores */
  setValuesVisible: (visible: boolean) => void;
};

const ValuesVisibilityContext = createContext<
  ValuesVisibilityContextType | undefined
>(undefined);

export const ValuesVisibilityProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isValuesVisible, setIsValuesVisible] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Recupera a preferência salva no localStorage
    const savedVisibility = localStorage.getItem('valuesVisibility');
    const initialVisibility = savedVisibility === 'hidden' ? false : true;

    setIsValuesVisible(initialVisibility);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      // Salva a preferência no localStorage
      localStorage.setItem(
        'valuesVisibility',
        isValuesVisible ? 'visible' : 'hidden'
      );
    }
  }, [isValuesVisible, isInitialized]);

  const toggleValuesVisibility = () => {
    setIsValuesVisible((prev) => !prev);
  };

  const setValuesVisible = (visible: boolean) => {
    setIsValuesVisible(visible);
  };

  return (
    <ValuesVisibilityContext.Provider
      value={{ isValuesVisible, toggleValuesVisibility, setValuesVisible }}
    >
      {children}
    </ValuesVisibilityContext.Provider>
  );
};

export const useValuesVisibility = () => {
  const context = useContext(ValuesVisibilityContext);
  if (context === undefined) {
    throw new Error(
      'useValuesVisibility must be used within a ValuesVisibilityProvider'
    );
  }
  return context;
};
