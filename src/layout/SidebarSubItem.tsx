'use client';
import Link from 'next/link';
import { JSX, useEffect, useRef, useState } from 'react';
import { ChevronDownIcon } from '../icons';

type NavSubItem = {
  name: string;
  path: string;
  subItems?: NavSubItem[];
};

interface SidebarSubItemProps {
  item: NavSubItem;
  parentKey: string;
  isActive: (path: string) => boolean;
  openNestedSubmenus: Record<string, boolean>;
  toggleNestedSubmenu: (key: string) => void;
  renderSubItems: (subItems: NavSubItem[], parentKey: string) => JSX.Element;
  className?: string;
}

export function SidebarSubItem({
  item,
  parentKey,
  isActive,
  openNestedSubmenus,
  toggleNestedSubmenu,
  renderSubItems,
  className = '',
}: SidebarSubItemProps) {
  const hasChildren = item.subItems && item.subItems.length > 0;
  const key = `${parentKey}/${item.name}`;
  const [height, setHeight] = useState<number | 'auto'>(0);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const updateHeight = () => {
      if (ref.current) {
        setHeight(ref.current.scrollHeight);
      }
    };

    // Atualiza sempre que abre/fecha
    if (openNestedSubmenus[key]) {
      updateHeight();
    } else {
      setHeight(0);
    }

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(ref.current);

    return () => resizeObserver.disconnect();
  }, [openNestedSubmenus[key], item.subItems]);

  return (
    <li key={key} className={`flex flex-col ${className}`}>
      {hasChildren ? (
        <>
          <button
            onClick={() => toggleNestedSubmenu(key)}
            className={`menu-dropdown-item flex items-center justify-between ${
              isActive(item.path)
                ? 'menu-dropdown-item-active'
                : 'menu-dropdown-item-inactive'
            }`}
          >
            <span>{item.name}</span>
            <ChevronDownIcon
              className={`h-4 w-4 transition-transform duration-200 ${
                openNestedSubmenus[key] ? 'rotate-180' : ''
              }`}
            />
          </button>

          <div
            ref={ref}
            className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
            style={{
              maxHeight: openNestedSubmenus[key]
                ? height === 'auto'
                  ? '9999px' // garante expansão mesmo em animações rápidas
                  : `${height}px`
                : '0px',
            }}
            onTransitionEnd={() => {
              if (openNestedSubmenus[key]) {
                setHeight('auto'); // libera o crescimento após animação
              }
            }}
          >
            <div className="mt-2 ml-4">
              {renderSubItems(item.subItems!, key)}
            </div>
          </div>
        </>
      ) : (
        <Link
          href={item.path}
          className={`menu-dropdown-item ${
            isActive(item.path)
              ? 'menu-dropdown-item-active'
              : 'menu-dropdown-item-inactive'
          }`}
        >
          {item.name}
        </Link>
      )}
    </li>
  );
}
