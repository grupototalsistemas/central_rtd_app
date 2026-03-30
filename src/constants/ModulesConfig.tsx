import { CalenderIcon, Finance, TableIcon } from '@/icons';

import React from 'react';

/**
 * Tipo para configuração de um item de navegação
 */
export type NavigationItem = {
  /** Nome exibido no menu */
  name: string;
  /** Ícone do menu */
  icon: React.ReactNode;
  /** Caminho da rota (para itens sem submenu) */
  path?: string;
  /** Nome do componente na API de permissões (ex: 'DASHBOARDPAGE') */
  componentName: string;
  /** Nome do formulário/página na API (ex: 'DASHBOARDFORM') */
  formName: string;
  /** Subitens (se houver) */
  subItems?: NavigationSubItem[];
};

export type NavigationSubItem = {
  name: string;
  path: string;
  componentName: string;
  formName: string;
  subItems?: NavigationSubItem[];
};

/**
 * Configuração de módulos do sistema
 * Cada módulo mapeia para as permissões vindas da API
 */
export const MODULES_CONFIG: NavigationItem[] = [
  {
    name: 'Dashboard',
    icon: <TableIcon />,
    path: '/dashboard',
    componentName: 'DASHBOARDPAGE', // Corresponde ao component_name da API
    formName: 'DASHBOARDFORM', // Corresponde ao name_form_page da API
  },
  // Adicione outros módulos seguindo o mesmo padrão
  // Exemplo:
  {
    name: 'Lançamentos',
    icon: <Finance />,
    path: '/lancamentos',
    componentName: 'LANCAMENTOPAGE',
    formName: 'LANCAMENTOFORM',
    subItems: [
      {
        name: 'Analítico',
        path: '/lancamentos/analitico',
        componentName: 'LANCAMENTOPAGE',
        formName: 'LANCAMENTOFORM',
      },
      {
        name: 'Sintético',
        path: '/lancamentos/sintetico',
        componentName: 'LANCAMENTOPAGE',
        formName: 'LANCAMENTOFORM',
      },
      {
        name: 'Custas',
        path: '/lancamentos/custas',
        componentName: 'LANCAMENTOPAGE',
        formName: 'LANCAMENTOFORM',
      },
    ],
  },
  {
    name: 'Folha de Pagamento',
    icon: <CalenderIcon />,
    path: '/folha-de-pagamento',
    componentName: 'FOLHAPAGAMENTOBUTTON',
    formName: 'LANCAMENTOFORM',
  },
];
