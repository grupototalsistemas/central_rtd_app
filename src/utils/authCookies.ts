// src/utils/authCookies.ts
import Cookies from 'js-cookie';

export function setAuthCookies({
  accessToken,
  empresa,
  funcionario,
  usuario,
  id_pessoa_usuario
}: {
  accessToken: string;
  empresa: string;
  funcionario: string;
  usuario: string;
  id_pessoa_usuario: string;
}) {
  Cookies.set('accessToken', accessToken);
  Cookies.set('empresa', empresa);
  Cookies.set('funcionario', funcionario);
  Cookies.set('usuario', usuario);
  Cookies.set('id_pessoa_usuario', id_pessoa_usuario);
}
