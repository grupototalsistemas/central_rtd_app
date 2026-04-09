'use client';
// import { useAuthorizedNavigation } from '@/hooks/useAuthorizedNavigation';
import { RootState } from '@/store/rootReducer';
import { LifebuoyIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSidebar } from '../context/SidebarContext';
import {
  ChevronDownIcon,
  FileIcon,
  Finance,
  PencilIcon,
  Settings,
  TableIcon,
  UserIcon,
  XmlFolderIcon,
} from '../icons/index';
import { SidebarAnimatedContainer } from './SidebarAnimatedContainer';
import { SidebarSubItem } from './SidebarSubItem';

type NavSubItem = {
  name: string;
  path: string;
  subItems?: NavSubItem[];
};

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: NavSubItem[];
};

// Define os itens do menu de navegação da sidebar
// NOTA: Futuramente, estes itens podem ser dinâmicos baseados em permissões
// usando o hook useAuthorizedNavigation quando a integração for restaurada
const navItems: NavItem[] = [
  {
    icon: <TableIcon />,
    name: 'Dashboard',
    path: '/dashboard',
  },
  {
    icon: <Finance />,
    name: 'Entradas',
    path: '', // Item pai sem rota direta (funciona apenas como grupo de submenus)
    subItems: [
      {
        name: 'Balcão',
        path: '/entradas/balcao',
      },
      {
        name: 'Eletrônica',
        path: '/entradas/eletronica',
      },
    ],
  },
  {
    icon: <Settings />,
    name: 'Configurações',
    path: '',
    subItems: [
      {
        name: 'Usuário',
        path: '/usuario',
      },
      {
        name: 'Suporte',
        path: '/suporte',
      },
    ],
  },
];

const AppSidebar: React.FC = () => {
  // PRÓXIMAS MELHORIAS: Descomentar para integrações futuras
  // const { modulosPaginas } = useSelector((state: RootState) => state.modulo);
  // const { pessoa_usuario } = useSelector((state: RootState) => state.usuario);

  // TODO: Restaurar o hook useAuthorizedNavigation para obter itens dinâmicos baseados em permissões
  // const { authorizedItems } = useAuthorizedNavigation();
  // Se habilitado, substituir 'navItems' por 'authorizedItems' nas renderizações abaixo

  // CÓDIGO LEGADO: Itens antigos comentados para compatibilidade (remova após migração completa)
  // const legacyNavItems: NavItem[] = [
  //     // { icon: <TableIcon />, name: 'Dashboard', path: '/dashboard' },
  //     /* { icon: <UserCircleIcon />, name: 'Pessoas', path: '/cadastro/pessoas' }, */
  //     // { icon: <Finance />, name: 'Lançamentos', path: '/lancamentos' },
  //     {
  //       icon: <PencilIcon />,
  //       name: 'Cadastros',
  //       subItems: [
  //         ...(pessoa_usuario?.id_pessoa_juridica_perfil === '2' ||
  //         pessoa_usuario?.id_pessoa_juridica_perfil === '1'
  //           ? [{ name: 'Cartório', path: '/cadastro/cartoriosAdmin' }]
  //           : []),
  //         { name: 'Funcionários', path: '/cadastro/funcionarios' },
  //         { name: 'Fornecedores', path: '/cadastro/fornecedores' },
  //         { name: 'Contas Bancárias', path: '/cadastro/contas-bancarias' },
  //         { name: 'Planos de Contas', path: '/cadastro/plano-contas' },
  //         { name: 'Subplanos de Contas', path: '/cadastro/plano-sub-contas' },
  //       ],
  //     },
  //     ...(pessoa_usuario?.id_pessoa_juridica_perfil === '1'
  //       ? [
  //           {
  //             icon: <UserIcon />,
  //             name: 'Master',
  //             subItems: [
  //               { name: 'Cartórios', path: '/cadastro/cartorios' },
  //               { name: 'Perfis', path: '/cadastro/perfis' },
  //               { name: 'Módulos', path: '/cadastro/modulos' },
  //               { name: 'Permissões', path: '/cadastro/permissoes' },
  //             ],
  //           },
  //         ]
  //       : []),
  //     // {
  //     //   icon: <FileIcon />,
  //     //   name: 'Gerar Xml',
  //     //   subItems: [
  //     //     {
  //     //       name: 'Folha de Pagamento',
  //     //       path: '/impressoes/funcionarios-folha',
  //     //     },
  //     //   ],
  //     // },
  //     ...(Number(pessoa_usuario?.id_pessoa_juridica_perfil) <= 2
  //       ? [
  //           {
  //             icon: <XmlFolderIcon />,
  //             name: 'Lade',
  //             subItems: [
  //               { name: 'Gerar', path: '/xml/download' },
  //               // { name: 'Importar', path: '/xml/upload' },
  //             ],
  //           },
  //         ]
  //       : []),
  //     ...(Number(pessoa_usuario?.id_pessoa_juridica_perfil) <= 2
  //       ? [
  //           {
  //             icon: <FileIcon />,
  //             name: 'Relatórios',
  //             path: '/relatorios',
  //           },
  //         ]
  //       : []),
  //     {
  //       icon: <Settings />,
  //       name: 'Configurações',
  //       subItems: [
  //         { name: 'Configurações Gerais', path: '/config' },
  //         ...(pessoa_usuario?.id_pessoa_juridica_perfil === '1'
  //           ? [{ name: 'Alíquotas', path: '/aliquotas' }]
  //           : []),
  //         { name: 'Parâmetros', path: '/preferencias' },
  //         { name: 'Listar Usuario', path: '/usuarios' },
  //         // { name: 'Gerenciar Contas', path: '/gerenciar-contas' },
  //         // { name: 'Gerenciar Permissões', path: '/gerenciar-permissoes' },
  //         // { name: 'Gerenciar Módulos', path: '/gerenciar-modulos' },
  //       ],
  //     },
  //   ],
  // ];

  // Contexto da sidebar para gerenciar expansão, mobile e hover
  const {
    isExpanded,
    isMobileOpen,
    isHovered,
    setIsHovered,
    toggleMobileSidebar,
  } = useSidebar();

  // Obtém a rota atual do navegador para destacar itens ativos
  const pathname = usePathname();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: string;
    index: number;
  } | null>(null);
  const [openNestedSubmenus, setOpenNestedSubmenus] = useState<
    Record<string, boolean>
  >({});

  const isActive = useCallback(
    (path: string) => {
      if (path === '/') return pathname === '/';
      return pathname === path || pathname.startsWith(path + '/');
    },
    [pathname]
  );

  // useEffect(() => {
  //   if (modulosPaginas.length > 0) return;
  //   getPaginas(String(GerencialConstants.id_sistema));
  // }, [modulosPaginas]);

  // const getPaginas = async (sistemaId: string) => {

  // };

  // Abre automaticamente o submenu quando a rota atual corresponde a um item interno
  useEffect(() => {
    let submenuMatched = false;

    navItems.forEach((nav, index) => {
      if (nav.subItems) {
        // Função recursiva para buscar se há algum item ativo nos submenus
        const search = (items: NavSubItem[]): boolean => {
          return items.some((item) => {
            if (isActive(item.path)) return true;
            if (item.subItems) return search(item.subItems);
            return false;
          });
        };

        if (search(nav.subItems)) {
          setOpenSubmenu({ type: 'main', index });
          submenuMatched = true;
        }
      }
    });

    if (!submenuMatched) setOpenSubmenu(null);
  }, [pathname, isActive]);

  // Alterna o estado de abertura/fechamento de um submenu
  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu((prev) => {
      // Se já está aberto, fecha; caso contrário, abre
      const isSame = prev && prev.index === index;
      return isSame ? null : { type: 'main', index };
    });
  };

  const toggleNestedSubmenu = (key: string) => {
    setOpenNestedSubmenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleCloseSidebar = () => {
    toggleMobileSidebar();
  };

  const isSidebarExpandedState = isExpanded || isHovered || isMobileOpen;

  const renderSubItems = (subItems: NavSubItem[], parentKey = '') => (
    <ul className="ml-4 space-y-1">
      {subItems.map((item) => (
        <SidebarSubItem
          key={`${parentKey}/${item.name}`}
          item={item}
          parentKey={parentKey}
          isActive={isActive}
          openNestedSubmenus={openNestedSubmenus}
          toggleNestedSubmenu={toggleNestedSubmenu}
          renderSubItems={renderSubItems}
        />
      ))}
    </ul>
  );

  // Renderiza os itens do menu principal
  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => {
        // Verifica se o item (ou algum de seus subitens) está ativo
        const isParentActive = nav.path
          ? isActive(nav.path)
          : nav.subItems?.some((s) => isActive(s.path));

        // Classes compartilhadas para estilo do item de menu
        const sharedClasses = `menu-item group flex items-center w-full px-3 py-2 rounded-md transition-colors ${
          isParentActive ? 'menu-item-active' : 'menu-item-inactive'
        } ${!isExpanded && !isHovered && !isMobileOpen ? 'justify-center' : 'justify-start'}`;

        // Classes para o ícone do menu
        const iconWrapperClass = `flex items-center justify-center w-6 h-6 ${
          isParentActive ? 'menu-item-icon-active' : 'menu-item-icon-inactive'
        }`;

        return (
          <li key={nav.name}>
            {/* Se tem subitens, renderiza como botão expansível; caso contrário, como link */}
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index)}
                className={sharedClasses}
              >
                <span className={iconWrapperClass}>{nav.icon}</span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <>
                    <span className="menu-item-text ml-3">{nav.name}</span>
                    {/* Ícone de seta que rotaciona quando o submenu está aberto */}
                    <ChevronDownIcon
                      className={`ml-auto h-5 w-5 transition-transform duration-200 ${
                        openSubmenu?.index === index ? 'rotate-180' : ''
                      }`}
                    />
                  </>
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  href={nav.path}
                  className={sharedClasses}
                  onClick={() => {
                    // Fecha o sidebar em mobile ao clicar em um link
                    if (isMobileOpen) {
                      handleCloseSidebar();
                    }
                  }}
                >
                  <span className={iconWrapperClass}>{nav.icon}</span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text ml-3">{nav.name}</span>
                  )}
                </Link>
              )
            )}

            {/* Renderiza o submenu com animação quando visível e aberto */}
            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <SidebarAnimatedContainer
                isOpen={openSubmenu?.index === index}
                menuKey={`main-${index}`}
              >
                <div className="mt-2 ml-9 pb-2">
                  {renderSubItems(nav.subItems)}
                </div>
              </SidebarAnimatedContainer>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`sidebar fixed top-0 left-0 z-100 flex h-screen flex-col transition-all duration-300 ease-in-out ${isExpanded || isMobileOpen ? 'w-[290px]' : isHovered ? 'w-[290px]' : 'w-[90px]'} ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo / título */}
      <div
        className={`flex items-center py-8 ${
          !isExpanded && !isHovered && !isMobileOpen
            ? 'lg:justify-center'
            : 'justify-between'
        }`}
      >
        <Link href="/" className="block">
          <h1
            className={`sidebar-title hidden text-4xl text-(--chrome-text) md:block dark:text-(--dark-chrome-text) ${
              isSidebarExpandedState ? 'w-[215px]' : 'w-[72px]'
            }`}
          >
            <span
              aria-hidden={!isSidebarExpandedState}
              className={`sidebar-title-label ${
                isSidebarExpandedState
                  ? 'sidebar-title-label-visible'
                  : 'sidebar-title-label-hidden'
              }`}
            >
              Central RTD
            </span>
            <span
              aria-hidden={isSidebarExpandedState}
              className={`sidebar-title-label ${
                isSidebarExpandedState
                  ? 'sidebar-title-label-hidden'
                  : 'sidebar-title-label-visible'
              }`}
            >
              RTD
            </span>
          </h1>
        </Link>

        {/* Botão de fechar - apenas mobile */}
        <button
          onClick={handleCloseSidebar}
          className="mr-4 flex h-10 w-10 items-center justify-center rounded-md text-(--chrome-text) transition-colors hover:bg-white/15 lg:hidden dark:text-(--dark-chrome-text) dark:hover:bg-white/10"
          aria-label="Fechar menu"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Navegação */}
      <div className="custom-scrollbar flex-1 overflow-y-auto px-2 pb-6">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 flex text-xs leading-[20px] text-(--chrome-text) uppercase dark:text-(--dark-chrome-text) ${
                  !isExpanded && !isHovered && !isMobileOpen
                    ? 'justify-center'
                    : 'justify-start'
                }`}
              ></h2>
              {/* Renderiza os itens principais do menu */}
              {renderMenuItems(navItems)}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
