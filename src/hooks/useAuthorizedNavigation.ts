import { MODULES_CONFIG, NavigationSubItem } from '@/constants/ModulesConfig';
import { useMemo } from 'react';
import { usePermissions } from './usePermissions';

/**
 * Hook que retorna apenas os itens de navegação que o usuário tem permissão para acessar
 */
export function useAuthorizedNavigation() {
  const { hasPermission, hasAnyPagePermission } = usePermissions();

  /**
   * Filtra recursivamente os subitens baseado nas permissões
   * Verifica action_print (visualização) para cada item
   */
  const filterSubItems = (
    subItems?: NavigationSubItem[]
  ): NavigationSubItem[] | undefined => {
    if (!subItems || subItems.length === 0) return undefined;

    const filtered = subItems
      .filter((item) => hasPermission(item.componentName, 'print'))
      .map((item) => ({
        ...item,
        subItems: filterSubItems(item.subItems),
      }));

    return filtered.length > 0 ? filtered : undefined;
  };

  /**
   * Filtra os itens principais baseado nas permissões do usuário
   * Para páginas (id_parent = -1), só esconde se TODAS as actions estiverem zeradas
   */
  const authorizedItems = useMemo(() => {
    return MODULES_CONFIG.filter((item) => {
      // Para páginas, verifica se pelo menos UMA action está ativa
      // Não importa qual action, desde que uma esteja ativa
      const hasPageAccess = hasAnyPagePermission(item.formName);

      return hasPageAccess;
    }).map((item) => ({
      ...item,
      subItems: filterSubItems(item.subItems),
    }));
  }, [hasAnyPagePermission]);

  return {
    authorizedItems,
  };
}
