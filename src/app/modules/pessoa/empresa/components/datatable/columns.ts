import { Column } from '../../../../shared';
import { CustomColumn } from '../../../../shared/components';

const CpfCnpjColumn: Column = CustomColumn.text('cpf_cnpj', 'CPF / CNPJ', 160, 'center');
CpfCnpjColumn.mask = '000.000.000-00 || 00.000.000/0000-00';

export const COLUMNS: Column[] = [
  CustomColumn.id(),
  CustomColumn.text('nome_razao_social', 'Nome / Razão Social', 300),
  CustomColumn.text('apelido_fantasia', 'Apelido / Fantasia', 300),
  CpfCnpjColumn,
  CustomColumn.empty(),
  CustomColumn.status()
];