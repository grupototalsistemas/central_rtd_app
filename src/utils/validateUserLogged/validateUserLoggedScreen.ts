import Cookies from 'js-cookie';

import { AuthService } from '@/service/auth.service';
import { clearEmpresa as clearEmpresasUsuario } from '@/store/slices/empresasUsuarioSlice';
import { clear as clearPerfilPermissao } from '@/store/slices/perfilPermissaoSlice';
import { clear as clearUsuario, setLogado } from '@/store/slices/usuarioSlice';
import { persistor, store } from '@/store/store';

const SIGNIN_ROUTE = '/signin';
const SESSION_COOKIE_KEYS = [
  'accessToken',
  'empresa',
  'funcionario',
  'usuario',
  'id_pessoa_usuario',
];

const clearBrowserState = () => {
  if (typeof window === 'undefined') return;

  SESSION_COOKIE_KEYS.forEach((cookieKey) => Cookies.remove(cookieKey));

  try {
    localStorage.clear();
  } catch (err) {
    console.error('Erro ao limpar localStorage', err);
  }

  try {
    sessionStorage.clear();
  } catch (err) {
    console.error('Erro ao limpar sessionStorage', err);
  }
};

const clearReduxState = async () => {
  store.dispatch(clearUsuario());
  store.dispatch(setLogado(false));
  store.dispatch(clearPerfilPermissao());
  store.dispatch(clearEmpresasUsuario());

  try {
    await persistor.purge();
  } catch (err) {
    console.error('Erro ao limpar store persistida', err);
  }
};

const redirectToSignin = () => {
  if (typeof window !== 'undefined') {
    window.location.replace(SIGNIN_ROUTE);
  }
};

const handleInvalidSession = async () => {
  try {
    await AuthService.logout();
  } catch (err) {
    console.error('Erro ao encerrar sessão no servidor', err);
  } finally {
    clearBrowserState();
    await clearReduxState();
    redirectToSignin();
  }
};

async function validateUserLoggedScreenLogout(id_usuario?: number) {
  try {
    const accessToken = Cookies.get('accessToken');
    if (accessToken && (typeof id_usuario !== 'number' || id_usuario > 0)) {
      return true;
    }
    await handleInvalidSession();
    return false;
  } catch (error) {
    console.error('Erro ao validar usuário logado', error);
    await handleInvalidSession();
    return false;
  }
}

export { validateUserLoggedScreenLogout };
