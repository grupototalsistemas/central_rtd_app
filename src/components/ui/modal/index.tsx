'use client';

import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  isFullscreen?: boolean;
  disableBackdropClose?: boolean;
  disableEscKey?: boolean;
  titleId?: string;
  ariaLabel?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
  showCloseButton = true,
  isFullscreen = false,
  disableBackdropClose = false,
  disableEscKey = false,
  titleId,
  ariaLabel,
}) => {
  const modalRef = React.useRef<HTMLDivElement>(null);
  const previousFocusedElementRef = React.useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    previousFocusedElementRef.current = document.activeElement as HTMLElement;
    const previousOverflow = document.body.style.overflow;

    const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstFocusableElement = focusableElements?.[0];
    const lastFocusableElement =
      focusableElements && focusableElements.length > 0
        ? focusableElements[focusableElements.length - 1]
        : null;

    // Foco inicial no primeiro elemento interativo ou no próprio container.
    if (firstFocusableElement) {
      firstFocusableElement.focus();
    } else {
      modalRef.current?.focus();
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (!disableEscKey && event.key === 'Escape') {
        onClose();
      }
    };

    const handleFocusTrap = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !firstFocusableElement || !lastFocusableElement) {
        return;
      }

      if (event.shiftKey && document.activeElement === firstFocusableElement) {
        event.preventDefault();
        lastFocusableElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastFocusableElement) {
        event.preventDefault();
        firstFocusableElement.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleFocusTrap);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleFocusTrap);
      document.body.style.overflow = previousOverflow;
      previousFocusedElementRef.current?.focus?.();
    };
  }, [disableEscKey, isOpen, onClose]);

  if (!isOpen) return null;

  const contentClasses = isFullscreen
    ? 'w-full h-full'
    : 'relative w-full rounded-3xl bg-(--cor-card) shadow-theme-xl dark:bg-(--dark-cor-card) dark:shadow-theme-xl';

  const handleBackdropClick = () => {
    if (!disableBackdropClose) {
      onClose();
    }
  };

  return (
    <div className="modal fixed inset-0 z-99999 flex items-center justify-center" role="presentation">
      {!isFullscreen && (
        <div
          className="fixed inset-0 h-full w-full bg-gray-900/40 backdrop-blur-xl"
          onClick={handleBackdropClick}
        ></div>
      )}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-label={ariaLabel}
        tabIndex={-1}
        className={`${contentClasses} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-999 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-gray-100 text-gray-500 shadow-theme-xs transition-all hover:bg-gray-200 hover:text-gray-700 hover:shadow-theme-sm sm:top-6 sm:right-6 sm:h-11 sm:w-11 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.04289 16.5413C5.65237 16.9318 5.65237 17.565 6.04289 17.9555C6.43342 18.346 7.06658 18.346 7.45711 17.9555L11.9987 13.4139L16.5408 17.956C16.9313 18.3466 17.5645 18.3466 17.955 17.956C18.3455 17.5655 18.3455 16.9323 17.955 16.5418L13.4129 11.9997L17.955 7.4576C18.3455 7.06707 18.3455 6.43391 17.955 6.04338C17.5645 5.65286 16.9313 5.65286 16.5408 6.04338L11.9987 10.5855L7.45711 6.0439C7.06658 5.65338 6.43342 5.65338 6.04289 6.0439C5.65237 6.43442 5.65237 7.06759 6.04289 7.45811L10.5845 11.9997L6.04289 16.5413Z"
                fill="currentColor"
              />
            </svg>
          </button>
        )}
        {children}
      </div>
    </div>
  );
};
