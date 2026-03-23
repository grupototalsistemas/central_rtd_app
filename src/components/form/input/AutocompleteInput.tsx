'use client';

import React, { FC, useEffect, useRef, useState } from 'react';

export interface AutocompleteOption {
  id: string | number;
  label: string;
  [key: string]: any;
}

interface AutocompleteInputProps {
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string | number;
  options: AutocompleteOption[];
  onChange?: (option: AutocompleteOption | null) => void;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  hint?: string;
  filterKey?: string; // chave para filtrar nas opções (padrão: 'label')
}

const AutocompleteInput: FC<AutocompleteInputProps> = ({
  id,
  name,
  placeholder = 'Digite para pesquisar...',
  value,
  options = [],
  onChange,
  className = '',
  disabled = false,
  error = false,
  hint,
  filterKey = 'label',
}) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<AutocompleteOption[]>(
    []
  );
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] =
    useState<AutocompleteOption | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Inicializa o valor selecionado com base no value prop
  useEffect(() => {
    if (value) {
      const option = options.find((opt) => opt.id === value);
      if (option) {
        setSelectedOption(option);
        setInputValue(option.label);
      }
    } else {
      setSelectedOption(null);
      setInputValue('');
    }
  }, [value, options]);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtra opções com base no input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = e.target.value;
    setInputValue(inputText);

    if (inputText.trim() === '') {
      setFilteredOptions([]);
      setIsOpen(false);
      setSelectedOption(null);
      onChange?.(null);
      return;
    }

    const filtered = options.filter((option) => {
      const valueToFilter = option[filterKey]?.toString().toLowerCase() || '';
      return valueToFilter.includes(inputText.toLowerCase());
    });

    setFilteredOptions(filtered);
    setIsOpen(filtered.length > 0);
  };

  const handleSelectOption = (option: AutocompleteOption) => {
    setSelectedOption(option);
    setInputValue(option.label);
    setIsOpen(false);
    onChange?.(option);
  };

  const handleFocus = () => {
    if (inputValue.trim() !== '') {
      const filtered = options.filter((option) => {
        const valueToFilter = option[filterKey]?.toString().toLowerCase() || '';
        return valueToFilter.includes(inputValue.toLowerCase());
      });
      setFilteredOptions(filtered);
      setIsOpen(filtered.length > 0);
    }
  };

  let inputClasses = `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${className}`;

  if (disabled) {
    inputClasses += ` text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
  } else if (error) {
    inputClasses += ` text-error-800 border-error-500 focus:ring-3 focus:ring-error-500/10 dark:text-error-400 dark:border-error-500`;
  } else {
    inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800`;
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        type="text"
        id={id}
        name={name}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        disabled={disabled}
        className={inputClasses}
        autoComplete="off"
      />

      {/* Dropdown de opções */}
      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-300 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {filteredOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => handleSelectOption(option)}
              className="cursor-pointer px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 dark:text-white/90 dark:hover:bg-gray-700"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}

      {/* Hint Text */}
      {hint && (
        <p
          className={`mt-1.5 text-xs ${
            error ? 'text-error-500' : 'text-gray-500'
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default AutocompleteInput;
