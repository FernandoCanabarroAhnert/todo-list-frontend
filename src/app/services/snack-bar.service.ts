import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  private readonly _snackBar = inject(MatSnackBar);
  
  openSnackBar(text: string, action: string) {
    this._snackBar.open(text, action, {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

}
