import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ButtonComponent } from '../../../../../button/button.component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../../../services/auth.service';
import { passwordValidator } from '../../../../../../validators/password-validator';
import { passwordConfirmationValidator } from '../../../../../../validators/password-confirmation.validator';
import { IUpdatePasswordRequest } from '../../../../../../interfaces/update-password-request';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-update-password-form',
  standalone: true,
  imports: [CommonModule, ButtonComponent, ReactiveFormsModule],
  templateUrl: './update-password-form.component.html',
  styleUrl: './update-password-form.component.scss'
})
export class UpdatePasswordFormComponent implements OnInit {

  updatePasswordForm!: FormGroup;
  
  private readonly _fb = inject(FormBuilder);
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);

  ngOnInit(): void {
      this.updatePasswordForm = this._fb.group({
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(8), passwordValidator()]],
        newPasswordConfirmation: ['', [Validators.required]],
      })
      this.updatePasswordForm.addValidators(passwordConfirmationValidator());
  }

  get currentPassword(): FormControl {
    return this.updatePasswordForm.get('currentPassword') as FormControl;
  }
  get newPassword(): FormControl {
    return this.updatePasswordForm.get('newPassword') as FormControl;
  }
  get newPasswordConfirmation(): FormControl {
    return this.updatePasswordForm.get('newPasswordConfirmation') as FormControl;
  }

  updatePassword() {
    if (this.updatePasswordForm.invalid) {
      this.updatePasswordForm.markAllAsTouched();
      return;
    }
    const request: IUpdatePasswordRequest = {
      currentPassword: this.currentPassword.value,
      newPassword: this.newPassword.value
    }
    this._authService.updatePassword(request).subscribe({
      next: () => {
        this._authService.logout();
        this._router.navigate(['login']);
      },
      error: (error: HttpErrorResponse) => {
        const INCORRECT_CURRENT_PASSWORD_ERROR = error.status === 409;
        const INVALID_DATA_ERROR = error.status === 422;

        if (INCORRECT_CURRENT_PASSWORD_ERROR) {
          this.currentPassword.setErrors({ incorrectCurrentPassword: true })
        }
        if (INVALID_DATA_ERROR) {
          this.updatePasswordForm.setErrors({ invalidData: true })
        }
        if (error.status >= 500) {
          this.updatePasswordForm.setErrors({ serverError: true })
        }
      }
    })
  }

}
