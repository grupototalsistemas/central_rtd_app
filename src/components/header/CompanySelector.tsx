'use client';

import { useCompanySwitch } from '@/context/CompanySwitchContext';
import {
  BuildingOffice2Icon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import React, { useEffect, useRef, useState } from 'react';

const CompanySelector: React.FC = () => {
  const {
    canSwitchCompany,
    empresas,
    selectedCompanyId,
    switchCompany,
    isSwitching,
  } = useCompanySwitch();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fecha o dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fecha com ESC
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Se não pode trocar de empresa (só tem uma), mostra apenas o nome
  if (!canSwitchCompany) {
    const empresaUnica = empresas[0];
    if (!empresaUnica) return null;

    return (
      <span className="ml-4 text-sm font-medium text-(--cor-texto) lg:inline-block dark:text-(--dark-cor-texto)">
        {empresaUnica.pessoaJuridica?.nome_fantasia ||
          empresaUnica.pessoaJuridica?.razao_social}
      </span>
    );
  }

  // Encontra a empresa selecionada
  const empresaSelecionada = empresas.find(
    (emp) => Number(emp.id_pessoa_juridica) === selectedCompanyId
  );

  const nomeEmpresaSelecionada =
    empresaSelecionada?.pessoaJuridica?.nome_fantasia ||
    empresaSelecionada?.pessoaJuridica?.razao_social ||
    'Selecione uma empresa';

  const handleSelectCompany = async (id_pessoa_juridica: string) => {
    if (isSwitching) return;
    setIsOpen(false);
    await switchCompany(id_pessoa_juridica);
  };

  return (
    <div className="relative ml-4" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isSwitching}
        className={`flex items-center gap-2 rounded-lg bg-(--cor-card) px-3 py-2 text-sm font-medium text-(--cor-texto) shadow-theme-xs transition-all duration-200 hover:bg-(--cor-button-hover) hover:text-(--texto-accento) hover:shadow-theme-sm dark:bg-(--dark-cor-card) dark:text-(--dark-cor-texto) dark:hover:bg-(--dark-cor-button-hover) dark:hover:text-(--dark-texto-button) ${isSwitching ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} `}
        aria-label="Selecionar empresa"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <BuildingOffice2Icon className="h-4 w-4" />
        <span className="w-full truncate">{nomeEmpresaSelecionada}</span>
        <ChevronDownIcon
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 z-50 mt-1 w-auto min-w-70 overflow-hidden rounded-lg bg-(--background) shadow-theme-lg dark:bg-(--dark-background) dark:shadow-theme-xl"
          role="listbox"
          aria-label="Lista de empresas"
        >
          <div className="max-h-75 overflow-y-auto">
            {empresas.map((empresa, index) => {
              const isSelected =
                Number(empresa.id_pessoa_juridica) === selectedCompanyId;
              const nomeEmpresa =
                empresa.pessoaJuridica?.nome_fantasia ||
                empresa.pessoaJuridica?.razao_social ||
                'Empresa sem nome';

              return (
                <button
                  key={`${empresa.id_pessoa_juridica}-${index}`}
                  onClick={() =>
                    handleSelectCompany(empresa.id_pessoa_juridica)
                  }
                  disabled={isSwitching || isSelected}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-150 ${
                    isSelected
                      ? 'bg-(--cor-button-hover) text-(--texto-accento) dark:bg-(--dark-cor-button-hover) dark:text-(--dark-texto-button)'
                      : 'text-(--cor-texto) hover:bg-(--cor-card) dark:text-(--dark-cor-texto) dark:hover:bg-(--dark-cor-card)'
                  } ${isSwitching ? 'cursor-not-allowed' : 'cursor-pointer'} `}
                  role="option"
                  aria-selected={isSelected}
                >
                  <BuildingOffice2Icon className="h-5 w-5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {nomeEmpresa}
                    </p>
                    {empresa.juridica_principal === 1 && (
                      <p className="text-xs opacity-70">
                        Principal
                      </p>
                    )}
                  </div>
                  {isSelected && (
                    <span className="rounded bg-black/40 px-2 py-0.5 text-xs dark:bg-white/20">
                      Atual
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanySelector;
