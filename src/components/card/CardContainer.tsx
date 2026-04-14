'use client';

import { useId, useState } from 'react';
import { ChevronDownIcon } from '@/icons';
import { cn } from '@/utils/cn';

interface CardContainerProps {
  title?: string;
  description?: string;
  columns?: 1 | 2 | 3 | 4;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  collapseContentId?: string;
  className?: string;
  children: React.ReactNode;
}


const columnVariants = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
} as const;

export default function CardContainer({
  title,
  description,
  columns = 3,
  collapsible = false,
  defaultExpanded = true,
  onExpandedChange,
  collapseContentId,
  className,
  children,
}: CardContainerProps) {
  const internalCollapseId = useId();
  const collapseId = collapseContentId ?? `card-container-content-${internalCollapseId}`;
  const hasHeader = Boolean(title || description);
  const canCollapse = collapsible && hasHeader;
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleToggleExpanded = () => {
    const nextExpandedState = !isExpanded;
    setIsExpanded(nextExpandedState);
    onExpandedChange?.(nextExpandedState);
  };

  return (
    <section className={cn('dashboard-card-surface', className)}>
      {hasHeader && (
        <div className="flex items-start justify-between gap-3 px-6 py-5">
          <div className="min-w-0">
            {title && (
              <h3 className="text-base font-medium text-(--cor-texto) dark:text-(--dark-cor-texto)">
                {title}
              </h3>
            )}

            {description && (
              <p className="notification-dropdown-muted-text mt-1 text-sm">
                {description}
              </p>
            )}
          </div>

          {canCollapse && (
            <button
              type="button"
              className="px-4 header-button inline-flex shrink-0 items-center justify-center"
              onClick={handleToggleExpanded}
              aria-expanded={isExpanded}
              aria-controls={collapseId}
              aria-label={isExpanded ? 'Recolher conteudo do card' : 'Expandir conteudo do card'}
            >
              <ChevronDownIcon
                aria-hidden="true"
                className={cn(
                  'block shrink-0 transform-gpu transform-fill origin-center transition-transform duration-200',
                  isExpanded && 'rotate-180',
                )}
              />
            </button>
          )}
        </div>
      )}

      <div
        id={collapseId}
        className={cn(
          canCollapse &&
            'overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out',
          canCollapse && !isExpanded && 'pointer-events-none opacity-0',
        )}
        aria-hidden={canCollapse ? !isExpanded : undefined}
        style={
          canCollapse
            ? {
                maxHeight: isExpanded ? '9999px' : '0px',
              }
            : undefined
        }
      >
        <div className="rounded-b-2xl p-4 sm:p-6">
          <div className={cn('grid gap-4', columnVariants[columns])}>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
