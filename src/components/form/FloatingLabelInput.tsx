// components/ui/form/FloatingLabelInput.tsx

'use client';

import { useState } from 'react';

interface FloatingLabelInputProps {
  name: string;
  type?: string;
  placeholder?: string;
  labelText?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isDisabled?: boolean;
  isVisible?: boolean;
  icon?: React.ReactNode;
  extraRight?: React.ReactNode;
  layout?: string;
}

const inputCls =
  'w-full border border-transparent rounded px-3 py-2 bg-[var(--cor-edit)] text-[var(--cor-texto)] dark:bg-[var(--dark-cor-edit)] dark:text-[var(--dark-cor-texto)] focus:outline-none focus:border-[var(--cor-button-hover)] dark:focus:border-[var(--dark-cor-button-hover)] uppercase';

export const FloatingLabelInput = ({
  name,
  type = 'text',
  placeholder = '',
  labelText,
  value = '',
  onChange,
  isDisabled,
  isVisible = true,
  icon,
  extraRight,
  layout = '',
}: FloatingLabelInputProps) => {
  const [focused, setFocused] = useState(false);
  if (!isVisible) return null;

  const floated = focused || !!value;

  return (
    <div className="relative mb-4 w-full">
      {/* Ícone */}
      {icon && (
        <div className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
          {icon}
        </div>
      )}

      {/* Label */}
      <label
        htmlFor={name}
        className={`pointer-events-none absolute px-1 transition-all duration-200 ${
          floated
            ? 'dark -top-2 left-3 rounded-2xl bg-[var(--cor-edit)] text-xs text-[var(--cor-texto)]'
            : `${icon ? 'left-10' : 'left-3'} top-2 text-[var(--cor-texto)]/60 dark:text-[var(--dark-cor-texto)]/60`
        } }`}
      >
        {labelText ?? placeholder}
      </label>

      {/* Input */}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={isDisabled}
        className={`${inputCls} ${icon ? 'pl-10' : 'pl-3'} ${extraRight ? 'pr-12' : ''} ${layout}`}
        placeholder=""
        aria-label={labelText ?? placeholder}
        autoComplete="off"
      />

      {extraRight}
    </div>
  );
};

export default FloatingLabelInput;
