'use client';

import { useEffect, useMemo } from 'react';
import OperadorEntradasBase from './OperadorEntradasBase';
import {
  ADAPTERS,
  ENTRADAS_COLUMNS,
  ENTRADAS_DETAIL_FIELDS,
} from './operadoresConfig';
import type { OperadorComponentProps, OperadorPayload } from './types';
import { PerfilService } from '@/service/eletronicas.service';

const getEcartorioPayload = async (): Promise<OperadorPayload[]> => {
  // Simulação de chamada à API para obter os dados do e-Cartório
  const response = await PerfilService.getEletronicas(
    119,
    '2024-01-01',
    '2024-12-31'
  );
  return response;
};

export const Ecartorio = ({ payload }: OperadorComponentProps) => {
  const rows = useMemo(
    () => payload.map((entry, index) => ADAPTERS.ecartorio(entry, index)),
    [payload]
  );

  useEffect(() => {
    const fetchData = async () => {
      const data = await getEcartorioPayload();
      console.log('Dados do e-Cartório:', data);
    };
    fetchData();
  }, []);

  return (
    <OperadorEntradasBase
      rows={rows}
      columns={ENTRADAS_COLUMNS}
      detailFields={ENTRADAS_DETAIL_FIELDS}
    />
  );
};
