import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { FormBuilder } from '@angular/forms';
import { ILoginResponse } from '../../interfaces/login-response.interface';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const routerMock = {
    navigate: jest.fn()
  }
  const authServiceMock = {
    login: jest.fn()
  }
  const loginResponse: ILoginResponse = {
    token: 'token',
    duration: 86400
  }
  const username = 'username';
  const password = 'password'; 

  const unauthorizedError = {
    status: 401,
    message: 'Unauthorized'
  }
  const serverError = {
    status: 500,
    message: 'Internal Server Error'
  }

  beforeEach(async () => {
    jest.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('login', () => {
    it('should set token on local storage and navigate to dashboard', () => {
      component.ngOnInit();
      component.loginForm.patchValue({
        username: username,
        password: password
      });
      fixture.detectChanges();
      authServiceMock.login.mockReturnValue(of(loginResponse));
      component.login();
      expect(routerMock.navigate).toHaveBeenCalledWith(['dashboard']);
    });
    it('should set invalidCredentials error on loginForm when credentials are invalid', () => {
      component.ngOnInit();
      component.loginForm.patchValue({
        username: username,
        password: password
      });
      fixture.detectChanges();
      authServiceMock.login.mockImplementation(() => throwError(() => unauthorizedError));
      component.login();
      expect(component.loginForm.hasError('invalidCredentials')).toBe(true);
    });
    it('should set serverError error on loginForm when server returns an internal error', () => {
      component.ngOnInit();
      component.loginForm.patchValue({
        username: username,
        password: password
      });
      fixture.detectChanges();
      authServiceMock.login.mockImplementation(() => throwError(() => serverError));
      component.login();
      expect(component.loginForm.hasError('serverError')).toBe(true);
    });
  })

});
