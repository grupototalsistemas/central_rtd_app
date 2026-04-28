import api from './api';

const getPerfis = async (id_pessoa_juridica: string): Promise<any[]> => {
  const response = await api.get(
    `/pessoas-juridicas-perfis/pessoa-juridica/${id_pessoa_juridica}`
  );
  return response.data;
};

const getEletronicas = async (
  id_pessoa_juridica: number,
  data_inicial: string,
  data_final: string
) => {
  const response = await api.post(`/eletronica/titulos`, {
    id_pessoa_juridica,
    data_inicial,
    data_final,
  });
  return response.data;
};

export const PerfilService = {
  getPerfis,
  getEletronicas,
};
