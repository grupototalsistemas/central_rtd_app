import { combineReducers } from '@reduxjs/toolkit';
import UsuarioEmpresasSlice from './slices/empresasUsuarioSlice';
import PerfilPermissaoReducer from './slices/perfilPermissaoSlice';
import UsuarioReducer from './slices/usuarioSlice';

export const appReducer = combineReducers({
  perfilPermissao: PerfilPermissaoReducer,
  usuario: UsuarioReducer,
  usuarioEmpresas: UsuarioEmpresasSlice,
});

export type RootState = ReturnType<typeof appReducer>;

export const rootReducer = (
  state: RootState | undefined,
  action: any
): RootState => {
  if (action.type === 'RESET_APP') {
    return appReducer(undefined, action); // reseta tudo
  }
  return appReducer(state, action);
};
