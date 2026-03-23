import { ModulosPerfilPermissoes } from '@/types/perfilPermissao';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PerfilPermissoesState {
  modulosPerfisPermissoes: ModulosPerfilPermissoes[];
}

const initialState: PerfilPermissoesState = {
  modulosPerfisPermissoes: [],
};

const perfilPermissaoSlice = createSlice({
  name: 'perfilPermissao',
  initialState,
  reducers: {
    setModulosPerfilPermissoes: (
      state,
      action: PayloadAction<ModulosPerfilPermissoes[]>
    ) => {
      state.modulosPerfisPermissoes = action.payload;
    },
    clear: (state) => {
      state.modulosPerfisPermissoes = [];
    },
  },
});

export const { setModulosPerfilPermissoes, clear } =
  perfilPermissaoSlice.actions;

export default perfilPermissaoSlice.reducer;
