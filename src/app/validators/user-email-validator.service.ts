import { inject, Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { map, Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserEmailValidatorService implements AsyncValidator {

  private readonly _authService = inject(AuthService);
  
  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    if (!control.dirty) return of(null);
    return this._authService.verifyEmail(control.value)
      .pipe(
        map(response => response ? { emailExists: true } : null)
      )
  }

}
