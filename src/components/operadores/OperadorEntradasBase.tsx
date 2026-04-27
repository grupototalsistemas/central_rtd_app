'use client';

import { useState } from 'react';
import CustomSelectGrid, { SelectGridValue } from '../inputs/CustomSelectGrid';
import CustomButton from '../buttons/CustomButton';
import CustomInput from '../inputs/CustomInput';
import { useModalManager } from '@/context/ModalManagerContext';
import type { OperadorEntradasBaseProps, OperadorGridRow } from './types';

const formatFieldValue = (value: unknown): string => {
  if (typeof value === 'string') {
    return value || '-';
  }

  if (typeof value === 'number' || typeof value === 'bigint') {
    return String(value);
  }

  if (typeof value === 'boolean') {
    return value ? 'Sim' : 'Nao';
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value && typeof value === 'object') {
    return JSON.stringify(value);
  }

  return '-';
};

export default function OperadorEntradasBase<RowType extends OperadorGridRow>({
  rows,
  columns,
  detailFields,
  importButtonLabel = 'Importar',
  onImport,
}: OperadorEntradasBaseProps<RowType>) {
  const { openModal } = useModalManager();

  const [selectedTabelaValues, setSelectedTabelaValues] = useState<
    SelectGridValue[]
  >([]);

  const [selectedTabelaRows, setSelectedTabelaRows] = useState<RowType[]>([]);

  const handleDetalhesClick = async () => {
    const row = selectedTabelaRows[0];

    if (!row) {
      await openModal({
        kind: 'alert',
        title: 'Nenhuma entrada selecionada',
        description: 'Por favor, selecione uma entrada para ver os detalhes.',
        confirmLabel: 'OK',
        showCloseButton: true,
      });
      return;
    }

    await openModal({
      kind: 'custom',
      title: ['Detalhes da Entrada'],
      confirmLabel: 'Fechar',
      showCloseButton: true,
      className:
        'max-h-[90vh] max-w-[min(96vw,1280px)] overflow-auto custom-scrollbar',
      renderContent: () => (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {detailFields.map((field) => {
              const rawValue = row[field.key];
              const value = field.formatter
                ? field.formatter(rawValue, row)
                : formatFieldValue(rawValue);

              return (
                <CustomInput
                  key={field.key}
                  label={field.label}
                  value={value}
                  disabled
                />
              );
            })}
          </div>
          <div>
            <CustomButton
              title={importButtonLabel}
              onClick={() => {
                if (!onImport) {
                  return;
                }

                void onImport(row);
              }}
              className="w-fit justify-self-end"
            />
          </div>
        </div>
      ),
    });
  };

  return (
    <>
      <CustomSelectGrid
        rows={rows}
        maxSelected={1}
        density="compact"
        roundedClassName="rounded-xl"
        maxHeightClassName="max-h-56 min-h-56"
        scrollViewportClassName="custom-scrollbar"
        tableClassName="min-w-[860px]"
        onChange={(values, selectedRows) => {
          setSelectedTabelaValues(values);
          setSelectedTabelaRows(selectedRows);
        }}
        columns={columns}
      />
      <CustomButton
        disabled={selectedTabelaValues.length === 0}
        size="lg"
        title="Detalhes"
        onClick={() => {
          void handleDetalhesClick();
        }}
        className="w-fit justify-self-end"
      />
    </>
  );
}
