'use client';

import { RootState } from '@/store/rootReducer';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredProfile?: string;
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredProfile = '1',
  fallbackPath = '/acesso-negado',
}) => {
  const { pessoa_usuario, logado } = useSelector(
    (state: RootState) => state.usuario
  );
  const router = useRouter();

  useEffect(() => {
    if (!logado) return;

    if (pessoa_usuario?.id_pessoa_juridica_perfil !== requiredProfile) {
      router.replace(fallbackPath);
    }
  }, [pessoa_usuario, logado, requiredProfile, fallbackPath, router]);

  // Se não está logado ou não tem perfil correto, não renderiza nada
  if (
    !logado ||
    pessoa_usuario?.id_pessoa_juridica_perfil !== requiredProfile
  ) {
    return null;
  }

  return <>{children}</>;
};
