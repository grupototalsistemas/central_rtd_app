export const mapSaldo = (
  saldoData: number | undefined,
  depositoPrevioData: number | undefined
) => {
  const saldo = saldoData !== undefined ? saldoData : 0;
  const depositoPrevio =
    depositoPrevioData !== undefined ? depositoPrevioData : 0;
  return { saldo, depositoPrevio };
};
