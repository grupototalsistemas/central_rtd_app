'use client';

import { useEffect, useState } from 'react';

// Componentes
import PageTitle from '@/components/page/PageTitle';
import CardContainer from '@/components/card/CardContainer';
import CustomButton from '@/components/buttons/CustomButton';
import { Ecartorio } from '@/components/operadores/ecartorio';
import { Onrtdpj } from '@/components/operadores/onrtdpj';
import { Rtdbrasil } from '@/components/operadores/rtdbrasil';
import { loadOperadorMockPayload } from '@/components/operadores/operadoresConfig';
import type {
  OperadorComponentProps,
  OperadorId,
  OperadorPayload,
} from '@/components/operadores/types';

// Definição dos operadores disponíveis na página de eletrônica
type OperadorDefinition = {
  label: string;
  component: React.ComponentType<OperadorComponentProps>;
};

// Definição dos operadores e seus componentes correspondentes
const OPERADORES = {
  ecartorio: {
    label: 'e-Cartório',
    component: Ecartorio,
  },
  onrtdpj: {
    label: 'ONRTDPJ',
    component: Onrtdpj,
  },
  rtdbrasil: {
    label: 'RTDBRASIL',
    component: Rtdbrasil,
  },
} satisfies Record<OperadorId, OperadorDefinition>;

// Lista de IDs dos operadores para facilitar a renderização dos botões
const OPERADOR_IDS = Object.keys(OPERADORES) as OperadorId[];


export default function EletronicaPage() {
  const [operadorAtivo, setOperadorAtivo] = useState<OperadorId>('ecartorio');
  const [payloadPorOperador, setPayloadPorOperador] = useState<
    Partial<Record<OperadorId, OperadorPayload[]>>
  >({});

  useEffect(() => {
    let isMounted = true;

    if (payloadPorOperador[operadorAtivo] !== undefined) {
      return;
    }

    const loadPayload = async () => {
      const payload = await loadOperadorMockPayload(operadorAtivo);

      if (!isMounted) {
        return;
      }

      setPayloadPorOperador((estadoAtual) => ({
        ...estadoAtual,
        [operadorAtivo]: payload,
      }));
    };

    void loadPayload();

    return () => {
      isMounted = false;
    };
  }, [operadorAtivo, payloadPorOperador]);

  const operadorAtivoDefinition = OPERADORES[operadorAtivo];
  const OperadorAtivoComponent = operadorAtivoDefinition.component;
  const payloadOperadorAtivo = payloadPorOperador[operadorAtivo] ?? [];

  return (
    <PageTitle title="Eletrônica" description="Lançamentos">
      <CardContainer title="Entradas" columns={1}>
        <div className="flex-start mb-2 flex gap-4">
          {/* Renderização dos botões para cada operador específico.  */}
          {OPERADOR_IDS.map((id) => (
            <CustomButton
              size="lg"
              key={id}
              title={OPERADORES[id].label}
              onClick={() => setOperadorAtivo(id)}
              isActive={operadorAtivo === id}
              className="w-fit"
            />
          ))}
        </div>

        {/* Renderiza o componente ativo */}
        <OperadorAtivoComponent payload={payloadOperadorAtivo} />
      </CardContainer>
    </PageTitle>
  );
}
