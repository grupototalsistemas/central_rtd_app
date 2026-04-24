'use client';

import { useState } from 'react';
import CustomSelectGrid, { SelectGridValue } from '../inputs/CustomSelectGrid';
import CustomButton from '../buttons/CustomButton';
import { useModalManager } from '@/context/ModalManagerContext';
import CustomInput from '../inputs/CustomInput';

interface EntradaEletronica extends Record<string, unknown> {
  id: number;
  solicitante: string;
  documento: string;
  matricula: string;
  data_do_pedido: string;
  protocolo_do_pedido: string;
  total: string;
  status_onr: string;
  imovel: string;
}

const entradasEletronicas: EntradaEletronica[] = [
  {
    id: 1,
    solicitante: 'José',
    documento: '12345678909',
    matricula: '123456',
    data_do_pedido: '2024-06-01',
    protocolo_do_pedido: '1234567890',
    total: 'R$ 100,00',
    status_onr: 'Em andamento',
    imovel: 'S',
  },
];

export const Ecartorio = () => {
  const { openModal } = useModalManager();

  const [selectedTabelaValues, setSelectedTabelaValues] = useState<
    SelectGridValue[]
  >([]);

  const [selectedTabelaRows, setSelectedTabelaRows] = useState<
    EntradaEletronica[]
  >([]);

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
      title: [`Detalhes da Entrada`],
      confirmLabel: 'Fechar',
      showCloseButton: true,
      className: 'max-h-[90vh] max-w-[min(96vw,1280px)] overflow-auto custom-scrollbar',
      renderContent: () => (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <CustomInput label="Documento" value={row.documento} disabled />
            <CustomInput label="Matrícula" value={row.matricula} disabled />
            <CustomInput
              label="Data do Pedido"
              value={row.data_do_pedido}
              disabled
            />
            <CustomInput
              label="Protocolo do Pedido"
              value={row.protocolo_do_pedido}
              disabled
            />
            <CustomInput label="Total" value={row.total} disabled />
            <CustomInput label="Status ONR" value={row.status_onr} disabled />
            <CustomInput label="Imóvel" value={row.imovel} disabled />
          </div>
          <div>
            <CustomButton
              title="Importar"
              onClick={() => {}}
              className="w-fit justify-self-end"
            />
          </div>
        </div>
      ),
    });
  };

  return (
    <>
      {/* Grid com as entradas eletrônicas */}
      <CustomSelectGrid
        rows={entradasEletronicas}
        maxSelected={1}
        density="compact"
        roundedClassName="rounded-xl"
        maxHeightClassName="max-h-56 min-h-56"
        scrollViewportClassName="custom-scrollbar"
        tableClassName="min-w-[860px]"
        onChange={(values, rows) => {
          setSelectedTabelaValues(values);
          setSelectedTabelaRows(rows);
        }}
        columns={[
          {
            key: 'id',
            header: '#',
            // align: 'center',
            widthClassName: 'w-10',
          },
          {
            key: 'solicitante',
            header: 'Solicitante / Instituição',
            align: 'center',
            widthClassName: 'w-32',
          },
          {
            key: 'documento',
            header: 'Documento',
            align: 'center',
            widthClassName: 'w-32',
          },
          {
            key: 'matricula',
            header: 'Matrícula',
            align: 'center',
            widthClassName: 'w-32',
          },
          {
            key: 'data_do_pedido',
            header: 'Data do Pedido',
            align: 'center',
            widthClassName: 'w-32',
          },
          {
            key: 'protocolo_do_pedido',
            header: 'Protocolo do Pedido',
            align: 'center',
            widthClassName: 'w-32',
          },
        ]}
      />
      {/* Botão de detalhes das entradas */}
      <CustomButton
        disabled={selectedTabelaValues.length === 0}
        size="lg"
        title="Detalhes"
        onClick={() => {
          handleDetalhesClick();
        }}
        className="w-fit justify-self-end"
      />
    </>
  );
};
