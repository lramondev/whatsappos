import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) {}

  success(message: string, duration = 4000): void {
    this.snackBar.open(`✅ ${message}`, 'OK', {
      duration,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  error(message: string, duration = 10000): void {
    this.snackBar.open(`❌ ${message}`, 'Fechar', {
      duration,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  warning(message: string, duration = 6000): void {
    this.snackBar.open(`⚠️ ${message}`, 'OK', {
      duration,
      panelClass: ['warning-snackbar']
    });
  }

  info(message: string, duration = 4000): void {
    this.snackBar.open(message, 'OK', { duration });
  }
}