import { NextRequest, NextResponse } from 'next/server';

// function decodeJWT(token: string) {
//   try {
//     const payload = token.split('.')[1];
//     const decodedPayload = Buffer.from(payload, 'base64').toString('utf-8');
//     return JSON.parse(decodedPayload);
//   } catch {
//     return null;
//   }
// }

export function proxy(request: NextRequest) {
  const token = request.cookies.get('accessToken');

  if (!token?.value) {
    // console.log('REDIRECIONANDO - Token não encontrado');
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // Verificação específica para a rota de cartórios
  // if (request.nextUrl.pathname.startsWith('/cadastro/cartorios')) {
  //   const decodedToken = decodeJWT(token.value);

  //   if (!decodedToken || decodedToken.id_pessoa_juridica_perfil !== '1') {
  //     console.log('decodedToken:', decodedToken);
  //     // Redireciona para página de acesso negado
  //     return NextResponse.redirect(new URL('/acesso-negado', request.url));
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/suport/:path*'],
};
