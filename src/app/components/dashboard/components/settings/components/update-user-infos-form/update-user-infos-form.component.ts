import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../../../button/button.component';
import { AuthService } from '../../../../../../services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-update-user-infos-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './update-user-infos-form.component.html',
  styleUrl: './update-user-infos-form.component.scss'
})
export class UpdateUserInfosFormComponent implements OnInit {

  updateUserInfosForm!: FormGroup;

  private emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  private readonly _fb = inject(FormBuilder);
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);

  ngOnInit(): void {
      const userInfos = this._authService.getUserInfos();
      this.updateUserInfosForm = this._fb.group({
          fullName: [userInfos.fullName, [Validators.required]],
          userName: [userInfos.userName, [Validators.required]],
          email: [userInfos.email, [Validators.required, Validators.pattern(this.emailPattern)]],
      });
  }

  get fullName(): FormControl {
    return this.updateUserInfosForm.get('fullName') as FormControl;
  }
  get userName(): FormControl {
    return this.updateUserInfosForm.get('userName') as FormControl;
  }
  get email(): FormControl {
    return this.updateUserInfosForm.get('email') as FormControl;
  }

  updateUserInfos() {
    if (this.updateUserInfosForm.invalid) {
      this.updateUserInfosForm.markAllAsTouched();
      return;
    }
    this._authService.updateUserInfos(this.updateUserInfosForm.value).subscribe({
      next: () => {
        this._authService.logout();
        this._router.navigate(['login'])
      },
      error: (error: HttpErrorResponse) => {
        const ALREADY_EXISTING_EMAIL_ERROR = error.status === 409;
        const INVALID_DATA_ERROR = error.status === 422;

        if (ALREADY_EXISTING_EMAIL_ERROR) {
          this.email.setErrors({ alreadyExistingEmail: true })
        }
        if (INVALID_DATA_ERROR) {
          this.updateUserInfosForm.setErrors({ invalidData: true })
        }
        if (error.status >= 500) {
          this.updateUserInfosForm.setErrors({ serverError: true })
        }
      }
    })
  }

}
