export enum fonteEletronica {
  ECARTORIO = 'ecertidao',
  ONRTDPJ = 'onrtdpj',
  RTDBRASIL = 'central',
}

export interface responseEletronica {
  protocolo: string;
  fonte: string;
  cliente: {
    documento: string;
    nome: string;
  };
  status: {
    nome: string;
  };
  servico: {
    id: number;
    nome: string;
  };
  tipoAto: {
    id: number;
    descricao: string;
  };
  tipoDocumento: string;
  finalidade?: string;
  valorTotal: number;
  dataPedido: string;
  dataSituacao: string;
  dataRepasse: string;
  dataSla: string;
  ecertidao?: {
    nuRequisicao: number;
    idRequisicao: number;
    idCerp: string;
    nuRgi?: string;
    nuAto?: string;
    dataPagamento: string;
    endereco: {
      tipoLogradouro?: string;
      logradouro?: string;
      numero?: string;
      complemento?: string;
      bairro?: string;
    };
  };
}
