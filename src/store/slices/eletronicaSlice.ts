import { EletronicaService } from '@/service/eletronicas.service';
import { responseEletronica } from '@/types/eletronica.type';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface EletronicaState {
  entradas: responseEletronica[];
}

const initialState: EletronicaState = {
  entradas: [],
};

export const fetchDadosEletronica = createAsyncThunk(
  'eletronica/fetchDadosEletronica',
  async ({
    id_pessoa_juridica,
    data_inicial,
    data_final,
  }: {
    id_pessoa_juridica: number;
    data_inicial: string;
    data_final: string;
  }) => {
    const entradas = await EletronicaService.getEletronicas(
      id_pessoa_juridica,
      data_inicial,
      data_final
    );
    return entradas;
  }
);

const eletronicaSlice = createSlice({
  name: 'eletronica',
  initialState,
  reducers: {
    clearDadosEletronica(state) {
      state.entradas = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDadosEletronica.fulfilled, (state, action) => {
      state.entradas = action.payload;
    });
  },
});

export const { clearDadosEletronica } = eletronicaSlice.actions;

export default eletronicaSlice.reducer;
