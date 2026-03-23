import { RootState } from '@/store/rootReducer';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export function usePermissions() {
  const { modulosPerfisPermissoes } = useSelector(
    (state: RootState) => state.perfilPermissao
  );

  const hasPermission = useMemo(
    () =>
      (
        componentName: string,
        action: 'insert' | 'update' | 'search' | 'delete' | 'print' = 'print'
      ) => {
        const permissao = modulosPerfisPermissoes.find(
          (p) => p.component_name?.toUpperCase() === componentName.toUpperCase()
        );
        if (!permissao) return false;
        const actionKey = `action_${action}` as keyof typeof permissao;
        return permissao[actionKey] === 1;
      },
    [modulosPerfisPermissoes]
  );

  const hasAction = hasPermission;

  const hasAnyPagePermission = useMemo(
    () => (pageName: string) => {
      const permissao = modulosPerfisPermissoes.find(
        (p) =>
          p.name_form_page?.toUpperCase() === pageName.toUpperCase() &&
          String(p.id_parent) === '-1'
      );

      if (!permissao) return false;

      return (
        permissao.action_insert === 1 ||
        permissao.action_update === 1 ||
        permissao.action_delete === 1 ||
        permissao.action_search === 1 ||
        permissao.action_print === 1
      );
    },
    [modulosPerfisPermissoes]
  );

  return {
    hasPermission,
    hasAction,
    hasAnyPagePermission,
  };
}
