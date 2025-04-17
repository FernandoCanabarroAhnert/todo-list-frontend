import { HttpContextToken, HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export const APPLY_AUTH_TOKEN = new HttpContextToken<boolean>(() => true);

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  if (!req.context.get(APPLY_AUTH_TOKEN)) {
    return next(req);
  }
  else {
    const accessToken = localStorage.getItem('access-token');
    if (!accessToken) {
      return throwError(() => new HttpErrorResponse({ status: 401 }));
    }
    const requestWithAuthHeaders = req.clone({
      headers: req.headers.set('authorization', `Bearer ${accessToken}`)
    })
    return next(requestWithAuthHeaders);
  }
} 
