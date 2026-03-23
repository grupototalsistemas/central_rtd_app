'use client'

import React from 'react'

interface Option {
  value: string
  label: string
}

interface CustomSelectProps {
  value: string
  onChange: (value: string) => void
  options: Option[]
  placeholder?: string
  className?: string
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
  className = '',
}: CustomSelectProps) {
  return (
    <select
      className={`w-full h-11 px-3 rounded-lg border border-[var(--cor-borda)] bg-[var(--cor-edit)] 
      text-[var(--cor-texto)] dark:bg-[var(--dark-cor-edit)] dark:text-[var(--dark-cor-texto)]
      focus:outline-none focus:border-[var(--cor-button-hover)] dark:focus:border-[var(--dark-cor-button-hover)] text-sm ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {placeholder && (
        <option value="" disabled hidden>
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
