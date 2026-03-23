// utils/formatar-data.ts

type FormatOptions = 'data' | 'hora' | 'dataHora';

function parseDateString(data: string): Date {
  if (!data) return new Date('');

  // ISO completo: yyyy-MM-ddTHH:mm:ss.sssZ (formato que vem do backend)
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(data)) {
    const isoDate = new Date(data);
    // Extrair ano, mês e dia do UTC e criar data local no meio-dia
    return new Date(
      isoDate.getUTCFullYear(),
      isoDate.getUTCMonth(),
      isoDate.getUTCDate(),
      12,
      0,
      0
    );
  }

  // ISO: yyyy-MM-dd ou yyyy-MM-ddTHH:mm
  if (/^\d{4}-\d{2}-\d{2}/.test(data)) {
    // Para datas ISO sem horário, criar a data no horário local para evitar problemas de timezone
    if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
      const [ano, mes, dia] = data.split('-');
      // Usar horário do meio-dia para evitar problemas de timezone
      return new Date(Number(ano), Number(mes) - 1, Number(dia), 12, 0, 0);
    }
    return new Date(data);
  }

  // BR: dd/MM/yyyy
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(data)) {
    const [dia, mes, ano] = data.split('/');
    return new Date(Number(ano), Number(mes) - 1, Number(dia), 12, 0, 0);
  }

  return new Date('');
}

function normalizeDateObject(date: Date): Date {
  // Se a data é UTC à meia-noite, provavelmente veio de uma string ISO "YYYY-MM-DD"
  // Vamos recriá-la no horário local
  if (
    date.getUTCHours() === 0 &&
    date.getUTCMinutes() === 0 &&
    date.getUTCSeconds() === 0
  ) {
    return new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      12,
      0,
      0
    );
  }
  return date;
}

export const converterParaISO = (data: string): string => {
  const partes = data.split('/');
  if (partes.length !== 3) return '';
  const [dia, mes, ano] = partes;
  return `${ano}-${mes}-${dia}`;
};

export function formatarData(
  data: string | Date,
  tipo: FormatOptions = 'dataHora'
): string {
  let d: Date;

  if (data instanceof Date) {
    d = normalizeDateObject(data);
  } else if (typeof data === 'string') {
    d = parseDateString(data);
  } else {
    return '';
  }

  if (isNaN(d.getTime())) return ''; // evita crash em datas inválidas

  // Para evitar problemas de timezone, vamos usar toLocaleDateString diretamente
  switch (tipo) {
    case 'data':
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

    case 'hora':
      return d.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });

    case 'dataHora':
    default:
      return d.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
  }
}

// 🔹 Data de agora
export function dataAgora(): string {
  return formatarData(new Date(), 'data');
}

// 🔹 Hora de agora
export function horaAgora(): string {
  return formatarData(new Date(), 'hora');
}

// 🔹 Quantos dias se passaram até hoje (dd/MM/yyyy ou ISO → número)
export function diasAtras(data: string): number {
  const d = parseDateString(data);
  if (isNaN(d.getTime())) return 0;

  const hoje = new Date();
  const diffTime = hoje.getTime() - d.getTime();

  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

// Converte data ISO para formato YYYY-MM-DD (para inputs de data)
export function formatDateFromISO(isoDate: string): string {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  return date.toISOString().split('T')[0];
}

// Formata a data pra exibir dd/MM/yyyy ou mm/yyyy
export function formatarDataExibicao(
  data: string | Date,
  tipo: 'data' | 'mesAno' = 'data'
): string {
  let d: Date;

  if (data instanceof Date) {
    d = normalizeDateObject(data);
  } else if (typeof data === 'string') {
    d = parseDateString(data);
  } else {
    return '';
  }

  if (isNaN(d.getTime())) return ''; // evita crash em datas inválidas

  switch (tipo) {
    case 'data':
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

    case 'mesAno':
      return d.toLocaleDateString('pt-BR', {
        month: '2-digit',
        year: 'numeric',
      });

    default:
      return '';
  }
}

// Retornar o mes a partir de um numero
export function getMesPorNumero(mes: number): string {
  const meses = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];
  return meses[mes - 1] || '';
}
