'use client';
import Button from '@/components/ui/button/Button';
import { AuthService } from '@/service/auth.service';

import { setUsuario } from '@/store/slices/usuarioSlice';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import CustomSelect from '../form/Select';

type Props = {
  certificados: any[];
  handleChangeTela: (tela: number) => void;
};

export default function ListCertificates({
  certificados = [],
  handleChangeTela,
}: Props) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [certificado, setCertificado] = useState('');

  const dispatch = useDispatch();

  const router = useRouter();

  const handlesign = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setError(null); // limpa erro anterior
    setLoading(true);

    // Validação básica
    if (certificado === '') {
      setError('Preencha todos os campos obrigatórios.');
      setLoading(false);
      return;
    }

    try {
      const response = await AuthService.loginWithCertificate(certificado);
      dispatch(setUsuario(response.user));
      response && router.push('/loading'); // Redireciona para a tela de carregamento primeiro
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Erro inesperado. Tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  const mudarTela = (tela: number) => {
    handleChangeTela(tela);
  };

  const handleCertificadoFormatado = (certificados: any) => {
    return certificados.map((certificado: any) => {
      const option = {
        value: JSON.stringify(certificado), // Exemplo: certificado,
        label: certificado.subjectName,
      };
      return option;
    });
  };

  const handleCertificadoChange = (value: string) => {
    const certificado = JSON.parse(value);
    setCertificado(certificado);
  };

  return (
    <div className="flex w-full flex-1 flex-col lg:w-1/2">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="text-title-sm sm:text-title-md mb-2 font-semibold text-gray-800 dark:text-white/90">
              Login
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Utilize certificados validos para fazer login.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded bg-red-100 px-4 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handlesign} autoComplete="off" noValidate>
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-between">
                <CustomSelect
                  value=""
                  options={handleCertificadoFormatado(certificados)}
                  placeholder="Selecione o certificado"
                  onChange={(value) => handleCertificadoChange(value)}
                />
              </div>
              <div>
                <Button className="w-full" size="sm" disabled={loading}>
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
              </div>
            </div>
          </form>
          <div className="mt-5">
            <p className="text-center text-sm font-normal text-gray-700 sm:text-start dark:text-gray-400">
              Prefere entrar com login e senha?{' '}
              <button
                onClick={() => mudarTela(0)}
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Login com senha
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
