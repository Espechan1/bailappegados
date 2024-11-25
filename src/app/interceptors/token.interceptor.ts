import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  let bearer = '';
  const token = localStorage.getItem('token');
  if (token) {
    bearer = `Bearer ${token}`;
  }
  let newRequest = req.clone();
  if (bearer) {
    newRequest = req.clone({
      headers: req.headers.set('Authorization', bearer),
    });
  }
  return next(newRequest);
};
