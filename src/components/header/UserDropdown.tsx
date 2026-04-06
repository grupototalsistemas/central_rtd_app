'use client';
import { AuthService } from '@/service/auth.service';
import { PerfilService } from '@/service/perfil.service';
import { RootState } from '@/store/rootReducer';
import { clearEmpresa } from '@/store/slices/empresasUsuarioSlice';
import { clear as clearPermissoes } from '@/store/slices/perfilPermissaoSlice';
import { clear as clearUsuario } from '@/store/slices/usuarioSlice';
import {
  ArrowLeftStartOnRectangleIcon,
  ChevronDownIcon,
  LifebuoyIcon,
  UserCircleIcon,
} from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown } from '../ui/dropdown/Dropdown';
import { DropdownItem } from '../ui/dropdown/DropdownItem';

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usuario, setUsuario] = useState('');
  const [funcionario, setFuncionario] = useState('');
  const [perfilDescricao, setPerfilDescricao] = useState('Carregando...');
  const { selectedCompany } = useSelector(
    (state: RootState) => state.usuarioEmpresas
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const { logado, pessoa_usuario } = useSelector(
    (state: RootState) => state.usuario
  );

  useEffect(() => {
    if (!logado || !pessoa_usuario) return;
    // console.log('pessoa_usuario', pessoa_usuario);
    setUsuario(pessoa_usuario.usuario);
    setFuncionario(pessoa_usuario.funcionario);
  }, [logado, pessoa_usuario]);

  useEffect(() => {
    const carregarPerfil = async () => {
      if (!pessoa_usuario || !selectedCompany) return;

      try {
        const perfis = await PerfilService.getPerfis(String(selectedCompany));
        // console.log('perfis', perfis);
        const perfil = perfis.find(
          (p) => p.id === Number(pessoa_usuario.id_pessoa_juridica_perfil)
        );
        setPerfilDescricao(perfil ? perfil.descricao : 'Perfil Desconhecido');
      } catch (err) {
        console.error('Erro ao carregar perfil:', err);
        setPerfilDescricao('Perfil Desconhecido');
      }
    };

    carregarPerfil();
  }, [pessoa_usuario, selectedCompany]);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current?.contains(e.target as Node)) return;
      setIsOpen(false);
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('click', handleOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('click', handleOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  const toggleDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    setError(null);
    setLoading(true);
    try {
      // Chama o logout na API
      await AuthService.logout();

      // Limpa todos os estados do Redux
      dispatch(clearEmpresa());
      dispatch(clearPermissoes());
      dispatch(clearUsuario());

      // Limpa localStorage
      localStorage.clear();

      // Limpa sessionStorage
      sessionStorage.clear();

      // Limpa cookies
      document.cookie.split(';').forEach((c) => {
        document.cookie = c
          .replace(/^ +/, '')
          .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
      });

      // Redireciona para a página de login
      router.push('/signin');

      // Force reload para garantir que tudo seja limpo
      setTimeout(() => {
        window.location.href = '/signin';
      }, 100);
    } catch (err: any) {
      setError('Erro ao sair. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Se não houver usuário logado, não renderiza o dropdown
  if (!logado || !pessoa_usuario) {
    return null;
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={toggleDropdown}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="flex items-center gap-2 rounded-full transition-colors hover:opacity-80 focus:outline-none"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--cor-button-hover)] text-lg font-medium text-[var(--texto-button)] dark:bg-[var(--dark-cor-button-hover)] dark:text-[var(--dark-texto-button)]">
          {usuario && usuario.length > 0
            ? usuario.charAt(0).toUpperCase()
            : funcionario && funcionario.length > 0
              ? funcionario.charAt(0).toUpperCase()
              : 'U'}
        </div>
        <ChevronDownIcon
          className={`h-5 w-5 text-[var(--cor-texto)] transition-transform duration-200 dark:text-[var(--dark-cor-texto)] ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <Dropdown
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          className="filter-dropdown shadow-theme-lg absolute right-0 z-[9999] mt-[17px] flex w-[260px] flex-col rounded-xl bg-[var(--cor-card)] transition-all dark:bg-[var(--dark-cor-card)]"
        >
          <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
            <span className="block font-medium text-[var(--cor-texto)] dark:text-[var(--dark-cor-texto)]">
              {funcionario || 'Funcionário'}
            </span>
            <span className="block text-sm text-gray-500 dark:text-gray-400">
              {perfilDescricao}
            </span>
            <span className="block text-sm text-gray-500 dark:text-gray-400">
              {pessoa_usuario.login}
            </span>
          </div>

          <ul className="mb-2 flex flex-col gap-1 border-b border-gray-200 pt-4 pb-3 dark:border-gray-700">
            <li>
              <DropdownItem
                onItemClick={() => setIsOpen(false)}
                tag="a"
                href={`/usuario`}
                className="group flex items-center gap-3 text-[var(--cor-texto)] dark:text-[var(--dark-cor-texto)]"
              >
                <UserCircleIcon className="h-5 w-5" aria-hidden="true" />
                Editar Usuario
              </DropdownItem>
            </li>
            {/* <li>
              <DropdownItem
                onItemClick={() => setIsOpen(false)}
                tag="a"
                href="/config"
                className="group flex items-center gap-3 text-[var(--cor-texto)] dark:text-[var(--dark-cor-texto)]"
              >
                <Cog6ToothIcon className="h-5 w-5" aria-hidden="true" />
                Configurações Gerais
              </DropdownItem>
            </li> */}
            <li>
              <DropdownItem
                onItemClick={() => setIsOpen(false)}
                tag="a"
                href="/suporte"
                className="group flex items-center gap-3 text-[var(--cor-texto)] dark:text-[var(--text-tooltip)]"
              >
                <LifebuoyIcon className="h-5 w-5" aria-hidden="true" />
                Suporte
              </DropdownItem>
            </li>
          </ul>

          <button
            onClick={handleLogout}
            disabled={loading}
            className="group flex items-center gap-3 px-4 py-2 text-red-600"
          >
            <ArrowLeftStartOnRectangleIcon
              className="h-5 w-5 text-red-600"
              aria-hidden="true"
            />
            {loading ? 'Saindo...' : 'Sair'}
          </button>

          {error && (
            <span className="mt-2 text-sm text-red-500 dark:text-red-400">
              {error}
            </span>
          )}
        </Dropdown>
      )}
    </div>
  );
}
