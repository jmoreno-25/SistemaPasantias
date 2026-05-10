import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Interceptor funcional que agrega el token JWT al header Authorization
 * de todas las peticiones HTTP salientes.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(cloned);
  }

  return next(req);
};
