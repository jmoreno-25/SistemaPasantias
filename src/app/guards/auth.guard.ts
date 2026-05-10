import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard funcional que protege rutas que requieren autenticación.
 * Si no hay token, redirige a /login.
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

/**
 * Guard funcional que verifica si el usuario tiene uno de los roles permitidos.
 * Uso: canActivate: [roleGuard], data: { roles: ['DocenteTecnico'] }
 */
export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const rolesPermitidos: string[] = route.data?.['roles'] || [];
  const rolUsuario = authService.getRol();

  if (rolesPermitidos.length === 0 || (rolUsuario && rolesPermitidos.includes(rolUsuario))) {
    return true;
  }

  // Redirigir a la ruta de inicio del rol actual
  const rutaInicio: Record<string, string> = {
    Administrador: '/admin/dashboard',
    Responsable: '/responsable/dashboard',
    Docente: '/docente/dashboard',
    Estudiante: '/estudiante/ofertas',
    Tutor: '/tutor/tutorados'
  };
  router.navigate([rutaInicio[rolUsuario || ''] || '/login']);
  return false;
};
