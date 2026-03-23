'use client';
import type React from 'react';

interface DropdownProps {
  isOpen: boolean;
  onClose?: () => void; // opcional, mas não usado aqui
  children: React.ReactNode;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  isOpen,
  children,
  className = '',
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={`shadow-theme-lg absolute right-0 z-[9999] mt-2 rounded-xl ${className}`}
      role="menu"
    >
      {children}
    </div>
  );
};
