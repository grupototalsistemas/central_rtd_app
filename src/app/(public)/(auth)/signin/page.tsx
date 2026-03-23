'use client';

import SignInForm from '@/components/auth/SignInForm';
import { login } from '@/service/auth.service';
import { setModulosPerfilPermissoes } from '@/store/slices/perfilPermissaoSlice';
import { setLogado, setPessoaUsuario } from '@/store/slices/usuarioSlice';
import { PessoaUsuario } from '@/types/usuario';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const handleLogin = async (loginInput: string, senhaInput: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await login({ login: loginInput, senha: senhaInput });
      dispatch(setLogado(true));
      dispatch(setPessoaUsuario(response.pessoa_usuario as PessoaUsuario));
      dispatch(setModulosPerfilPermissoes(response.permissoes));
      router.push('/suport');
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
