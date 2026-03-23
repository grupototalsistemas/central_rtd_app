'use client';

import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import { EyeCloseIcon, EyeIcon } from '@/icons';

import { useState } from 'react';

interface SignInFormProps {
  onSubmitLogin: (login: string, senha: string) => void;
  handleChangeTela?: (tela: number) => void;
  authMudarTela?: boolean;
  loading: boolean;
  error?: string | null;
}

export default function SignInForm({
  handleChangeTela,
  authMudarTela,
  onSubmitLogin,
  loading,
  error,
}: SignInFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handlesign = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (!login || !password) {
      return;
    }

    onSubmitLogin(login, password);
  };

  return (
    <div className="flex w-full flex-1 flex-col bg-[var(--background)] lg:w-1/2 dark:bg-[var(--dark-background)]">
      <div className="mx-auto flex flex-1 flex-col justify-center">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="text-title-sm sm:text-title-md mb-2 font-semibold text-[var(--cor-texto)] dark:text-[var(--dark-cor-texto)]">
              Login
            </h1>
            <p className="text-sm text-[var(--cor-texto)]/70 dark:text-[var(--dark-cor-texto)]/70">
              Use seu login e senha para acessar sua conta.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded bg-red-100 px-4 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handlesign} autoComplete="off" noValidate>
            <div className="space-y-6">
              <div>
                <Label>
                  Login <span className="text-error-500">*</span>
                </Label>
                <Input
                  placeholder="Ex.: exemplo@exemplo.com.br"
                  type="text"
                  value={login}
                  onChange={(e) => setLogin(e.target.value.toLowerCase())}
                  className="w-full rounded border bg-[var(--cor-edit)] px-4 py-2 text-[var(--cor-texto)] focus:border-[var(--cor-button-hover)] focus:outline-none dark:bg-[var(--dark-cor-edit)] dark:text-[var(--dark-cor-texto)] dark:focus:border-[var(--dark-cor-button-hover)]"
                />
              </div>
              <div>
                <Label>
                  Senha <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded border bg-[var(--cor-edit)] px-4 py-2 text-[var(--cor-texto)] focus:border-[var(--cor-button-hover)] focus:outline-none dark:bg-[var(--dark-cor-edit)] dark:text-[var(--dark-cor-texto)] dark:focus:border-[var(--dark-cor-button-hover)]"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-4 z-30 -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  className="w-full bg-[var(--cor-button-hover)] font-semibold text-[var(--texto-button)] uppercase hover:opacity-90 dark:bg-[var(--dark-cor-button-hover)] dark:text-[var(--dark-texto-button)]"
                  size="sm"
                  disabled={
                    loading || !login || !password || password.length < 4
                  }
                  type="submit"
                  loading={loading}
                >
                  Entrar
                </Button>
                <div className="mt-5"></div>
              </div>
            </div>
          </form>

          <div className="mt-5">
            {authMudarTela ? (
              <p className="text-center text-sm font-normal text-[var(--cor-texto)] sm:text-start dark:text-[var(--dark-cor-texto)]">
                Tentar logar com certificados?{' '}
                <button
                  onClick={() => handleChangeTela?.(1)}
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Login com certificado
                </button>
              </p>
            ) : (
              <p></p>
              // <p className="text-center text-sm font-normal text-[var(--cor-texto)] sm:text-start dark:text-[var(--dark-cor-texto)]">
              //   Você não possui um certificado válido para realizar a
              //   autenticação com certificados
              // </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
