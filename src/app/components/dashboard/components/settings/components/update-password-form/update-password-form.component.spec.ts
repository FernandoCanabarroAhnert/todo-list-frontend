import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePasswordFormComponent } from './update-password-form.component';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../../../../../../services/auth.service';
import { Router } from '@angular/router';
import { EMPTY, of, throwError } from 'rxjs';

describe('UpdatePasswordFormComponent', () => {
  let component: UpdatePasswordFormComponent;
  let fixture: ComponentFixture<UpdatePasswordFormComponent>;

  const authServiceMock = {
    updatePassword: jest.fn(),
    logout: jest.fn()
  }
  const routerMock = {
    navigate: jest.fn()
  }

  const invalidCurrentPasswordError = {
    status: 409,
    message: 'Conflict'
  }
  const invalidDataError = {
    status: 422,
    message: 'Conflict'
  }
  const serverError = {
    status: 500,
    message: 'Server error'
  }

  beforeEach(async () => {
    jest.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [UpdatePasswordFormComponent],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdatePasswordFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('updatePassword', () => {
    it('should mark all form controls as touched and return if the form is invalid', () => {
      component.ngOnInit();

      component.updatePassword();
      expect(component.updatePasswordForm.invalid).toBe(true);
      expect(component.updatePasswordForm.touched).toBe(true);
      expect(component.currentPassword.touched).toBe(true);
      expect(component.newPassword.touched).toBe(true);
      expect(component.newPasswordConfirmation.touched).toBe(true);
    });
    it('should navigate to login page when update is successful', () => {
      component.ngOnInit();
      component.updatePasswordForm.setValue({
        currentPassword: 'currentPassword',
        newPassword: '12345Az@',
        newPasswordConfirmation: '12345Az@'
      })
      authServiceMock.updatePassword.mockReturnValue(of(EMPTY));

      component.updatePassword();
      expect(authServiceMock.logout).toHaveBeenCalled();
      expect(routerMock.navigate).toHaveBeenCalledWith(['login']);
    });
    it('should set incorrectCurrentPassword error in the form when current password is incorrect', () => {
      component.ngOnInit();
      component.updatePasswordForm.setValue({
        currentPassword: 'currentPassword',
        newPassword: '12345Az@',
        newPasswordConfirmation: '12345Az@'
      })
      authServiceMock.updatePassword.mockImplementation(() => throwError(() => invalidCurrentPasswordError))

      component.updatePassword();
      expect(component.currentPassword.hasError('incorrectCurrentPassword')).toBe(true);
    });
    it('should set invalidData error in the form when current password is incorrect', () => {
      component.ngOnInit();
      component.updatePasswordForm.setValue({
        currentPassword: 'currentPassword',
        newPassword: '12345Az@',
        newPasswordConfirmation: '12345Az@'
      })
      authServiceMock.updatePassword.mockImplementation(() => throwError(() => invalidDataError))

      component.updatePassword();
      expect(component.updatePasswordForm.hasError('invalidData')).toBe(true);
    });
    it('should set serverError error in the form when current password is incorrect', () => {
      component.ngOnInit();
      component.updatePasswordForm.setValue({
        currentPassword: 'currentPassword',
        newPassword: '12345Az@',
        newPasswordConfirmation: '12345Az@'
      })
      authServiceMock.updatePassword.mockImplementation(() => throwError(() => serverError))

      component.updatePassword();
      expect(component.updatePasswordForm.hasError('serverError')).toBe(true);
    });
  })

});
