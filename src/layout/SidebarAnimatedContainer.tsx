'use client';
import React, { useEffect, useRef, useState } from 'react';

interface SidebarAnimatedContainerProps {
  children: React.ReactNode;
  isOpen: boolean;
  menuKey: string;
}

export const SidebarAnimatedContainer: React.FC<
  SidebarAnimatedContainerProps
> = ({ children, isOpen }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const updateHeight = () => {
      setHeight(isOpen ? el.scrollHeight : 0);
    };

    updateHeight(); // inicial

    const observer = new ResizeObserver(() => {
      if (isOpen) updateHeight(); // atualiza altura se aberto
    });

    observer.observe(el);

    return () => observer.disconnect();
  }, [isOpen, children]);

  return (
    <div
      style={{
        overflow: 'hidden',
        maxHeight: `${height}px`,
        transition: 'max-height 0.3s ease',
      }}
    >
      <div ref={ref}>{children}</div>
    </div>
  );
};
