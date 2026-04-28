import { Status } from '../../../modules/system/status';

export interface Pessoa {
  id?: number;
  nome_razao_social: string;
  apelido_fantasia: string;
  cpf_cnpj: string;

  status: Status;
}