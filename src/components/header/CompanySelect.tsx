import React, { useEffect, useRef, useState } from 'react';

interface Option {
  id: string;
  value: string | number;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  value?: string;
}

const CompanySelect: React.FC<SelectProps> = ({
  options,
  placeholder = 'Select an option',
  onChange,
  className = '',
  value = '',
}) => {
  const [selectedValue, setSelectedValue] = useState<string>(value);
  const [isOpen, setIsOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!isOpen && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropdownHeight = Math.min(options.length * 40, 240);
      setOpenUp(spaceBelow < dropdownHeight && spaceAbove > spaceBelow);
    }
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (newValue: string) => {
    setSelectedValue(newValue);
    onChange(newValue);
    setIsOpen(false);
  };

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  return (
    <div className={`relative w-full ${className}`} ref={ref}>
      {/* Botão principal - agora com estilo consistente com header */}
      <button
        type="button"
        className={`header-button relative flex h-11 w-full items-center justify-between rounded-lg bg-(--background) px-3 text-sm font-medium text-(--cor-texto) shadow-theme-xs transition-all duration-200 hover:bg-(--cor-button-hover) hover:text-(--texto-accento) hover:shadow-theme-sm focus:outline-none dark:bg-(--dark-background) dark:text-(--dark-cor-texto) dark:hover:bg-(--dark-cor-button-hover) dark:hover:text-(--dark-texto-button)`}
        onClick={handleToggle}
      >
        <span className="truncate text-left">
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        {/* Ícone seta */}
        <svg
          className={`ml-2 h-4 w-4 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <ul
          className={`custom-scrollbar absolute z-50 max-h-60 w-full overflow-auto rounded-lg bg-(--cor-card) shadow-theme-lg dark:bg-(--dark-cor-card) dark:shadow-theme-xl ${openUp ? 'bottom-full mb-1' : 'mt-1'}`}
        >
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option.value.toString())}
              className={`cursor-pointer px-3 py-2.5 text-sm font-medium text-(--cor-texto) transition-colors duration-150 hover:bg-(--cor-button-hover) hover:text-(--texto-accento) dark:text-(--dark-cor-texto) dark:hover:bg-(--dark-cor-button-hover) dark:hover:text-(--dark-texto-button) ${
                option.value === selectedValue
                  ? 'bg-(--cor-button-hover) text-(--texto-accento) dark:bg-(--dark-cor-button-hover) dark:text-(--dark-texto-button)'
                  : ''
              }`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CompanySelect;
