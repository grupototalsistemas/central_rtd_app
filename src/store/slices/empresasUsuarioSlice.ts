import { UsuariosEmpresas } from '@/service/pessoas.usuarios.service';
import { UsuarioEmpresas } from '@/types/usuario';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EmpresasUsuarios {
  empresas: UsuarioEmpresas[];
  selectedCompany?: number | null;
}

const initialState: EmpresasUsuarios = {
  empresas: [],
  selectedCompany: null,
};

export const fetchEmpresas = createAsyncThunk(
  'usuarioEmpresas/fetchEmpresas',
  async (id_pessoa_usuario: string) => {
    const empresas =
      await UsuariosEmpresas.getPessoasUsuariosEmpresas(id_pessoa_usuario);
    return empresas;
  }
);

const usuarioEmpresasSlice = createSlice({
  name: 'usuarioEmpresas',
  initialState,
  reducers: {
    clearEmpresa(state) {
      state.empresas = [];
      state.selectedCompany = null;
    },
    setSelectedCompany(state, action: PayloadAction<number>) {
      state.selectedCompany = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchEmpresas.fulfilled, (state, action) => {
      state.empresas = action.payload;

      if (!state.selectedCompany) {
        const empresaPrincipal = action.payload.find(
          (empresa) => empresa.juridica_principal === 1
        );
        state.selectedCompany = empresaPrincipal
          ? Number(empresaPrincipal.id_pessoa_juridica)
          : action.payload.length > 0
            ? Number(action.payload[0].id_pessoa_juridica)
            : null;
      }
    });
  },
});

export const { clearEmpresa, setSelectedCompany } =
  usuarioEmpresasSlice.actions;

export default usuarioEmpresasSlice.reducer;
