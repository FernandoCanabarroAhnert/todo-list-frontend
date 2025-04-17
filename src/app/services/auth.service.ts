import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ILoginResponse } from '../interfaces/login-response.interface';
import { IRegisterRequest } from '../interfaces/register-request.interface';
import { APPLY_AUTH_TOKEN } from '../interceptors/auth.interceptor';
import { IUpdateUserInfosRequest } from '../interfaces/update-user-infos-request.interface';
import { IUpdatePasswordRequest } from '../interfaces/update-password-request';
import { IUserInfosFromJWT } from '../interfaces/user-infos-from-jwt.interface';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly _http = inject(HttpClient);

  apiBaseUrl = 'https://todos.fernandocanabarrodev.tech';

  login(username: string, password: string): Observable<ILoginResponse> {
    return this._http.post<ILoginResponse>(this.apiBaseUrl + '/users/login',
        { email: username, password },
        { context: new HttpContext().set(APPLY_AUTH_TOKEN, false) }
      )
      .pipe(
        map(response => {
          localStorage.setItem('access-token', response.token);
          return response;
        })
      )
  }

  register(registerRequest: IRegisterRequest): Observable<void> {
    return this._http.post<void>(this.apiBaseUrl + '/users/register', registerRequest,
      { context: new HttpContext().set(APPLY_AUTH_TOKEN, false) }
    );
  }

  activateAccount(code: string): Observable<void> {
    return this._http.post<void>(this.apiBaseUrl + '/users/activate', { code },
      { context: new HttpContext().set(APPLY_AUTH_TOKEN, false) }
    );
  }

  verifyToken(): Observable<void> {
    const accessToken = localStorage.getItem('access-token');
    const headers = new HttpHeaders().set('authorization', `Bearer ${accessToken}`);
    return this._http.get<void>(this.apiBaseUrl + '/users/verify-token', { headers });
  }

  verifyEmail(email: string): Observable<{ isAlreadyInUse: boolean }> {
    return this._http.get<{ isAlreadyInUse: boolean }>(this.apiBaseUrl + '/users/verify-email', { params: { email } });
  }

  logout() {
    localStorage.removeItem('access-token');
  }

  updateUserInfos(request: IUpdateUserInfosRequest): Observable<void> {
    return this._http.put<void>(this.apiBaseUrl + '/users/update-infos', request);
  }

  updatePassword(request: IUpdatePasswordRequest): Observable<void> {
    return this._http.put<void>(this.apiBaseUrl + '/users/update-password', request);
  }

  getUserInfos(): IUserInfosFromJWT {
    const accessToken = localStorage.getItem('access-token');
    const decodedToken: any = jwtDecode(accessToken!);
    return {
      fullName: decodedToken.fullName,
      userName: decodedToken.nickname,
      email: decodedToken.sub
    };
  }

}
