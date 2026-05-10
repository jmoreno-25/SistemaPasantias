import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { EstudianteService } from '../../services/estudiante.service';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario.model';
import { Estudiante } from '../../models/estudiante.model';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  usuario: Usuario | null = null;
  estudiante: Estudiante | null = null;
  mensaje = '';
  esError = false;

  // Cambio de contraseña
  contrasenaActual = '';
  nuevaContrasena = '';
  confirmarNueva = '';
  mensajeContrasena = '';
  esErrorContrasena = false;

  // CV
  cvArchivo: File | null = null;
  subiendoCv = false;
  mensajeCv = '';
  esErrorCv = false;

  constructor(
    private usuarioService: UsuarioService,
    private estudianteService: EstudianteService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const auth = this.authService.getUsuario();
    if (!auth) return;

    this.usuarioService.obtenerPorId(auth.idUsuario).subscribe({
      next: (res) => {
        if (res.exito) {
          this.usuario = res.data;
          if (auth.rol === 'Estudiante' && auth.idPerfil) {
            this.estudianteService.obtenerPorId(auth.idPerfil).subscribe({
              next: r => { if (r.exito) this.estudiante = r.data; }
            });
          }
        }
      }
    });
  }

  get esEstudiante(): boolean {
    return this.authService.getUsuario()?.rol === 'Estudiante';
  }

  get rolActual(): string {
    return this.authService.getUsuario()?.rol || 'Usuario';
  }

  get iniciales(): string {
    if (!this.usuario) return '?';
    const n = (this.usuario.nombres || '').charAt(0).toUpperCase();
    const a = (this.usuario.apellidos || '').charAt(0).toUpperCase();
    return n + a;
  }

  onCvSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.cvArchivo = input.files[0];
      this.mensajeCv = '';
    }
  }

  subirCv(): void {
    if (!this.cvArchivo) return;
    const auth = this.authService.getUsuario();
    if (!auth?.idPerfil) return;

    this.subiendoCv = true;
    this.mensajeCv = '';
    this.estudianteService.subirCv(auth.idPerfil, this.cvArchivo).subscribe({
      next: (res) => {
        this.subiendoCv = false;
        this.esErrorCv = !res.exito;
        this.mensajeCv = res.mensaje;
        if (res.exito && this.estudiante) {
          this.estudiante = { ...this.estudiante, cvUrl: res.data.cvUrl };
          this.cvArchivo = null;
        }
      },
      error: () => {
        this.subiendoCv = false;
        this.esErrorCv = true;
        this.mensajeCv = 'Error de conexión al subir el CV.';
      }
    });
  }

  cambiarContrasena(): void {
    if (!this.contrasenaActual || !this.nuevaContrasena) {
      this.mensajeContrasena = 'Complete todos los campos.';
      this.esErrorContrasena = true;
      return;
    }

    if (this.nuevaContrasena !== this.confirmarNueva) {
      this.mensajeContrasena = 'Las contraseñas nuevas no coinciden.';
      this.esErrorContrasena = true;
      return;
    }

    if (this.usuario) {
      this.usuarioService.cambiarContrasena(
        this.usuario.idUsuario, this.contrasenaActual, this.nuevaContrasena
      ).subscribe({
        next: (res) => {
          this.mensajeContrasena = res.mensaje;
          this.esErrorContrasena = !res.exito;
          if (res.exito) {
            this.contrasenaActual = '';
            this.nuevaContrasena = '';
            this.confirmarNueva = '';
          }
        },
        error: () => {
          this.mensajeContrasena = 'Error de conexión.';
          this.esErrorContrasena = true;
        }
      });
    }
  }
}
