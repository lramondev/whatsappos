import { Status } from '../../status';

export interface User {
  id?: number;
  email: string;
  password?: string;
  token?: string;
  picture?: string;

  status: Status;
}