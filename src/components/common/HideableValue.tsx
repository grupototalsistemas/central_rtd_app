'use client';

import React from 'react';
import { useValuesVisibility } from '../../context/ValuesVisibilityContext';

type HideableValueProps = {
  /** Valor a ser exibido */
  value: React.ReactNode;
  /** Valor customizado para exibir quando oculto (sobrescreve maskCharacter e maskLength) */
  maskedValue?: string;
  /** Caractere usado para mascarar o valor (padrão: '•') */
  maskCharacter?: string;
  /** Quantidade de caracteres da máscara (padrão: 6) */
  maskLength?: number;
  /** Classes CSS adicionais */
  className?: string;
  /** Se true, não permite esconder este valor específico (sempre visível) */
  alwaysVisible?: boolean;
};

/**
 * Componente para exibir valores que podem ser ocultados pelo usuário
 * Similar ao comportamento de apps de banco
 *
 * @example
 * ```tsx
 * // Uso básico
 * <HideableValue value={formatCurrency(1500.00)} />
 *
 * // Com máscara personalizada para valores monetários
 * <HideableValue
 *   value={formatCurrency(1500.00)}
 *   maskedValue="R$ ***,**"
 * />
 *
 * // Com caractere e tamanho personalizados
 * <HideableValue
 *   value={formatCurrency(1500.00)}
 *   maskCharacter="*"
 *   maskLength={10}
 * />
 *
 * // Valor sempre visível (não pode ser ocultado)
 * <HideableValue
 *   value="Informação pública"
 *   alwaysVisible
 * />
 * ```
 */
export function HideableValue({
  value,
  maskedValue,
  maskCharacter = '•',
  maskLength = 6,
  className,
  alwaysVisible = false,
}: HideableValueProps) {
  const { isValuesVisible } = useValuesVisibility();

  // Se alwaysVisible for true, sempre mostra o valor
  if (alwaysVisible || isValuesVisible) {
    return <>{value}</>;
  }

  const displayMask = maskedValue || maskCharacter.repeat(maskLength);

  return (
    <span className={className} title="Valor oculto">
      {displayMask}
    </span>
  );
}

/**
 * Hook para verificar se os valores estão visíveis
 * Útil quando você precisa condicionar a renderização em componentes mais complexos
 *
 * @example
 * ```tsx
 * const { isValuesVisible } = useValuesVisibility();
 *
 * return (
 *   <div>
 *     {isValuesVisible ? (
 *       <GraficoCompleto data={data} />
 *     ) : (
 *       <GraficoSemValores />
 *     )}
 *   </div>
 * );
 * ```
 */
export { useValuesVisibility } from '../../context/ValuesVisibilityContext';
