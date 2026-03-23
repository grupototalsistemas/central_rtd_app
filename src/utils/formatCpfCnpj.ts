const onlyDigits = (value: string): string => value.replace(/\D/g, '');

export const formatCpf = (value: string): string => {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) {
    return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  }
  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

export const formatCnpj = (value: string): string => {
  const digits = onlyDigits(value).slice(0, 14);

  if (digits.length <= 2) return digits;
  if (digits.length <= 5) {
    return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  }
  if (digits.length <= 8) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  }
  if (digits.length <= 12) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  }

  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
};

export const validarCPF = (cpf: string): boolean => {
  const digits = onlyDigits(cpf);

  if (digits.length !== 11 || /^(\d)\1+$/.test(digits)) return false;

  const calcDigit = (base: string): number => {
    let sum = 0;
    for (let i = 0; i < base.length; i++) {
      sum += Number(base[i]) * (base.length + 1 - i);
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const base = digits.slice(0, 9);
  const dig1 = calcDigit(base);
  const dig2 = calcDigit(base + String(dig1));

  return digits.endsWith(`${dig1}${dig2}`);
};

export const validarCNPJ = (cnpj: string): boolean => {
  const digits = onlyDigits(cnpj);

  if (digits.length !== 14 || /^(\d)\1+$/.test(digits)) return false;

  const calcDigit = (base: string, weights: number[]): number => {
    const sum = weights.reduce(
      (total, weight, index) => total + Number(base[index]) * weight,
      0
    );

    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const base = digits.slice(0, 12);
  const dig1 = calcDigit(base, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const dig2 = calcDigit(
    base + String(dig1),
    [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  );

  return digits.endsWith(`${dig1}${dig2}`);
};

export const formatCpfCnpj = (value: string): string => {
  const digits = onlyDigits(value);

  // Se tem 11 dígitos ou menos, formata como CPF
  if (digits.length <= 11) {
    return formatCpf(value);
  }

  // Se tem mais de 11 dígitos, formata como CNPJ
  return formatCnpj(value);
};

export const validarCpfCnpj = (value: string): boolean => {
  const digits = onlyDigits(value);

  // Se tem 11 dígitos, valida como CPF
  if (digits.length === 11) {
    return validarCPF(value);
  }

  // Se tem 14 dígitos, valida como CNPJ
  if (digits.length === 14) {
    return validarCNPJ(value);
  }

  return false;
};
