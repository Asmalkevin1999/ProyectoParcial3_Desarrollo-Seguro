import {
  HttpInterceptorFn
} from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (
  req,
  next
) => {

  const token =
    localStorage.getItem('accessToken') ||
    localStorage.getItem('tempToken');

  if (token) {

    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

  }

  return next(req);

};