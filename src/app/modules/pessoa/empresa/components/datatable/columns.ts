import { Column } from '../../../../shared';
import { CustomColumn } from '../../../../shared/components';

export const COLUMNS: Column[] = [
  CustomColumn.id(),
  CustomColumn.text('nome_razao_social', 'Nome / Razão Social', 300),
  CustomColumn.text('apelido_fantasia', 'Apelido / Fantasia', 300),
  CustomColumn.text('cpf_cnpj', 'CPF / CNPJ', 300),
  CustomColumn.empty(),
  CustomColumn.status()
];