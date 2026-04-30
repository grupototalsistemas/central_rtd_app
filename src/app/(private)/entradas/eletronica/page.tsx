'use client';

import { useMemo, useState } from 'react';

// Componentes
import CustomButton from '@/components/buttons/CustomButton';
import CardContainer from '@/components/card/CardContainer';
import { Ecartorio } from '@/components/operadores/ecartorio';
import { Onrtdpj } from '@/components/operadores/onrtdpj';
import { Rtdbrasil } from '@/components/operadores/rtdbrasil';
import type {
  OperadorComponentProps,
  OperadorId,
  OperadorPayload,
} from '@/components/operadores/types';
import PageTitle from '@/components/page/PageTitle';
import { RootState } from '@/store/rootReducer';
import { fonteEletronica } from '@/types/eletronica.type';
import { useSelector } from 'react-redux';
// Services

// Definição dos operadores disponíveis na página de eletrônica
type OperadorDefinition = {
  label: string;
  component: React.ComponentType<OperadorComponentProps>;
  fonte: fonteEletronica;
};

// Definição dos operadores e seus componentes correspondentes
const OPERADORES = {
  ecartorio: {
    label: 'e-Cartório',
    component: Ecartorio,
    fonte: fonteEletronica.ECARTORIO,
  },
  onrtdpj: {
    label: 'ONRTDPJ',
    component: Onrtdpj,
    fonte: fonteEletronica.ONRTDPJ,
  },
  rtdbrasil: {
    label: 'RTDBRASIL',
    component: Rtdbrasil,
    fonte: fonteEletronica.RTDBRASIL,
  },
} satisfies Record<OperadorId, OperadorDefinition>;

// Lista de IDs dos operadores para facilitar a renderização dos botões
const OPERADOR_IDS = Object.keys(OPERADORES) as OperadorId[];

export default function EletronicaPage() {
  const [operadorAtivo, setOperadorAtivo] = useState<OperadorId>('ecartorio');

  const { entradas } = useSelector((state: RootState) => state.eletronica);

  const payloadOperadorAtivo = useMemo(
    () =>
      entradas
        .filter((e) => e.fonte === OPERADORES[operadorAtivo].fonte)
        .map((e) => e as unknown as OperadorPayload),
    [entradas, operadorAtivo]
  );

  const operadorAtivoDefinition = OPERADORES[operadorAtivo];
  const OperadorAtivoComponent = operadorAtivoDefinition.component;

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
