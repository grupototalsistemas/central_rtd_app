import { responseEletronica } from '@/types/eletronica.type';
import api from './api';

const getEletronicas = async (
  id_pessoa_juridica: number = 119,
  data_inicial: string,
  data_final: string
): Promise<responseEletronica[]> => {
  const fakeJuridica = 119; // Substitua pelo ID real da pessoa jurídica
  const fakeDataInicial = '2026-04-01';
  const fakeDataFinal = '2026-04-30';
  const response = await api.post(`/eletronica/titulos`, {
    id_pessoa_juridica: fakeJuridica,
    data_inicial: fakeDataInicial,
    data_final: fakeDataFinal,
  });

  return response.data;
};

export const EletronicaService = {
  getEletronicas,
};
