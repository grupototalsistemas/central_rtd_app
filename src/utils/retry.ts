import { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

export async function withRetry<T>(
  fn: () => Promise<AxiosResponse<T>>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  toast.loading('Carregando...');

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fn();
      toast.dismiss();
      return response.data;
    } catch (error: any) {
      console.error(error);

      if (error instanceof AxiosError && error.response?.status === 500) {
        if (attempt === maxRetries) {
          break;
        }

        await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
        continue;
      }
      toast.dismiss();
      throw toast.error(error.response?.data.message || error.message); // Se não for erro 500, lança o erro imediatamente
    }
  }

  // Se chegou aqui, significa que todas as tentativas falharam com erro 500
  throw new Error(
    'Desculpe, estamos enfrentando uma instabilidade temporária. Por favor, tente novamente em alguns instantes.'
  );
}
