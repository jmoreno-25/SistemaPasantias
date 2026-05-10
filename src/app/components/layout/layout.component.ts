import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginResponse } from '../../models/auth.model';

interface MenuItem {
  label: string;
  icon: string;
  ruta: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
  usuario: LoginResponse | null = null;
  menuItems: MenuItem[] = [];

  private menuPorRol: Record<string, MenuItem[]> = {
    Administrador: [
      { label: 'Dashboard', icon: 'dashboard', ruta: '/admin/dashboard' },
      { label: 'Usuarios', icon: 'people', ruta: '/admin/usuarios' },
      { label: 'Facultades', icon: 'account_balance', ruta: '/admin/facultades' },
      { label: 'Empresas', icon: 'business', ruta: '/admin/empresas' },
      { label: 'Ofertas', icon: 'work', ruta: '/admin/ofertas' },
      { label: 'Pasantías', icon: 'assignment', ruta: '/admin/pasantias' },
      { label: 'Postulaciones', icon: 'send', ruta: '/admin/postulaciones' },
      { label: 'Períodos', icon: 'date_range', ruta: '/admin/periodos' },
      { label: 'Auditoría', icon: 'history', ruta: '/admin/auditoria' }
    ],
    Responsable: [
      { label: 'Dashboard', icon: 'dashboard', ruta: '/responsable/dashboard' },
      { label: 'Ofertas', icon: 'work', ruta: '/responsable/ofertas' },
      { label: 'Estudiantes', icon: 'school', ruta: '/responsable/estudiantes' },
      { label: 'Empresas', icon: 'business', ruta: '/responsable/empresas' },
      { label: 'Pasantías', icon: 'assignment', ruta: '/responsable/pasantias' },
      { label: 'Postulaciones', icon: 'send', ruta: '/responsable/postulaciones' }
    ],
    Estudiante: [
      { label: 'Ofertas', icon: 'work', ruta: '/estudiante/ofertas' },
      { label: 'Mis Postulaciones', icon: 'send', ruta: '/estudiante/postulaciones' },
      { label: 'Mi Pasantía', icon: 'assignment', ruta: '/estudiante/pasantia' },
      { label: 'Registrar Pasantía', icon: 'add_task', ruta: '/estudiante/registrar-pasantia' },
      { label: 'Actividades', icon: 'edit_note', ruta: '/estudiante/actividades' }
    ],
    Tutor: [
      { label: 'Mis Tutorados', icon: 'people', ruta: '/tutor/tutorados' },
      { label: 'Actividades', icon: 'checklist', ruta: '/tutor/actividades' }
    ]
  };

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.usuarioActual$.subscribe(u => {
      this.usuario = u;
      this.menuItems = u ? (this.menuPorRol[u.rol] || []) : [];
    });
  }

  getInitials(): string {
    if (!this.usuario) return '';
    const n = this.usuario.nombres?.charAt(0) || '';
    const a = this.usuario.apellidos?.charAt(0) || '';
    return (n + a).toUpperCase();
  }

  getRolLabel(): string {
    if (!this.usuario) return '';
    const labels: Record<string, string> = {
      Administrador: 'Administrador',
      Responsable: 'Responsable de Prácticas',
      Estudiante: 'Estudiante',
      Tutor: 'Tutor Empresarial'
    };
    return labels[this.usuario.rol] || this.usuario.rol;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
