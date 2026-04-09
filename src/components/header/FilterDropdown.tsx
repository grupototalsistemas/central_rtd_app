'use client';
import { ChevronDownIcon } from '@/icons';
import { useState } from 'react';
import DatePicker from '../form/date-picker';
import Label from '../form/Label';
import Select from '../form/Select';
import Button from '../ui/button/Button';
import { Dropdown } from '../ui/dropdown/Dropdown';
import { DropdownItem } from '../ui/dropdown/DropdownItem';

export default function FilterDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const statusOptions = [
    { value: 'open', label: 'Aberto' },
    { value: 'closed', label: 'Fechado' },
    { value: 'in-progress', label: 'Em andamento' },
  ];

  const sistemaOptions = [
    { value: 'sistema1', label: 'Sistema 1' },
    { value: 'sistema2', label: 'Sistema 2' },
  ];

  const responsavelOptions = [
    { value: 'user1', label: 'Usuário 1' },
    { value: 'user2', label: 'Usuário 2' },
    { value: 'user3', label: 'Usuário 3' },
  ];

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        type="button"
        className="dark:bg-brand-500/12 flex h-11 w-11 items-center justify-center rounded-full bg-white text-(--central-azul) shadow-theme-xs transition-all hover:bg-(--cor-button-hover) hover:text-(--texto-accento) hover:shadow-theme-sm dark:text-(--dark-chrome-text) dark:hover:bg-(--dark-cor-button-hover) dark:hover:text-(--dark-texto-button)"
      >
        <svg
          className="fill-white stroke-current dark:fill-gray-800"
          width="20"
          height="20"
          viewBox="0 0 20 20"
        >
          <path d="M2.29 5.9H17.7" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M17.7 14.1H2.29" strokeWidth="1.5" strokeLinecap="round" />
          <path
            d="M12.08 3.33A2.57 2.57 0 1 1 9.51 5.9a2.57 2.57 0 0 1 2.57-2.57Z"
            strokeWidth="1.5"
          />
          <path
            d="M7.92 11.52a2.57 2.57 0 1 0 2.57 2.57 2.57 2.57 0 0 0-2.57-2.57Z"
            strokeWidth="1.5"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="dark:bg-gray-dark absolute right-0 mt-3 w-[90vw] max-w-sm flex-col rounded-2xl bg-white p-4 shadow-theme-xl sm:p-5 dark:shadow-theme-xl"
      >
        {/* Cabeçalho */}
        <div className="mb-3 flex items-center justify-between pb-2">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Filtros
          </h5>
          <button
            onClick={toggleDropdown}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        {/* Campos */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DropdownItem>
            <DatePicker
              id="data-inicial"
              label="Data Inicial"
              placeholder="Selecione"
              onChange={(dates, currentDateString) =>
                console.log({ dates, currentDateString })
              }
            />
          </DropdownItem>

          <DropdownItem>
            <DatePicker
              id="data-final"
              label="Data Final"
              placeholder="Selecione"
              onChange={(dates, currentDateString) =>
                console.log({ dates, currentDateString })
              }
            />
          </DropdownItem>

          <DropdownItem>
            <Label>Responsável</Label>
            <div className="relative">
              <Select
                options={responsavelOptions}
                placeholder="Selecione"
                onChange={(v) => console.log('Responsável:', v)}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
                <ChevronDownIcon />
              </span>
            </div>
          </DropdownItem>

          <DropdownItem>
            <Label>Sistema</Label>
            <div className="relative">
              <Select
                options={sistemaOptions}
                placeholder="Selecione"
                onChange={(v) => console.log('Sistema:', v)}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
                <ChevronDownIcon />
              </span>
            </div>
          </DropdownItem>

          <DropdownItem className="sm:col-span-2">
            <Label>Status</Label>
            <div className="relative">
              <Select
                options={statusOptions}
                placeholder="Selecione"
                onChange={(v) => console.log('Status:', v)}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
                <ChevronDownIcon />
              </span>
            </div>
          </DropdownItem>
        </div>

        {/* Botão */}
        <div className="mt-4 text-right">
          <Button size="md" variant="primary">
            Aplicar Filtros
          </Button>
        </div>
      </Dropdown>
    </div>
  );
}
