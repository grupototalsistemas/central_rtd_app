import { UsuarioEmpresas } from '@/types/usuario';
import api from './api';

const getPessoasUsuariosEmpresas = async (
  id_pessoa_usuario: string
): Promise<UsuarioEmpresas[]> => {
  const response = await api.get(
    `/pessoas-usuarios/empresas/${id_pessoa_usuario}`
  );
  return response.data;
};

export const UsuariosEmpresas = {
  getPessoasUsuariosEmpresas,
};
