'use client';

import { usePermissions } from '@/hooks/usePermissions';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type ProtectedPageProps = {
  children: React.ReactNode;
  /** Nome do formulário/página da API (ex: 'DASHBOARDFORM') */
  formName: string;
  /** Nome do componente da API (ex: 'DASHBOARDPAGE') */
  componentName: string;
  /** URL para redirecionar se não tiver permissão (padrão: '/') */
  redirectTo?: string;
  /** Componente customizado para exibir quando não há permissão */
  unauthorizedComponent?: React.ReactNode;
};

/**
 * Componente para proteger páginas baseado em permissões
 *
 * @example
 * ```tsx
 * export default function Dashboard() {
 *   return (
 *     <ProtectedPage
 *       formName="DASHBOARDFORM"
 *       componentName="DASHBOARDPAGE"
 *     >
 *       <div>Conteúdo do Dashboard</div>
 *     </ProtectedPage>
 *   );
 * }
 * ```
 */
export function ProtectedPage({
  children,
  formName,
  componentName,
  redirectTo = '/',
  unauthorizedComponent,
}: ProtectedPageProps) {
  const { hasAnyPagePermission } = usePermissions();
  const router = useRouter();

  // Para páginas (id_parent = -1), verifica se pelo menos UMA action está ativa
  // Só bloqueia se TODAS as actions estiverem zeradas
  // componentName pode ser usado para validações internas da página, mas não bloqueia o acesso
  const hasAccess = hasAnyPagePermission(formName);

  useEffect(() => {
    if (!hasAccess) {
      // Se não tiver componente customizado e não tiver permissão, redireciona
      if (!unauthorizedComponent) {
        router.push(redirectTo);
      }
    }
  }, [hasAccess, unauthorizedComponent, redirectTo, router]);

  // Se não tiver permissão
  if (!hasAccess) {
    // Se tiver componente customizado, exibe ele
    if (unauthorizedComponent) {
      return <>{unauthorizedComponent}</>;
    }

    // Caso contrário, não renderiza nada (vai redirecionar)
    return null;
  }

  // Se tiver permissão, renderiza o conteúdo
  return <>{children}</>;
}

/**
 * Componente para proteger seções/componentes específicos de uma página
 *
 * @example
 * ```tsx
 * <ProtectedComponent componentName="SALDOCARD">
 *   <CardSaldo />
 * </ProtectedComponent>
 * ```
 */
export function ProtectedComponent({
  children,
  componentName,
  action = 'search',
  fallback,
}: {
  children: React.ReactNode;
  /** Nome do componente da API (ex: 'SALDOCARD') */
  componentName: string;
  /** Ação a verificar (padrão: 'search' para visualização) */
  action?: 'insert' | 'update' | 'search' | 'delete' | 'print';
  /** Componente a ser exibido quando não há permissão */
  fallback?: React.ReactNode;
}) {
  const { hasPermission } = usePermissions();

  // Verifica a action específica (por padrão action_print para visualização)
  if (!hasPermission(componentName, action)) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}

/**
 * Componente para proteger ações (botões, links, etc)
 *
 * @example
 * ```tsx
 * <ProtectedAction
 *   componentName="NOVOLANCAMENTOBUTTON"
 *   action="insert"
 * >
 *   <button>Novo Lançamento</button>
 * </ProtectedAction>
 * ```
 */
export function ProtectedAction({
  children,
  componentName,
  action,
  fallback,
}: {
  children: React.ReactNode;
  /** Nome do componente da API */
  componentName: string;
  /** Tipo de ação a verificar */
  action: 'insert' | 'update' | 'search' | 'delete' | 'print';
  /** Componente a ser exibido quando não há permissão */
  fallback?: React.ReactNode;
}) {
  const { hasAction } = usePermissions();

  if (!hasAction(componentName, action)) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}

/**
 * Componente para proteger/mascarar valores sensíveis baseado em permissões
 * Quando não há permissão, o valor é exibido como asteriscos (como senhas)
 *
 * @example
 * ```tsx
 * <ProtectedValue
 *   componentName="SALDOVALUE"
 *   value={formatCurrency(1500.00)}
 * />
 *
 * // Com customização do placeholder
 * <ProtectedValue
 *   componentName="SALDOVALUE"
 *   value={formatCurrency(1500.00)}
 *   maskedValue="R$ ****"
 *   maskCharacter="•"
 *   maskLength={8}
 * />
 * ```
 */
export function ProtectedValue({
  value,
  componentName,
  action = 'search',
  maskedValue,
  maskCharacter = '*',
  maskLength = 6,
  className,
}: {
  /** Valor a ser exibido quando há permissão */
  value: React.ReactNode;
  /** Nome do componente da API (ex: 'SALDOVALUE') */
  componentName: string;
  /** Ação a verificar (padrão: 'search' para visualização) */
  action?: 'insert' | 'update' | 'search' | 'delete' | 'print';
  /** Valor customizado para exibir quando mascarado (sobrescreve maskCharacter e maskLength) */
  maskedValue?: string;
  /** Caractere usado para mascarar o valor (padrão: '•') */
  maskCharacter?: string;
  /** Quantidade de caracteres da máscara (padrão: 6) */
  maskLength?: number;
  /** Classes CSS adicionais para o span do valor mascarado */
  className?: string;
}) {
  const { hasPermission } = usePermissions();

  // Verifica a action específica (por padrão action_search para visualização)
  const hasAccess = hasPermission(componentName, action);

  if (!hasAccess) {
    const displayMask = maskedValue || maskCharacter.repeat(maskLength);
    return (
      <span className={className} title="Valor oculto - sem permissão">
        {displayMask}
      </span>
    );
  }

  return <>{value}</>;
}
