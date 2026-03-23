'use client';

import React, { FC, useEffect, useRef, useState } from 'react';

interface ShortcutKeyInputProps {
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: (shortcut: string) => void;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  hint?: string;
}

const ShortcutKeyInput: FC<ShortcutKeyInputProps> = ({
  id,
  name,
  placeholder = 'Clique e pressione as teclas desejadas, confirme com Enter...',
  value = '',
  onChange,
  className = '',
  disabled = false,
  error = false,
  hint,
}) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentShortcut, setCurrentShortcut] = useState(value);
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentShortcut(value);
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isCapturing || disabled) return;

    e.preventDefault();
    e.stopPropagation();

    // Se Enter foi pressionado, finaliza a captura
    if (e.key === 'Enter') {
      const keys: string[] = [];

      // Adiciona modificadores
      if (keysPressed.has('Control')) keys.push('Ctrl');
      if (keysPressed.has('Shift')) keys.push('Shift');
      if (keysPressed.has('Alt')) keys.push('Alt');
      if (keysPressed.has('Meta')) keys.push('Meta');

      // Adiciona outras teclas (exceto Enter e modificadores)
      keysPressed.forEach((key) => {
        if (!['Control', 'Shift', 'Alt', 'Meta', 'Enter'].includes(key)) {
          keys.push(key);
        }
      });

      const shortcut = keys.join('+');

      if (keys.length > 0) {
        setCurrentShortcut(shortcut);
        onChange?.(shortcut);
      }

      setIsCapturing(false);
      setKeysPressed(new Set());
      inputRef.current?.blur();
      return;
    }

    // Adiciona a tecla ao conjunto de teclas pressionadas
    const newKeys = new Set(keysPressed);

    // Normaliza o nome da tecla
    let keyName = e.key;
    if (keyName.length === 1) {
      keyName = keyName.toUpperCase();
    } else if (keyName.startsWith('F') && keyName.length <= 3) {
      // Teclas F1-F12
      keyName = keyName.toUpperCase();
    }

    newKeys.add(keyName);
    setKeysPressed(newKeys);

    // Monta a visualização temporária
    const displayKeys: string[] = [];
    if (newKeys.has('Control')) displayKeys.push('Ctrl');
    if (newKeys.has('Shift')) displayKeys.push('Shift');
    if (newKeys.has('Alt')) displayKeys.push('Alt');
    if (newKeys.has('Meta')) displayKeys.push('Meta');

    newKeys.forEach((key) => {
      if (!['Control', 'Shift', 'Alt', 'Meta'].includes(key)) {
        displayKeys.push(key);
      }
    });

    setCurrentShortcut(displayKeys.join('+'));
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isCapturing || disabled) return;

    e.preventDefault();
    e.stopPropagation();
  };

  const handleFocus = () => {
    if (!disabled) {
      setIsCapturing(true);
      setKeysPressed(new Set());
      setCurrentShortcut('');
    }
  };

  const handleBlur = () => {
    setIsCapturing(false);
    setKeysPressed(new Set());
    // Restaura o valor original se não confirmou
    if (isCapturing) {
      setCurrentShortcut(value);
    }
  };

  const handleClear = () => {
    setCurrentShortcut('');
    onChange?.('');
    setKeysPressed(new Set());
  };

  let inputClasses = `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${className}`;

  if (disabled) {
    inputClasses += ` text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
  } else if (error) {
    inputClasses += ` text-error-800 border-error-500 focus:ring-3 focus:ring-error-500/10 dark:text-error-400 dark:border-error-500`;
  } else {
    inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 ${
      isCapturing ? 'ring-3 ring-brand-500/30' : ''
    }`;
  }

  return (
    <div className="relative">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          id={id}
          name={name}
          placeholder={placeholder}
          value={currentShortcut}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          readOnly
          className={inputClasses}
        />
        {currentShortcut && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="h-11 rounded-lg border border-gray-300 px-3 text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            ✕
          </button>
        )}
      </div>

      {isCapturing && (
        <p className="text-brand-500 mt-1.5 animate-pulse text-xs">
          Pressione as teclas desejadas e confirme com Enter...
        </p>
      )}

      {hint && !isCapturing && (
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

export default ShortcutKeyInput;
