import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/registro/registro.component').then(m => m.RegistroComponent)
  },
  {
    path: '',
    loadComponent: () => import('./components/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      // â”€â”€ Administrador â”€â”€
      {
        path: 'admin/dashboard',
        loadComponent: () => import('./pages/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        canActivate: [roleGuard], data: { roles: ['Administrador'] }
      },
      {
        path: 'admin/usuarios',
        loadComponent: () => import('./pages/admin/usuarios/admin-usuarios.component').then(m => m.AdminUsuariosComponent),
        canActivate: [roleGuard], data: { roles: ['Administrador'] }
      },
      {
        path: 'admin/facultades',
        loadComponent: () => import('./pages/admin/facultades/admin-facultades.component').then(m => m.AdminFacultadesComponent),
        canActivate: [roleGuard], data: { roles: ['Administrador'] }
      },
      {
        path: 'admin/empresas',
        loadComponent: () => import('./pages/admin/empresas/admin-empresas.component').then(m => m.AdminEmpresasComponent),
        canActivate: [roleGuard], data: { roles: ['Administrador'] }
      },
      {
        path: 'admin/ofertas',
        loadComponent: () => import('./pages/admin/ofertas/admin-ofertas.component').then(m => m.AdminOfertasComponent),
        canActivate: [roleGuard], data: { roles: ['Administrador'] }
      },
      {
        path: 'admin/pasantias',
        loadComponent: () => import('./pages/admin/pasantias/admin-pasantias.component').then(m => m.AdminPasantiasComponent),
        canActivate: [roleGuard], data: { roles: ['Administrador'] }
      },
      {
        path: 'admin/periodos',
        loadComponent: () => import('./pages/admin/periodos/admin-periodos.component').then(m => m.AdminPeriodosComponent),
        canActivate: [roleGuard], data: { roles: ['Administrador'] }
      },
      {
        path: 'admin/auditoria',
        loadComponent: () => import('./pages/admin/auditoria/admin-auditoria.component').then(m => m.AdminAuditoriaComponent),
        canActivate: [roleGuard], data: { roles: ['Administrador'] }
      },
      {
        path: 'admin/postulaciones',
        loadComponent: () => import('./pages/admin/postulaciones/admin-postulaciones.component').then(m => m.AdminPostulacionesComponent),
        canActivate: [roleGuard], data: { roles: ['Administrador'] }
      },
      // â”€â”€ Docente â”€â”€
      {
        path: 'responsable/dashboard',
        loadComponent: () => import('./pages/docente/dashboard/docente-dashboard.component').then(m => m.DocenteDashboardComponent),
        canActivate: [roleGuard], data: { roles: ['Responsable'] }
      },
      {
        path: 'responsable/ofertas',
        loadComponent: () => import('./pages/admin/ofertas/admin-ofertas.component').then(m => m.AdminOfertasComponent),
        canActivate: [roleGuard], data: { roles: ['Responsable'] }
      },
      {
        path: 'responsable/estudiantes',
        loadComponent: () => import('./pages/docente/estudiantes/docente-estudiantes.component').then(m => m.DocenteEstudiantesComponent),
        canActivate: [roleGuard], data: { roles: ['Responsable'] }
      },
      {
        path: 'responsable/empresas',
        loadComponent: () => import('./pages/admin/empresas/admin-empresas.component').then(m => m.AdminEmpresasComponent),
        canActivate: [roleGuard], data: { roles: ['Responsable'] }
      },
      {
        path: 'responsable/pasantias',
        loadComponent: () => import('./pages/docente/pasantias/docente-pasantias.component').then(m => m.DocentePasantiasComponent),
        canActivate: [roleGuard], data: { roles: ['Responsable'] }
      },
      {
        path: 'responsable/postulaciones',
        loadComponent: () => import('./pages/docente/postulaciones/docente-postulaciones.component').then(m => m.DocentePostulacionesComponent),
        canActivate: [roleGuard], data: { roles: ['Responsable'] }
      },
      {
        path: 'responsable/rubricas',
        loadComponent: () => import('./pages/docente/rubricas/docente-rubricas.component').then(m => m.DocenteRubricasComponent),
        canActivate: [roleGuard], data: { roles: ['Responsable'] }
      },
      // â”€â”€ Estudiante â”€â”€
      {
        path: 'estudiante/ofertas',
        loadComponent: () => import('./pages/estudiante/ofertas/estudiante-ofertas.component').then(m => m.EstudianteOfertasComponent),
        canActivate: [roleGuard], data: { roles: ['Estudiante'] }
      },
      {
        path: 'estudiante/postulaciones',
        loadComponent: () => import('./pages/estudiante/postulaciones/estudiante-postulaciones.component').then(m => m.EstudiantePostulacionesComponent),
        canActivate: [roleGuard], data: { roles: ['Estudiante'] }
      },
      {
        path: 'estudiante/pasantia',
        loadComponent: () => import('./pages/estudiante/pasantia/estudiante-pasantia.component').then(m => m.EstudiantePasantiaComponent),
        canActivate: [roleGuard], data: { roles: ['Estudiante'] }
      },
      {
        path: 'estudiante/actividades',
        loadComponent: () => import('./pages/estudiante/actividades/estudiante-actividades.component').then(m => m.EstudianteActividadesComponent),
        canActivate: [roleGuard], data: { roles: ['Estudiante'] }
      },
      {
        path: 'estudiante/registrar-pasantia',
        loadComponent: () => import('./pages/estudiante/registrar-pasantia/registrar-pasantia.component').then(m => m.RegistrarPasantiaComponent),
        canActivate: [roleGuard], data: { roles: ['Estudiante'] }
      },
      // â”€â”€ Tutor â”€â”€
      {
        path: 'tutor/tutorados',
        loadComponent: () => import('./pages/tutor/tutorados/tutor-tutorados.component').then(m => m.TutorTutoradosComponent),
        canActivate: [roleGuard], data: { roles: ['Tutor'] }
      },
      {
        path: 'tutor/actividades',
        loadComponent: () => import('./pages/tutor/actividades/tutor-actividades.component').then(m => m.TutorActividadesComponent),
        canActivate: [roleGuard], data: { roles: ['Tutor'] }
      },
      {
        path: 'tutor/evaluar',
        loadComponent: () => import('./pages/tutor/evaluar/tutor-evaluar.component').then(m => m.TutorEvaluarComponent),
        canActivate: [roleGuard], data: { roles: ['Tutor'] }
      },
      // â”€â”€ Compartidas â”€â”€
      {
        path: 'perfil',
        loadComponent: () => import('./pages/perfil/perfil.component').then(m => m.PerfilComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
