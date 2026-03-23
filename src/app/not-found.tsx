import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-3xl font-semibold">Pagina nao encontrada</h1>
        <p className="mt-2 text-gray-500">A rota solicitada nao existe.</p>
        <Link
          href="/suport"
          className="mt-6 inline-block text-blue-600 underline"
        >
          Ir para suporte
        </Link>
      </div>
    </div>
  );
}
