import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateUserInfosFormComponent } from './update-user-infos-form.component';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../../../../../../services/auth.service';
import { Router } from '@angular/router';
import { EMPTY, of, throwError } from 'rxjs';

describe('UpdateUserInfosFormComponent', () => {
  let component: UpdateUserInfosFormComponent;
  let fixture: ComponentFixture<UpdateUserInfosFormComponent>;

  const authServiceMock = {
    getUserInfos: jest.fn().mockReturnValue({ fullName: 'fullName', userName: 'userName', email: 'email@example.com' }),
    updateUserInfos: jest.fn(),
    logout: jest.fn()
  }
  const routerMock = {
    navigate: jest.fn()
  }

  const alreadyExistingEmailError = {
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
      imports: [UpdateUserInfosFormComponent],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateUserInfosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('updateUserInfos', () => {
    it('should mark all form controls as touched and return if the form is invalid', () => {
          component.ngOnInit();
          component.updateUserInfosForm.setValue({
            fullName: '',
            userName: '',
            email: ''
          })
    
          component.updateUserInfos();
          expect(component.updateUserInfosForm.invalid).toBe(true);
          expect(component.updateUserInfosForm.touched).toBe(true);
        });
        it('should navigate to login page when update is successful', () => {
          component.ngOnInit();
          component.updateUserInfosForm.setValue({
            fullName: 'fullName',
            userName: 'userName',
            email: 'email@example.com'
          })
          authServiceMock.updateUserInfos.mockReturnValue(of(EMPTY));
    
          component.updateUserInfos();
          expect(authServiceMock.logout).toHaveBeenCalled();
          expect(routerMock.navigate).toHaveBeenCalledWith(['login']);
        });
        it('should set alreadyExistingEmail error in the email form control when email is already in use', () => {
          component.ngOnInit();
          component.updateUserInfosForm.setValue({
            fullName: 'fullName',
            userName: 'userName',
            email: 'email@example.com'
          })
          authServiceMock.updateUserInfos.mockImplementation(() => throwError(() => alreadyExistingEmailError))
    
          component.updateUserInfos();
          expect(component.email.hasError('alreadyExistingEmail')).toBe(true);
        });
        it('should set invalidData error in the form when data is invalid', () => {
          component.ngOnInit();
          authServiceMock.updateUserInfos.mockImplementation(() => throwError(() => invalidDataError))
    
          component.updateUserInfos();
          expect(component.updateUserInfosForm.hasError('invalidData')).toBe(true);
        });
        it('should set serverError error in the form when current password is incorrect', () => {
          component.ngOnInit();
          component.updateUserInfosForm.setValue({
            fullName: 'fullName',
            userName: 'userName',
            email: 'email@example.com'
          })
          authServiceMock.updateUserInfos.mockImplementation(() => throwError(() => serverError))
    
          component.updateUserInfos();
          expect(component.updateUserInfosForm.hasError('serverError')).toBe(true);
        });
  })

});
