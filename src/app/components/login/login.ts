import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../../services';

@Component({
  selector: 'app-login',
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule
],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  private _isLoading = signal(false);
  readonly isLoading = this._isLoading.asReadonly();

  authService = inject(AuthService);
  form: FormGroup;
  
  constructor(
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      email: ['', [ Validators.required, Validators.email ]],
      password: ['', [ Validators.required, Validators.minLength(6) ]],
      remember: [ false ],
    });
  }

  login(): void {
    this.authService.login({ 
      email: this.form.controls['email'].value, 
      password: this.form.controls['password'].value })
      .subscribe();
  }

}
