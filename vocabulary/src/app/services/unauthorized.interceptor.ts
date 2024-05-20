import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

//If error arrives with status 401, delete token (expired) and redirect to login
export const unauthorizedInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  return next(req).pipe(
    catchError((err) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        authService.removeToken();
        router.navigateByUrl('/login');
      }
      if (err instanceof HttpErrorResponse && err.status === 403) {
        router.navigateByUrl('/');
      }
      throw err;
    })
  );
};

