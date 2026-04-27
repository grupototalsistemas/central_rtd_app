import type { CustomSelectGridColumn } from '../inputs/CustomSelectGrid';

export type OperadorId = 'ecartorio' | 'onrtdpj' | 'rtdbrasil';

export type OperadorPayload = Record<string, unknown>;

export type OperadorGridRow = Record<string, unknown> & {
  id: number | string;
  payloadOriginal: OperadorPayload;
};

export type OperadorDetailField<
  RowType extends OperadorGridRow = OperadorGridRow,
> = {
  key: keyof RowType & string;
  label: string;
  formatter?: (value: unknown, row: RowType) => string;
};

export type OperadorComponentProps = {
  payload: OperadorPayload[];
};

export interface OperadorEntradasBaseProps<
  RowType extends OperadorGridRow = OperadorGridRow,
> {
  rows: RowType[];
  columns: Array<CustomSelectGridColumn<RowType>>;
  detailFields: Array<OperadorDetailField<RowType>>;
  importButtonLabel?: string;
  onImport?: (row: RowType) => void | Promise<void>;
}
