export type PessoaUsuario = {
  id_pessoa_usuario: string;
  id_pessoa: string;
  id_pessoa_juridica: string;
  id_pessoa_fisica: string;
  id_pessoa_juridica_perfil: string;
  id_sistema: string;
  juridica_principal: number;
  empresa: string;
  funcionario: string;
  usuario: string;
  login?: string;
};

export type Usuario = {
  id?: bigint | string;
  id_perfil?: bigint | string;
  documento?: string;
  nome?: string;
  login?: string;
  ativo?: number;
};

export interface UsuarioEmpresas {
  id: string;
  id_pessoa_juridica: string;
  id_pessoa_fisica: string;
  id_pessoa_juridica_perfil: string;
  juridica_principal: number;
  situacao: number;
  pessoaJuridica: {
    nome_fantasia?: string;
    razao_social?: string;
  };
}

export interface PessoasUsuarios {
  id: string;
  id_pessoa_fisica: string;
  nome_login: string;
  login: string;
  senha: string;
  senha_master: string;
  first_acess: number;
  situacao: number;
  motivo: string;
  createdAt: string;
  updatedAt: string;
}
