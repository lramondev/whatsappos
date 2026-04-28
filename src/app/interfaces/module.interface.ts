export interface Module {
  id: number;
  name: string;
  description: string;
  version: string;
  route: string;
  icon: string;

  resources?: Module[];
}