import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '../button/button.component';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IRegisterRequest } from '../../interfaces/register-request.interface';
import { CommonModule } from '@angular/common';
import { passwordConfirmationValidator } from '../../validators/password-confirmation.validator';
import { UserEmailValidatorService } from '../../validators/user-email-validator.service';
import { HttpErrorResponse } from '@angular/common/http';
import { passwordValidator } from '../../validators/password-validator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, MatIconModule, ButtonComponent, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;

  private emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  private readonly _fb = inject(FormBuilder);
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);
  private readonly _userEmailValidatorService = inject(UserEmailValidatorService);

  ngOnInit(): void {
      this.registerForm = this._fb.group({
        fullName: ['', [Validators.required]],
        username: ['', [Validators.required]],
        email: ['', { validators: [
            Validators.required, Validators.pattern(this.emailPattern)
          ], 
          asyncValidators: [this._userEmailValidatorService.validate.bind(this._userEmailValidatorService)],
          updateOn: 'blur' }
        ],
        password: ['', [Validators.required, Validators.minLength(8), passwordValidator()]],
        passwordConfirmation: ['', [Validators.required]]
      });
      this.registerForm.addValidators(passwordConfirmationValidator())
  }

  get fullName(): FormControl {
    return this.registerForm.get('fullName') as FormControl;
  }
  get username(): FormControl {
    return this.registerForm.get('username') as FormControl;
  }
  get email(): FormControl {
    return this.registerForm.get('email') as FormControl;
  }
  get password(): FormControl {
    return this.registerForm.get('password') as FormControl;
  }
  get passwordConfirmation(): FormControl {
    return this.registerForm.get('passwordConfirmation') as FormControl;
  }

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    const registerRequest: IRegisterRequest = {
      fullName: this.fullName.value,
      userName: this.username.value,
      email: this.email.value,
      password: this.password.value,
    }
    this._authService.register(registerRequest).subscribe({
      next: () => this._router.navigate(['activate-account']),
      error: (error: HttpErrorResponse) => {
        const ALREADY_EXISTING_EMAIL_ERROR = error.status === 409;
        const INVALID_DATA_ERROR = error.status === 422;
        if (ALREADY_EXISTING_EMAIL_ERROR) {
          this.email.setErrors({ emailExists: true })
        }
        if (INVALID_DATA_ERROR) {
          this.registerForm.setErrors({ invalidData: true })
        }
        if (error.status >= 500) {
          this.registerForm.setErrors({ serverError: true })
        }
      }
    })
  }

}
