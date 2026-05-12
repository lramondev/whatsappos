import { Component, Input } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-cpf-cnpj-input',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgxMaskDirective
  ],
  templateUrl: './cpf-cnpj-input.html',
  styleUrl: './cpf-cnpj-input.scss',
})
export class CpfCnpjInput {
  
  @Input() 
  control!: AbstractControl;

  label: string = 'CPF / CNPJ';

  ngOnInit(): void {
    this.control.valueChanges.subscribe((value) => {
      this.label = value.length == 11 ? 'CPF' : (value.length == 14 ? 'CNPJ' : 'CPF / CNPJ');

    });
  }
}
