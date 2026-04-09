'use client';

import { ThemeToggleButton } from '@/components/common/ThemeToggleButton';
import { ValuesVisibilityToggle } from '@/components/common/ValuesVisibilityToggle';
import CompanySelector from '@/components/header/CompanySelector';
import NotificationDropdown from '@/components/header/NotificationDropdown';
import UserDropdown from '@/components/header/UserDropdown';
import { useSidebar } from '@/context/SidebarContext';
import { HorizontaLDots } from '@/icons';
import { Bars3CenterLeftIcon } from '@heroicons/react/24/outline';

import React, { useEffect, useRef, useState } from 'react';

const AppHeader: React.FC = React.memo(() => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);

  const { toggleSidebar, toggleMobileSidebar } = useSidebar();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="app-header sticky top-0 z-50 flex w-full">
      <div className="flex grow flex-col items-center justify-between lg:flex-row lg:px-6">
        <div className="flex w-full items-center justify-between gap-2 px-3 py-3 sm:gap-4 lg:justify-normal lg:px-0 lg:py-4">
          <button
            className="header-button z-50 flex h-10 w-10 items-center justify-center lg:h-11 lg:w-11"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            <Bars3CenterLeftIcon className="h-6 w-6" />
          </button>

          {/* Seletor de empresa - aparece se tiver mais de uma empresa, senão mostra só o nome */}
          {/* <CompanySelector /> */}

          <div className="flex items-center md:hidden">
            <button
              className="header-button z-50 flex h-10 w-10 items-center justify-center lg:h-11 lg:w-11"
              onClick={toggleApplicationMenu}
              aria-label="Toggle Application Menu"
            >
              <HorizontaLDots className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div
          className={`shadow-(--shadow-theme-light-md) dark:shadow-(--shadow-theme-dark-md) flex w-full items-center justify-between gap-4 px-5 py-4 transition-all duration-300 ease-in-out md:w-1/3 lg:px-0 lg:shadow-none lg:dark:shadow-none ${
            isApplicationMenuOpen ? 'block max-h-96 opacity-100' : 'hidden'
          } md:flex md:max-h-full md:py-4 md:opacity-100`}
        >
          {/* Visibilidade de valores, Tema, notificações e usuário */}
          <ValuesVisibilityToggle />
          <ThemeToggleButton />
          <NotificationDropdown />
          <UserDropdown />
        </div>
      </div>
    </header>
  );
});

AppHeader.displayName = 'AppHeader';

export default AppHeader;
