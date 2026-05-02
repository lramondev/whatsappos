export interface Column {
  column_def: string;
  header: string;
  type: string;
  data_type: string;
  visible: boolean;
  searchable: boolean;
  sortable: boolean;
  sticky: boolean;
  sticky_end: boolean;
  class?: string[];
  style?: { [key: string]: string | number | undefined };
  mask: string;
  prefix: string;
  suffix: string;
  color: string;
  component?: any;
  inputs?: any;
}