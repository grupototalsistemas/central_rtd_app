export const currencyMask = (value, maxValue: number | null = null) => {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');

  // Converte para número e divide por 100 para ter as casas decimais
  let amount = Number(numbers) / 100;

  // Aplica o valor máximo se especificado
  if (maxValue !== null && amount > maxValue) {
    amount = maxValue;
  }

  // Formata como moeda brasileira
  return amount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};

// Função para obter o valor numérico (útil para enviar ao backend)
export const getNumericValue = (maskedValue) => {
  const numbers = maskedValue.replace(/\D/g, '');
  return Number(numbers) / 100;
};

