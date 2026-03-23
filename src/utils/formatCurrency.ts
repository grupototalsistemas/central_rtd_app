/**
 * Formata um valor numérico ou string para o formato monetário brasileiro.
 *
 * - Adiciona duas casas decimais se não houver.
 * - Ajusta corretamente se houver zeros à direita.
 * - Ignora se já tiver vírgula ou ponto decimal.
 * - Pode retornar com ou sem símbolo "R$".
 */
export function formatadorNumeral(
  input: string | number,
  withSymbol: boolean = true
): string {
  // console.log('formatadorNumeral - input:', input);
  if (input === null || input === undefined || input === '') return '0,00';

  let str = String(input).trim();

  // Se já tiver vírgula ou ponto, apenas formata o valor
  if (str.includes(',') || str.includes('.')) {
    const num = parseFloat(str.replace(',', '.'));
    if (isNaN(num)) return '0,00';

    return withSymbol
      ? num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      : num.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  }

  // Remove caracteres não numéricos
  str = str.replace(/\D/g, '');
  if (str.length === 0) return '0,00';

  // Garante ao menos 3 dígitos para manipular as casas decimais
  if (str.length === 1) str = '00' + str; // Ex: "5" -> "005"
  if (str.length === 2) str = '0' + str; // Ex: "50" -> "050"

  let integerPart = str.slice(0, -2);
  let decimalPart = str.slice(-2);

  // Detecta zeros finais e ajusta posição da vírgula
  const zeroMatches = str.match(/0+$/);
  if (zeroMatches) {
    const zeros = zeroMatches[0].length;

    if (zeros === 1 && str.length > 1) {
      integerPart = str.slice(0, -1) || '0';
      decimalPart = '0';
    } else if (zeros >= 2) {
      integerPart = str.slice(0, -2) || '0';
      decimalPart = '00';
    }
  }

  // Garante que não fique vazio
  if (integerPart === '') integerPart = '0';
  if (decimalPart === '') decimalPart = '00';

  const numberValue = parseFloat(`${integerPart}.${decimalPart}`);
  if (isNaN(numberValue)) return '0,00';

  return withSymbol
    ? numberValue.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })
    : numberValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

export const formataValoresApi = (value: string) => {
  // Verifica se é numerico
  const aux = value.replace(/[^0-9.]/g, '');
  // verifica se o valor tem .
  if (aux.includes('.')) {
    // Verifica se apos o ponto tem 2 casas decimais
    if (aux.split('.')[1].length === 2) {
      return formatCurrencyGeral(value);
    } else {
      return formatCurrencyGeral(value + '0');
    }
  } else {
    return formatCurrencyGeral(value + '.00');
  }
};

export const formatPlaceHolder = (value: string) => {
  // Remove símbolo R$, espaços e quebras de linha
  const cleaned = value.replace(/[R$\s\u00A0]/g, '').trim();
  const onlyZeros = /^0*(,0*)?$/;
  return onlyZeros.test(cleaned) ? '' : value;
};

export const formatCurrencyGeral = (value: string) => {
  if (!value) return 'R$ 0,00';

  // Remove espaços e substitui vírgula por ponto
  const cleanValue = value.trim().replace(',', '.');

  // Converte para número
  const number = parseFloat(cleanValue);

  // Verifica se é um número válido
  if (isNaN(number)) return 'R$ 0,00';

  // Formata o número como moeda brasileira
  return number.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
