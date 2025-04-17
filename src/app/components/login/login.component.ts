import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '../button/button.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule, ButtonComponent, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  private readonly _fb = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _authService = inject(AuthService);

  ngOnInit(): void {
    this.loginForm = this._fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  get username(): FormControl {
    return this.loginForm.get('username') as FormControl;
  }
  get password(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  login() {
    this._authService.login(this.username.value, this.password.value).subscribe({
      next: () => this._router.navigate(['dashboard']),
      error: (error: HttpErrorResponse) => {
        const AUTHORIZATION_ERROR = error.status === 401;
        const SERVER_ERROR = error.status >= 500;

        if (AUTHORIZATION_ERROR) {
          this.loginForm.setErrors({ invalidCredentials: true })
        }
        if (SERVER_ERROR) {
          this.loginForm.setErrors({ serverError: true })
        }
      }
    })
  }

}
