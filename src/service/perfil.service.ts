import api from './api';

const getPerfis = async (id_pessoa_juridica: string): Promise<any[]> => {
  const response = await api.get(
    `/pessoas-juridicas-perfis/pessoa-juridica/${id_pessoa_juridica}`
  );
  return response.data;
};

export const PerfilService = {
  getPerfis,
};
