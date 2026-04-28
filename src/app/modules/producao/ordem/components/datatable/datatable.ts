import { Component } from '@angular/core';

import * as components from '../../../../shared/components';

@Component({
  selector: 'comercial-producao-datatable',
  imports: [ components.Datatable ],
  templateUrl: './datatable.html',
  styleUrl: './datatable.scss',
})
export class Datatable {}
