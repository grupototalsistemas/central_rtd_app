import { useCallback, useEffect, useRef, useState } from 'react';

interface DropdownPosition {
  openUpward: boolean;
  top: number;
  left: number;
  buttonHeight: number;
}

interface UseDropdownReturn {
  openDropdownIndex: number | null;
  dropdownPositions: { [key: number]: DropdownPosition };
  dropdownRefs: React.MutableRefObject<{ [key: number]: HTMLElement | null }>;
  toggleDropdown: (index: number) => void;
  closeDropdown: () => void;
  isDropdownOpen: (index: number) => boolean;
}

export function useDropdown(dependencies: any[] = []): UseDropdownReturn {
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null
  );
  const [dropdownPositions, setDropdownPositions] = useState<{
    [key: number]: DropdownPosition;
  }>({});
  const dropdownRefs = useRef<{ [key: number]: HTMLElement | null }>({});

  // Função para calcular a posição do dropdown antes de abrir
  const calculateDropdownPosition = useCallback((index: number): boolean => {
    const btn = dropdownRefs.current[index];
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUpward = spaceBelow < 280;
      const dropdownWidth = 192; // w-48 = 12rem = 192px

      setDropdownPositions((prev) => ({
        ...prev,
        [index]: {
          openUpward,
          top: openUpward ? rect.top : rect.bottom,
          left: Math.max(8, rect.right - dropdownWidth), // Alinha à direita do botão
          buttonHeight: rect.height,
        },
      }));

      return openUpward;
    }
    return false;
  }, []);

  // Função para abrir/fechar dropdown
  const toggleDropdown = useCallback(
    (index: number) => {
      if (openDropdownIndex === index) {
        setOpenDropdownIndex(null);
      } else {
        calculateDropdownPosition(index);
        setOpenDropdownIndex(index);
      }
    },
    [openDropdownIndex, calculateDropdownPosition]
  );

  // Função para fechar dropdown
  const closeDropdown = useCallback(() => {
    setOpenDropdownIndex(null);
  }, []);

  // Função para verificar se um dropdown está aberto
  const isDropdownOpen = useCallback(
    (index: number): boolean => {
      return openDropdownIndex === index;
    },
    [openDropdownIndex]
  );

  // Limpa posições quando o dropdown fecha
  useEffect(() => {
    if (openDropdownIndex === null) {
      setDropdownPositions({});
    }
  }, [openDropdownIndex]);

  // Limpa refs quando as dependências mudam
  useEffect(() => {
    dropdownRefs.current = {};
    setOpenDropdownIndex(null);
    setDropdownPositions({});
  }, dependencies);

  // Fecha dropdown ao pressionar ESC
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && openDropdownIndex !== null) {
        setOpenDropdownIndex(null);
      }
    };

    if (openDropdownIndex !== null) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [openDropdownIndex]);

  return {
    openDropdownIndex,
    dropdownPositions,
    dropdownRefs,
    toggleDropdown,
    closeDropdown,
    isDropdownOpen,
  };
}
