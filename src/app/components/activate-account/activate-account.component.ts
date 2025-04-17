import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-activate-account',
  standalone: true,
  imports: [MatIconModule, CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './activate-account.component.html',
  styleUrl: './activate-account.component.scss'
})
export class ActivateAccountComponent implements OnInit {

  activateAccountForm!: FormGroup;

  private readonly _router = inject(Router);
  private readonly _authService = inject(AuthService);

  ngOnInit(): void {
    this.activateAccountForm = new FormGroup({
      code: new FormControl('', [Validators.required]),
    });
  }

  get code(): FormControl {
    return this.activateAccountForm.get('code') as FormControl;
  }

  activateAccount() {
    this._authService.activateAccount(this.code.value).subscribe({
      next: () => this._router.navigate(['login']),
      error: (error: HttpErrorResponse) => {
        const EXPIRED_CODE_ERROR = error.status === 400;
        const NOT_FOUND_ERROR = error.status === 404;

        if (EXPIRED_CODE_ERROR) {
          this.activateAccountForm.setErrors({ expiredCode: true });
        }
        if (NOT_FOUND_ERROR) {
          this.activateAccountForm.setErrors({ notFound: true });
        }
        else this.activateAccountForm.setErrors({ serverError: true });
      }
    }) 
  }

}
