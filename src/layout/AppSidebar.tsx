'use client';
import { LifebuoyIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useCallback } from 'react';
import { useSidebar } from '../context/SidebarContext';

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
};

const AppSidebar: React.FC = () => {
  const {
    isExpanded,
    isMobileOpen,
    isHovered,
    setIsHovered,
    toggleMobileSidebar,
  } = useSidebar();
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      icon: <LifebuoyIcon className="h-5 w-5" />,
      name: 'Suporte',
      path: '/suport',
    },
  ];

  const isActive = useCallback(
    (path: string) => {
      if (path === '/') return pathname === '/';
      return pathname === path || pathname.startsWith(path + '/');
    },
    [pathname]
  );

  // useEffect(() => {
  //   if (modulosPaginas.length > 0) return;
  //   getPaginas(String(CentralRtdConstants.id_sistema));
  // }, [modulosPaginas]);

  // const getPaginas = async (sistemaId: string) => {

  // };

  const handleCloseSidebar = () => {
    toggleMobileSidebar();
  };

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav) => {
        const isParentActive = nav.path ? isActive(nav.path) : false;

        const sharedClasses = `menu-item group flex items-center w-full px-3 py-2 rounded-md transition-colors ${
          isParentActive ? 'menu-item-active' : 'menu-item-inactive'
        } ${!isExpanded && !isHovered && !isMobileOpen ? 'justify-center' : 'justify-start'}`;

        const iconWrapperClass = `flex items-center justify-center w-6 h-6 ${
          isParentActive ? 'menu-item-icon-active' : 'menu-item-icon-inactive'
        }`;

        return (
          <li key={nav.name}>
            {nav.path && (
              <Link
                href={nav.path}
                className={sharedClasses}
                onClick={() => {
                  if (isMobileOpen) {
                    handleCloseSidebar();
                  }
                }}
              >
                <span className={iconWrapperClass}>{nav.icon}</span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text ml-3">{nav.name}</span>
                )}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`sidebar fixed top-0 left-0 z-100 flex h-screen flex-col border-r transition-all duration-300 ease-in-out ${isExpanded || isMobileOpen ? 'w-[290px]' : isHovered ? 'w-[290px]' : 'w-[90px]'} ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo / título */}
      <div
        className={`flex items-center py-8 ${
          !isExpanded && !isHovered && !isMobileOpen
            ? 'lg:justify-center'
            : 'justify-between'
        }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <div className="flex flex-col items-center gap-1">
              <h1 className="ml-2 hidden text-4xl text-[var(--cor-texto)] md:block dark:text-[var(--dark-cor-texto)]">
                Central RTD
              </h1>
            </div>
          ) : (
            <h1 className="ml-2 hidden text-4xl text-[var(--cor-texto)] md:block dark:text-[var(--dark-cor-texto)]">
              C
            </h1>
          )}
        </Link>

        {/* Botão de fechar - apenas mobile */}
        <button
          onClick={handleCloseSidebar}
          className="mr-4 flex h-10 w-10 items-center justify-center rounded-md text-[var(--cor-texto)] transition-colors hover:bg-[var(--hover-background)] lg:hidden dark:text-[var(--dark-cor-texto)] dark:hover:bg-[var(--dark-hover-background)]"
          aria-label="Fechar menu"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Navegação */}
      <div className="custom-scrollbar flex-1 overflow-y-auto px-2 pb-6">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 flex text-xs leading-[20px] text-[var(--cor-texto)] uppercase dark:text-[var(--dark-cor-texto)] ${
                  !isExpanded && !isHovered && !isMobileOpen
                    ? 'justify-center'
                    : 'justify-start'
                }`}
              ></h2>
              {renderMenuItems(navItems)}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
