import { ModulosPerfilPermissoes } from '@/types/perfilPermissao';
import api from './api';

interface LoginPayload {
  login: string;
  senha: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  pessoa_usuario: {
    id_pessoa_usuario: string;
    id_pessoa_juridica: string;
    id_pessoa_fisica: string;
    id_pessoa_juridica_perfil: string;
    id_sistema: string;
    juridica_principal: number;
    empresa: string;
    funcionario: string;
    usuario: string;
    login: string;
  };
  permissoes: ModulosPerfilPermissoes[];
}

export async function login({
  login,
  senha,
}: LoginPayload): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login_senha', {
    login,
    senha,
    sistema: 2,
  });
  return response.data;
}

const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

const switchCompany = async (
  id_pessoa_juridica: string,
  id_pessoa_juridica_perfil: string
) => {
  const response = await api.get(
    `/pessoas-juridicas-perfis/${id_pessoa_juridica_perfil}/modulos-permissoes?id_sistema=2&id_pessoa_juridica=${id_pessoa_juridica}`
  );
  return response.data;
};

export const AuthService = {
  login,
  logout,
  switchCompany,
};
