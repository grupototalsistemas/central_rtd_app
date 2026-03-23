import { PessoaUsuario, Usuario } from '@/types/usuario';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UsuarioState {
  pessoa_usuario: PessoaUsuario;
  usuario: Usuario;
  logado: boolean;
}

const initialState: UsuarioState = {
  pessoa_usuario: {} as PessoaUsuario,
  logado: false,
  usuario: {} as Usuario,
};

const usuarioSlice = createSlice({
  name: 'usuario',
  initialState,
  reducers: {
    setLogado: (state, action: PayloadAction<boolean>) => {
      state.logado = action.payload;
    },
    setUsuario: (state, action: PayloadAction<Usuario>) => {
      state.usuario = action.payload;
    },
    setPessoaUsuario: (state, action: PayloadAction<PessoaUsuario>) => {
      state.pessoa_usuario = action.payload;
    },
    clear: (state) => {
      state.pessoa_usuario = initialState.pessoa_usuario;
      state.usuario = initialState.usuario;
      state.logado = false;
    },
  },
});

export const { setLogado, clear, setPessoaUsuario, setUsuario } =
  usuarioSlice.actions;

export default usuarioSlice.reducer;
