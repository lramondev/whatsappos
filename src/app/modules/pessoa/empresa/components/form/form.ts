import { Component, EventEmitter, ViewChild, Output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatStepperModule } from '@angular/material/stepper';

import { NgxMaskPipe } from 'ngx-mask';

import { CpfCnpjInput } from './inputs';

import { Certificate, CertificateService, FileService } from '../../../../../services';
import { EmpresaService } from '../../services';

@Component({
  selector: 'pessoa-empresa-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    NgxMaskPipe,
    
    CpfCnpjInput
  ],
  templateUrl: './form.html',
  styleUrl: './form.scss',
})
export class Form {

  @ViewChild('contextMenu', { static: true }) 
  contextMenu!: MatMenuTrigger;

  @Output()
  public onCancel: EventEmitter<void> = new EventEmitter();

  private fileService = inject(FileService);
  private certificateService = inject(CertificateService);
  private empresaService = inject(EmpresaService);

  contextMenuPosition = { x: '0px', y: '0px' };
  formGroup: FormGroup = new FormGroup({});

  certificate!: Certificate;

  constructor(
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      id: [],
      cpf_cnpj: [, [ Validators.required, Validators.minLength(11), Validators.maxLength(14) ] ],
      nome_razao_social: [, [ Validators.required, Validators.minLength(2), Validators.maxLength(128) ] ],
      //apelido_fantasia: [, [ Validators.required, Validators.minLength(2), Validators.maxLength(128) ] ],
      img: [],

      ie: this.formBuilder.array([]),
      endereco: this.formBuilder.array([]),
      contato: this.formBuilder.array([]),

      certificado: this.formBuilder.array([])
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

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    // Validação antes de processar
    const validation = this.fileService.validateCertificateFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    this.certificateService.lerCertificado(file)
      .then(info => {
        this.certificate = info;
        this.formGroup.controls['nome_razao_social'].patchValue(info.razao_social);
        this.formGroup.controls['cpf_cnpj'].patchValue(info.cnpj);
      })
      .catch(err => alert(err.message));
  }

  cancel(): void {
    this.onCancel.emit();
  }

  async save(): Promise<void> {
   this.empresaService.save(this.formGroup.getRawValue()).then(() => {console.log('then')})
  }
}
