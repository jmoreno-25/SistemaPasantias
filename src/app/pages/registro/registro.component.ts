import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RolService } from '../../services/rol.service';
import { FacultadService } from '../../services/facultad.service';
import { CarreraService } from '../../services/carrera.service';
import { EmpresaService } from '../../services/empresa.service';
import { RegistroRequest } from '../../models/auth.model';
import { Rol } from '../../models/rol.model';
import { Facultad, Carrera, Empresa } from '../../models/usuario.model';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {
  modelo: RegistroRequest = {
    cedula: '',
    nombres: '',
    apellidos: '',
    email: '',
    contrasena: '',
    telefono: '',
    idRol: 0
  };

  selectedRol: number | null = null;
  rolSeleccionadoNombre = '';

  confirmarContrasena = '';
  roles: Rol[] = [];
  facultades: Facultad[] = [];
  carreras: Carrera[] = [];
  empresas: Empresa[] = [];
  mensaje = '';
  cargando = false;
  esError = false;

  constructor(
    private authService: AuthService,
    private rolService: RolService,
    private facultadService: FacultadService,
    private carreraService: CarreraService,
    private empresaService: EmpresaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.rolService.listar().subscribe({
      next: (res) => {
        if (res.exito) {
          this.roles = res.data.filter((r: Rol) => r.nombre !== 'Administrador');
        }
      }
    });
  }

  onRolChange(): void {
    const rol = this.roles.find(r => r.idRol === this.selectedRol);
    this.rolSeleccionadoNombre = rol ? rol.nombre : '';

    // Limpiar campos específicos
    this.modelo.idFacultad = undefined;
    this.modelo.idCarrera = undefined;
    this.modelo.semestre = undefined;
    this.modelo.tituloAcademico = undefined;
    this.modelo.especialidad = undefined;
    this.modelo.idEmpresa = undefined;
    this.modelo.cargo = undefined;
    this.carreras = [];

    if ((this.rolSeleccionadoNombre === 'Estudiante' || this.rolSeleccionadoNombre === 'Docente') && this.facultades.length === 0) {
      this.facultadService.listar().subscribe({
        next: (res) => { if (res.exito) this.facultades = res.data; }
      });
    }

    if (this.rolSeleccionadoNombre === 'Tutor' && this.empresas.length === 0) {
      this.empresaService.listar().subscribe({
        next: (res) => { if (res.exito) this.empresas = res.data; }
      });
    }
  }

  onFacultadChange(): void {
    this.modelo.idCarrera = undefined;
    this.carreras = [];
    if (this.modelo.idFacultad) {
      this.carreraService.listarPorFacultad(this.modelo.idFacultad).subscribe({
        next: (res) => { if (res.exito) this.carreras = res.data; }
      });
    }
  }

  registrar(): void {
    if (this.selectedRol) {
      this.modelo.idRol = this.selectedRol;
    }

    if (!this.modelo.cedula || !this.modelo.nombres || !this.modelo.apellidos ||
        !this.modelo.email || !this.modelo.contrasena || !this.modelo.idRol) {
      this.mensaje = 'Todos los campos obligatorios deben ser completados.';
      this.esError = true;
      return;
    }

    if (this.modelo.contrasena !== this.confirmarContrasena) {
      this.mensaje = 'Las contraseñas no coinciden.';
      this.esError = true;
      return;
    }

    if (this.modelo.contrasena.length < 6) {
      this.mensaje = 'La contraseña debe tener al menos 6 caracteres.';
      this.esError = true;
      return;
    }

    this.cargando = true;
    this.mensaje = '';

    this.authService.registro(this.modelo).subscribe({
      next: (res) => {
        this.cargando = false;
        if (res.exito) {
          this.mensaje = 'Registro exitoso. Redirigiendo al login...';
          this.esError = false;
          setTimeout(() => this.router.navigate(['/login']), 2000);
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
