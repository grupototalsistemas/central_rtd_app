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
        className={`header-button relative flex h-11 w-full items-center justify-between rounded-lg border border-[var(--cor-borda)] bg-[var(--background)] px-3 text-sm font-medium text-[var(--cor-texto)] shadow-sm transition-all duration-200 hover:bg-[var(--cor-button-hover)] hover:text-[var(--texto-button)] focus:outline-none dark:bg-[var(--dark-background)] dark:text-[var(--dark-cor-texto)] dark:hover:bg-[var(--dark-cor-button-hover)] dark:hover:text-[var(--dark-texto-button)]`}
        onClick={handleToggle}
      >
        <span className="truncate text-left">
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        {/* Ícone seta */}
        <svg
          className={`ml-2 h-4 w-4 flex-shrink-0 transition-transform duration-200 ${
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
          className={`custom-scrollbar absolute z-50 max-h-60 w-full overflow-auto rounded-lg border-[var(--cor-borda)] bg-[var(--cor-card)] dark:bg-[var(--dark-cor-card)] ${openUp ? 'bottom-full mb-1' : 'mt-1'}`}
        >
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option.value.toString())}
              className={`cursor-pointer px-3 py-2.5 text-sm font-medium text-[var(--cor-texto)] transition-colors duration-150 hover:bg-[var(--cor-button-hover)] hover:text-[var(--texto-button)] dark:text-[var(--dark-cor-texto)] dark:hover:bg-[var(--dark-cor-button-hover)] dark:hover:text-[var(--dark-texto-button)] ${
                option.value === selectedValue
                  ? 'bg-[var(--cor-button-hover)] text-[var(--texto-button)] dark:bg-[var(--dark-cor-button-hover)] dark:text-[var(--dark-texto-button)]'
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
