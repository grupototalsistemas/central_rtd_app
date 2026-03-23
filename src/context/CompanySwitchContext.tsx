'use client';

import { AuthService } from '@/service/auth.service';
import { RootState } from '@/store/rootReducer';
import { setSelectedCompany } from '@/store/slices/empresasUsuarioSlice';
import { setModulosPerfilPermissoes } from '@/store/slices/perfilPermissaoSlice';
import { setPessoaUsuario } from '@/store/slices/usuarioSlice';
import { AppDispatch, persistor } from '@/store/store';
import { PessoaUsuario, UsuarioEmpresas } from '@/types/usuario';
import React, { createContext, useCallback, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface CompanySwitchContextType {
  isSwitching: boolean;
  switchMessage: string;
  switchCompany: (id_pessoa_juridica: string) => Promise<boolean>;
  canSwitchCompany: boolean;
  empresas: UsuarioEmpresas[];
  selectedCompanyId: number | null;
}

const CompanySwitchContext = createContext<
  CompanySwitchContextType | undefined
>(undefined);

interface CompanySwitchProviderProps {
  children: React.ReactNode;
}

export const CompanySwitchProvider: React.FC<CompanySwitchProviderProps> = ({
  children,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isSwitching, setIsSwitching] = useState(false);
  const [switchMessage, setSwitchMessage] = useState('');

  const empresas = useSelector(
    (state: RootState) => state.usuarioEmpresas.empresas
  );
  const selectedCompanyId = useSelector(
    (state: RootState) => state.usuarioEmpresas.selectedCompany
  );

  // Só mostra o seletor se houver mais de uma empresa
  const canSwitchCompany = empresas && empresas.length > 1;

  const switchCompany = useCallback(
    async (id_pessoa_juridica: string): Promise<boolean> => {
      // Não fazer nada se já for a empresa selecionada
      if (Number(id_pessoa_juridica) === selectedCompanyId) {
        return true;
      }

      setIsSwitching(true);
      setSwitchMessage('Trocando de empresa...');

      try {
        // 1. Chamar o backend para trocar de empresa e obter as novas permissões
        setSwitchMessage('Atualizando permissões...');
        for (const empresa of empresas) {
          if (
            Number(empresa.id_pessoa_juridica) === Number(id_pessoa_juridica)
          ) {
            const response = await AuthService.switchCompany(
              id_pessoa_juridica,
              empresa.id_pessoa_juridica_perfil
            );

            // 2. Atualizar a empresa selecionada no Redux
            setSwitchMessage('Atualizando empresa selecionada...');
            dispatch(setSelectedCompany(Number(id_pessoa_juridica)));

            // 3. Atualizar as permissões no Redux com as permissões da nova empresa
            if (response.permissoes && response.permissoes.length > 0) {
              dispatch(setModulosPerfilPermissoes(response.permissoes));
            } else {
              console.warn(
                '[switchCompany] ATENÇÃO: Nenhuma permissão retornada da API!'
              );
              console.warn(
                '[switchCompany] Response keys:',
                Object.keys(response || {})
              );
            }

            // 4. Atualizar pessoa_usuario com os dados da nova empresa (incluindo o perfil)
            // Se a API retornar pessoa_usuario, usar. Caso contrário, atualizar manualmente.
            if (response.pessoa_usuario) {
              // Garantir que o id_pessoa_juridica_perfil da empresa selecionada seja usado
              const pessoaUsuarioAtualizado = {
                ...response.pessoa_usuario,
                id_pessoa_juridica: empresa.id_pessoa_juridica,
                id_pessoa_juridica_perfil: empresa.id_pessoa_juridica_perfil,
              };
              // console.log(
              //   '[switchCompany] Atualizando pessoa_usuario:',
              //   pessoaUsuarioAtualizado
              // );
              dispatch(
                setPessoaUsuario(pessoaUsuarioAtualizado as PessoaUsuario)
              );
            } else {
              // Se não retornar pessoa_usuario, atualizar manualmente o perfil
              // console.log(
              //   '[switchCompany] Atualizando perfil manualmente para:',
              //   empresa.id_pessoa_juridica_perfil
              // );
            }

            // 5. Pequeno delay para dar feedback visual
            setSwitchMessage('Recarregando dados...');
            await new Promise((resolve) => setTimeout(resolve, 500));

            // 6. Força a persistência dos dados no localStorage antes do reload
            setSwitchMessage('Persistindo permissões...');

            // Aguarda o flush completar
            await persistor.flush();

            // Força atualização manual do localStorage com as novas permissões e pessoa_usuario
            try {
              const currentPersisted = localStorage.getItem('persist:root');
              if (currentPersisted) {
                const parsed = JSON.parse(currentPersisted);

                // Atualiza a chave perfilPermissao diretamente
                parsed.perfilPermissao = JSON.stringify({
                  modulosPerfisPermissoes: response.permissoes,
                });

                // Atualiza o usuario com o perfil da nova empresa
                const currentUsuario = JSON.parse(parsed.usuario || '{}');
                const pessoaUsuarioAtualizado = {
                  ...currentUsuario.pessoa_usuario,
                  ...response.pessoa_usuario,
                  id_pessoa_juridica: empresa.id_pessoa_juridica,
                  id_pessoa_juridica_perfil: empresa.id_pessoa_juridica_perfil,
                };
                parsed.usuario = JSON.stringify({
                  ...currentUsuario,
                  pessoa_usuario: pessoaUsuarioAtualizado,
                });

                localStorage.setItem('persist:root', JSON.stringify(parsed));
                // console.log(
                //   '[switchCompany] Permissões e pessoa_usuario salvos no localStorage'
                // );
                // console.log(
                //   '[switchCompany] Novo id_pessoa_juridica_perfil:',
                //   empresa.id_pessoa_juridica_perfil
                // );
              }

              // Marca que a empresa foi trocada para evitar que hydrateUserFromSession sobrescreva as permissões
              localStorage.setItem('company_just_switched', 'true');
            } catch (e) {
              console.error(
                '[switchCompany] Erro ao salvar permissões no localStorage:',
                e
              );
            }

            // Aguarda um tempo extra para garantir que o localStorage foi atualizado
            await new Promise((resolve) => setTimeout(resolve, 200));

            // 7. Força recarregamento da página para que todos os services
            // que dependem de id_pessoa_juridica sejam recarregados
            setSwitchMessage('Finalizando...');
            window.location.reload();

            return true;
          }
        }
        // Empresa não encontrada
        setIsSwitching(false);
        return false;
      } catch (error) {
        console.error('Erro ao trocar de empresa:', error);
        setSwitchMessage('Erro ao trocar de empresa. Tente novamente.');

        // Espera um pouco antes de esconder o loading para mostrar o erro
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsSwitching(false);
        return false;
      }
    },
    [dispatch, selectedCompanyId, empresas]
  );

  return (
    <CompanySwitchContext.Provider
      value={{
        isSwitching,
        switchMessage,
        switchCompany,
        canSwitchCompany,
        empresas,
        selectedCompanyId: selectedCompanyId ?? null,
      }}
    >
      {children}
    </CompanySwitchContext.Provider>
  );
};

export const useCompanySwitch = (): CompanySwitchContextType => {
  const context = useContext(CompanySwitchContext);
  if (!context) {
    throw new Error(
      'useCompanySwitch deve ser usado dentro de um CompanySwitchProvider'
    );
  }
  return context;
};
