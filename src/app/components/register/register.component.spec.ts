import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { FormBuilder } from '@angular/forms';
import { provideRouter, Router, withEnabledBlockingInitialNavigation, withNavigationErrorHandler } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserEmailValidatorService } from '../../validators/user-email-validator.service';
import { EMPTY, of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  const authServiceMock = {
    register: jest.fn()
  }

  const alreadyExistingEmailError = {
    status: 409,
    message: 'Conflict'
  }
  const invalidDataError = {
    status: 422,
    message: 'Invalid data'
  }
  const serverError = {
    status: 500,
    message: 'Internal Server Error'
  }

  beforeEach(async () => {
    jest.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        FormBuilder,
        UserEmailValidatorService,
        { provide: AuthService, useValue: authServiceMock },
        provideRouter(
          [],
          withEnabledBlockingInitialNavigation(),
          withNavigationErrorHandler(() => { })
        ),
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('register', () => {
    it('should mark all form controls as touched when form is invalid', () => {
      component.ngOnInit();
      component.registerForm.setValue({
        fullName: '',
        username: '',
        email: 'email',
        password: '12345A',
        passwordConfirmation: '12345',
      })
      fixture.detectChanges();
      
      component.register();
      expect(component.registerForm.touched).toBe(true);
      expect(component.registerForm.invalid).toBe(true);
      expect(component.fullName.touched).toBe(true);
      expect(component.username.touched).toBe(true);
    });
    it('should set emailExists error when email already exists', () => {
      component.ngOnInit();
      component.registerForm.setValue({
        fullName: 'fullName',
        username: 'username',
        email: 'email@example.com',
        password: '12345Az@',
        passwordConfirmation: '12345Az@',
      })
      fixture.detectChanges();
      authServiceMock.register.mockImplementation(() => throwError(() => alreadyExistingEmailError));

      component.register();
      expect(component.email.hasError('emailExists')).toBe(true);
    });
    it('should set invalidData error when data is invalid', () => {
      component.ngOnInit();
      component.registerForm.setValue({
        fullName: 'fullName',
        username: 'username',
        email: 'email@example.com',
        password: '12345Az@',
        passwordConfirmation: '12345Az@',
      })
      fixture.detectChanges();
      authServiceMock.register.mockImplementation(() => throwError(() => invalidDataError));

      component.register();
      expect(component.registerForm.hasError('invalidData')).toBe(true);
    });
    it('should set serverError error when email already exists', () => {
      component.ngOnInit();
      component.registerForm.setValue({
        fullName: 'fullName',
        username: 'username',
        email: 'email@example.com',
        password: '12345Az@',
        passwordConfirmation: '12345Az@',
      })
      fixture.detectChanges();
      authServiceMock.register.mockImplementation(() => throwError(() => serverError));

      component.register();
      expect(component.registerForm.hasError('serverError')).toBe(true);
    });
  })

});
