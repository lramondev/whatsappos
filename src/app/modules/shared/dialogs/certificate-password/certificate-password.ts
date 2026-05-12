import { Component, Output, EventEmitter, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import { MatCardModule } from '@angular/material/card';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-certificate-password',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './certificate-password.html',
  styleUrl: './certificate-password.scss',
})
export class CertificatePasswordComponent {

  @Output()
  onPassword: EventEmitter<string> = new EventEmitter();

  private dialogRef = inject(MatDialogRef<CertificatePasswordComponent>);

  formControl: FormControl = new FormControl('', [ Validators.required ]);

  keypress(event: KeyboardEvent) {
    if(event.key == 'Enter')
      this.send();
  }

  send(): void {
    this.dialogRef.close(this.formControl.value);
  }
}
