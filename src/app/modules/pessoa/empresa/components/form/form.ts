import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'pessoa-empresa-form',
  imports: [
    ReactiveFormsModule,
    MatMenuModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule
  ],
  templateUrl: './form.html',
  styleUrl: './form.scss',
})
export class Form {

  @ViewChild('contextMenu', { static: true }) 
  contextMenu!: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  formGroup: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      id: [],
      cpf_cnpj: [, Validators.required, Validators.minLength(11), Validators.maxLength(14) ],
      nome_razao_social: [, Validators.required, Validators.minLength(2), Validators.maxLength(128) ],
      apelido_fantasia: [, Validators.required, Validators.minLength(2), Validators.maxLength(128) ],
      img: []
    });
  }

  onContextMenu(event: MouseEvent) {
    //event.preventDefault();
    //this.contextMenuPosition = { x: event.clientX + 'px', y: event.clientY + 'px' };
    //this.contextMenu.openMenu();
  }

  closeContextMenu() {
    //this.contextMenu.closeMenu();
  }
}
