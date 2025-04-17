import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IRegisterRequest } from '../interfaces/register-request.interface';
import { IUpdateUserInfosRequest } from '../interfaces/update-user-infos-request.interface';
import { IUpdatePasswordRequest } from '../interfaces/update-password-request';
import { ILoginResponse } from '../interfaces/login-response.interface';
import { EMPTY, of, throwError } from 'rxjs';
import { IUserInfosFromJWT } from '../interfaces/user-infos-from-jwt.interface';

describe('AuthService', () => {
  let authService: AuthService;
  const mockHttpClient = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn()
  }
  
  const badRequestError = {
    status: 400,
    message: 'Bad Request'
  }
  const unauthorizedError = {
    status: 401,
    message: 'Unauthorized'
  }
  const forbiddenError = {
    status: 403,
    message: 'Forbidden'
  }
  const notFoundError = {
    status: 404,
    message: 'Not found'
  }
  const conflictError = {
    status: 409,
    message: 'Conflict'
  }
  const invalidDataError = {
    status: 422,
    message: 'Invalid Data'
  }
  const loginUsername = 'username';
  const loginPassword = 'password';
  const loginResponse: ILoginResponse = {
    token: 'token',
    duration: 86400
  }
  const registerRequest: IRegisterRequest = {
    fullName: 'fullName',
    userName: 'userName',
    email: 'email',
    password: 'password'
  }
  const updateUserInfosRequest: IUpdateUserInfosRequest = {
    fullName: 'fullName',
    userName: 'userName',
    email: 'email'
  }
  const updatePasswordRequest: IUpdatePasswordRequest = {
    currentPassword: 'currentPassword',
    newPassword: 'newPassword'
  }

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: mockHttpClient },
      ]
    });
    authService = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  describe('login', () => {
    it('should return jwt token when credentials are valid', () => {
      mockHttpClient.post.mockReturnValue(of(loginResponse));
      authService.login(loginUsername, loginPassword).subscribe((response) => {
        expect(response.token).toBe('token');
        expect(response.duration).toBe(86400);
      })
    });
    it('should return status 401 when credentials are invalid', () => {
      mockHttpClient.post.mockImplementation(() => throwError(() => unauthorizedError));
      authService.login(loginUsername, loginPassword).subscribe({
        next: () => fail('should have failed with 401 error'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(401);
          expect(error.message).toBe('Unauthorized');
        }
      })
    })
  });
  describe('register', () => {
    it('should return status 201 when data is valid', () => {
      mockHttpClient.post.mockReturnValue(of(EMPTY));
      authService.register(registerRequest).subscribe(response => {
        expect(response).toBeUndefined();
      })
    });
    it('should return status 409 when email is already in use', () => {
      mockHttpClient.post.mockImplementation(() => throwError(() => conflictError));
      authService.register(registerRequest).subscribe({
        next: () => fail('should have failed with 409 error'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(409);
          expect(error.message).toBe('Conflict');
        }
      })
    });
    it('should return status 422 when data is invalid', () => {
      mockHttpClient.post.mockImplementation(() => throwError(() => invalidDataError));
      authService.register(registerRequest).subscribe({
        next: () => fail('should have failed with 422 error'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(422);
          expect(error.message).toBe('Invalid Data');
        }
      })
    })
  });

  describe('activateAccount', () => {
    it('should return status 200 when code is valid', () => {
      mockHttpClient.post.mockReturnValue(of(EMPTY));
      authService.activateAccount('code').subscribe(response => {
        expect(response).toBeUndefined();
      })
    });
    it('should return status 400 when code is expired', () => {
      mockHttpClient.post.mockImplementation(() => throwError(() => badRequestError));
      authService.activateAccount('code').subscribe({
        next: () => fail('should have failed with 400 error'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(400);
          expect(error.message).toBe('Bad Request');
        }
      })
    });
    it('should return status 404 when code is not found', () => {
      mockHttpClient.post.mockImplementation(() => throwError(() => notFoundError));
      authService.activateAccount('code').subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
          expect(error.message).toBe('Not found');
        }
      })
    })
  });

  describe('verifyToken', () => {
    it('should return status 200 when token is valid', () => {
      localStorage.setItem('access-token', 'token');
      mockHttpClient.get.mockReturnValue(of(EMPTY));
      authService.verifyToken().subscribe(response => {
        expect(response).toBeUndefined();
      })
    });
    it('should return status 401 when token is not provided', () => {
      mockHttpClient.get.mockImplementation(() => throwError(() => unauthorizedError));
      authService.verifyToken().subscribe({
        next: () => fail('should hava failed with 401 error'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(401);
          expect(error.message).toBe('Unauthorized');
        }
      })
    });
    it('should return status 403 when token is invalid', () => {
      localStorage.setItem('access-token', 'token');
      mockHttpClient.get.mockImplementation(() => throwError(() => forbiddenError));
      authService.verifyToken().subscribe({
        next: () => fail('should hava failed with 403 error'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(403);
          expect(error.message).toBe('Forbidden');
        }
      })
    });
  });

  describe('verifyEmail', () => {
    it('should return status 200 and true when email is in use', () => {
      mockHttpClient.get.mockReturnValue(of({ isAlreadyInUse: true }));
      authService.verifyEmail('email').subscribe(response => {
        expect(response.isAlreadyInUse).toBe(true);
      })
    });
    it('should return status 200 and false when email is not in use', () => {
      mockHttpClient.get.mockReturnValue(of({ isAlreadyInUse: false }));
      authService.verifyEmail('email').subscribe(response => {
        expect(response.isAlreadyInUse).toBe(false);
      })
    });
  });

  describe('logout', () => {
    it('should remove access token from local storage', () => {
      localStorage.setItem('access-token', 'token');
      authService.logout();
      expect(localStorage.getItem('access-token')).toBeNull();
    });
  });

  describe('updateUserInfos', () => {
    it('should return status 200 when data is valid', () => {
      mockHttpClient.put.mockReturnValue(of(EMPTY));
      authService.updateUserInfos(updateUserInfosRequest).subscribe(response => {
        expect(response).toBeUndefined();
      })
    });
    it('should return status 409 when email is already in use by other user', () => {
      mockHttpClient.put.mockImplementation(() => throwError(() => conflictError));
      authService.updateUserInfos(updateUserInfosRequest).subscribe({
        next: () => fail('should have failed with 409 error'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(409);
          expect(error.message).toBe('Conflict');
        }})
      });
    it('should return status 422 when data is invalid', () => {
      mockHttpClient.put.mockImplementation(() => throwError(() => invalidDataError));
      authService.updateUserInfos(updateUserInfosRequest).subscribe({
        next: () => fail('should have failed with 422 error'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(422);
          expect(error.message).toBe('Invalid data');
        }
      })
    }); 
  });

  describe('updatePassword', () => {
    it('should return status 200 when data is valid', () => {
      mockHttpClient.put.mockReturnValue(of(EMPTY));
      authService.updatePassword(updatePasswordRequest).subscribe(response => {
        expect(response).toBeUndefined();
      })
    });
    it('should return status 409 when current password is invalid', () => {
      mockHttpClient.put.mockImplementation(() => throwError(() => conflictError));
      authService.updatePassword(updatePasswordRequest).subscribe({
        next: () => fail('should have failed with 409 error'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(409);
          expect(error.message).toBe('Conflict');
        } 
      })
    });
    it('should return status 422 when data is invalid', () => {
      mockHttpClient.put.mockImplementation(() => throwError(() => invalidDataError));
      authService.updatePassword(updatePasswordRequest).subscribe({
        next: () => fail('should have failed with 422 error'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(422);
          expect(error.message).toBe('Invalid data');
        } 
      })
    });
  });

  it('getUserInfos', () => {
    localStorage.setItem(
      'access-token', 
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3NDQ2NDExMTcsImV4cCI6MTc3NjE3NzExNywiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoiZW1haWwiLCJmdWxsTmFtZSI6ImZ1bGxOYW1lIiwibmlja25hbWUiOiJuaWNrbmFtZSJ9.RTSGm9WJUWwJCo9L1Ry6AHh6lb25hYzgOT4VV_z5lPE'
    );
    const userInfos: IUserInfosFromJWT = authService.getUserInfos();
    expect(userInfos.email).toEqual('email');
    expect(userInfos.fullName).toEqual('fullName');
    expect(userInfos.userName).toEqual('nickname');
  })

});
