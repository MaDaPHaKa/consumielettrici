import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  success(message: string, timeout: number = 3000) {
    this.snackBar.open(message, 'Ok', {
      duration: timeout,
      panelClass: ['success-snackbar'],
    });
  }

  error(message: string, timeout: number = 10000) {
    this.snackBar.open(message, 'Ok', {
      duration: timeout,
      panelClass: ['failure-snackbar'],
    });
  }
}
