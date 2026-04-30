'use client';

import SignInForm from '@/components/auth/SignInForm';
import { login } from '@/service/auth.service';
import { fetchDadosEletronica } from '@/store/slices/eletronicaSlice';
import { setModulosPerfilPermissoes } from '@/store/slices/perfilPermissaoSlice';
import { setLogado, setPessoaUsuario } from '@/store/slices/usuarioSlice';
import { AppDispatch } from '@/store/store';
import { PessoaUsuario } from '@/types/usuario';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = async (loginInput: string, senhaInput: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await login({ login: loginInput, senha: senhaInput });
      dispatch(setLogado(true));
      dispatch(setPessoaUsuario(response.pessoa_usuario as PessoaUsuario));
      dispatch(setModulosPerfilPermissoes(response.permissoes));

      // Ja que esta logado pega os dados de entradas eletrônicas para o dashboard
      void dispatch(
        fetchDadosEletronica({
          id_pessoa_juridica: Number(
            response.pessoa_usuario.id_pessoa_juridica
          ),
          data_inicial: new Date().toISOString().split('T')[0],
          data_final: new Date().toISOString().split('T')[0],
        })
      );

      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Falha no login. Verifique seu usuario e senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SignInForm onSubmitLogin={handleLogin} error={error} loading={loading} />
  );
}
