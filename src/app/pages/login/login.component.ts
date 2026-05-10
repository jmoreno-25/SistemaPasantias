import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  contrasena = '';
  mensaje = '';
  cargando = false;
  esError = false;

  private rutaInicioPorRol: Record<string, string> = {
    Administrador: '/admin/dashboard',
    Responsable: '/responsable/dashboard',
    Docente: '/docente/dashboard',
    Estudiante: '/estudiante/ofertas',
    Tutor: '/tutor/tutorados'
  };

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isAuthenticated()) {
      const rol = this.authService.getRol();
      this.router.navigate([this.rutaInicioPorRol[rol || ''] || '/login']);
    }
  }

  login(): void {
    if (!this.email || !this.contrasena) {
      this.mensaje = 'Ingrese su email y contraseña.';
      this.esError = true;
      return;
    }

    this.cargando = true;
    this.mensaje = '';

    const request: LoginRequest = { email: this.email, contrasena: this.contrasena };

    this.authService.login(request).subscribe({
      next: (res) => {
        this.cargando = false;
        if (res.exito && res.data) {
          const ruta = this.rutaInicioPorRol[res.data.rol] || '/login';
          this.router.navigate([ruta]);
        } else {
          this.mensaje = res.mensaje;
          this.esError = true;
        }
      },
      error: () => {
        this.cargando = false;
        this.mensaje = 'Error de conexión con el servidor.';
        this.esError = true;
      }
    });
  }
}
