'use client';
import { useState } from 'react';

// Componentes
import PageTitle from '@/components/page/PageTitle';
import CardContainer from '@/components/card/CardContainer';
import CustomButton from '@/components/buttons/CustomButton';
import { Ecartorio } from '@/components/operadores/ecartorio';
import { Onrtdpj } from '@/components/operadores/onrtdpj';
import { Rtdbrasil } from '@/components/operadores/rtdbrasil';

//  Tipos de operadores para a página de eletrônica
type OperadorId = 'ecartorio' | 'onrtdpj' | 'rtdbrasil';

// Definição dos operadores disponíveis na página de eletrônica
type OperadorDefinition = {
  label: string;
  component: React.ComponentType;
};

// Definição dos operadores e seus componentes correspondentes
const OPERADORES = {
  ecartorio: { label: 'e-Cartório', component: Ecartorio },
  onrtdpj: { label: 'ONRTDPJ', component: Onrtdpj },
  rtdbrasil: { label: 'RTDBRASIL', component: Rtdbrasil },
} satisfies Record<OperadorId, OperadorDefinition>;

// Lista de IDs dos operadores para facilitar a renderização dos botões
const OPERADOR_IDS = Object.keys(OPERADORES) as OperadorId[];

export default function EletronicaPage() {
  const [operadorAtivo, setOperadorAtivo] = useState<OperadorId>('ecartorio');

  const OperadorAtivoComponent = OPERADORES[operadorAtivo].component;

  return (
    <PageTitle title="Eletrônica" description="Lançamentos">
      <CardContainer title="Entradas" columns={1}>
        
        <div className="flex-start flex gap-4 mb-2">
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
        <OperadorAtivoComponent />

      </CardContainer>
    </PageTitle>
  );
}
