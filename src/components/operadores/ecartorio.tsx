'use client';

import { useMemo } from 'react';
import OperadorEntradasBase from './OperadorEntradasBase';
import {
  ADAPTERS,
  ENTRADAS_COLUMNS,
  ENTRADAS_DETAIL_FIELDS,
} from './operadoresConfig';
import type { OperadorComponentProps } from './types';

export const Ecartorio = ({ payload }: OperadorComponentProps) => {
  const rows = useMemo(
    () => payload.map((entry, index) => ADAPTERS.ecartorio(entry, index)),
    [payload]
  );

  return (
    <OperadorEntradasBase
      rows={rows}
      columns={ENTRADAS_COLUMNS}
      detailFields={ENTRADAS_DETAIL_FIELDS}
    />
  );
};
