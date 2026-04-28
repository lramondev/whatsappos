import { Column as ColumnInterface } from "../../../../../interfaces";
import { Column } from '../../../../shared/components';

export const COLUMNS: ColumnInterface[] = [
  Column.id(),
  Column.text('nome_razao_social', 'Nome / Razão Social', 300),
  Column.text('apelido_fantasia', 'Apelido / Fantasia', 300),
  Column.text('cpf_cnpj', 'CPF / CNPJ', 300),
  Column.empty(),
  Column.status()
];