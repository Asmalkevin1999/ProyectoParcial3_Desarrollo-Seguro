import {
  HttpInterceptorFn,
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (
  req,
  next,
) => {

  const token =
    localStorage.getItem('tempToken') ||
    localStorage.getItem('accessToken');

  if (token) {

    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

  }

  return next(req).pipe(
    catchError((err) => {
      // Manejo centralizado de 401: limpiar sesión y redirigir al login
      if (err?.status === 401) {
        try {
          localStorage.clear();
        } catch (e) {
          // ignore
        }
        // Forzar navegación fuera del SPA (safe) o usar router si está disponible
        window.location.href = '/login';
      }
      return throwError(() => err);
    }),
  );

};