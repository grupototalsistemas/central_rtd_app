'use client';

import { useState } from 'react';

import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';

interface TwoFactorAuthenticationScreenProps {
  onBackToLogin?: () => void;
}

export default function TwoFactorAuthenticationScreen({
  onBackToLogin,
}: TwoFactorAuthenticationScreenProps) {
  const [codigo, setCodigo] = useState('');

  const handleSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (!codigo.trim()) {
      return;
    }
  };

  return (
    <div className="flex w-full flex-1 flex-col bg-(--background) lg:w-1/2 dark:bg-[var(--dark-background)]">
      <div className="mx-auto flex flex-1 flex-col justify-center">
        <div>
          <button
            type="button"
            onClick={onBackToLogin}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--cor-texto)] hover:opacity-80 dark:text-[var(--dark-cor-texto)]"
          >
            <span aria-hidden="true">←</span>
            Voltar para o login
          </button>

          <div className="mb-5 sm:mb-8">
            <h1 className="text-title-sm sm:text-title-md mb-2 font-semibold text-[var(--cor-texto)] dark:text-[var(--dark-cor-texto)]">
              Autenticação
            </h1>
            <p className="text-sm text-[var(--cor-texto)]/70 dark:text-[var(--dark-cor-texto)]/70">
              Utilize o código enviado para o email cadastrado para autenticar.
            </p>
          </div>

          <form onSubmit={handleSubmit} autoComplete="off" noValidate>
            <div className="space-y-6">
              <div>
                <Label>
                  Código <span className="text-error-500">*</span>
                </Label>
                <Input
                  placeholder="Digite o código"
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  className="w-full rounded border bg-[var(--cor-edit)] px-4 py-2 text-[var(--cor-texto)] focus:border-[var(--cor-button-hover)] focus:outline-none dark:bg-[var(--dark-cor-edit)] dark:text-[var(--dark-cor-texto)] dark:focus:border-[var(--dark-cor-button-hover)]"
                />
                <div className="text-right mt-2">
                  <a href="" className="text-blue-400">
                    Reenviar código
                  </a>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  className="w-full bg-[#004a96] font-semibold text-(--texto-button) uppercase hover:opacity-80"
                  size="sm"
                  disabled={!codigo.trim()}
                  type="submit"
                >
                  AUTENTICAR
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
