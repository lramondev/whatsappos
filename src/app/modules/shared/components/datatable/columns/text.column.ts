export const TextColumn = (column_def: string, header: string, width: number = 300, align: string = 'left') => ({
  column_def: column_def,
  header: header,
  type: 'text',
  data_type: 'string',
  visible: true,
  searchable: true,
  sortable: true,
  sticky: false,
  sticky_end: false,
  class: [],
  style: { 'text-align': align, 'justify-content': align, 'align-items': align, 'width': width + 'px', 'min-width': width + 'px', 'max-width': width + 'px' },
  mask: '',
  prefix: '',
  suffix: '',
  color: ''
});