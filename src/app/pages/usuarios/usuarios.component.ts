import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { RolService } from '../../services/rol.service';
import { Usuario } from '../../models/usuario.model';
import { Rol } from '../../models/rol.model';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  roles: Rol[] = [];
  filtroRol: number | null = null;
  cargando = false;
  mensaje = '';
  esError = false;

  constructor(
    private usuarioService: UsuarioService,
    private rolService: RolService
  ) {}

  ngOnInit(): void {
    this.rolService.listar().subscribe({
      next: (res) => { if (res.exito) this.roles = res.data; }
    });
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.cargando = true;
    const idRol = this.filtroRol ? this.filtroRol : undefined;

    this.usuarioService.listar(idRol).subscribe({
      next: (res) => {
        this.cargando = false;
        if (res.exito) {
          this.usuarios = res.data;
        }
      },
      error: () => {
        this.cargando = false;
        this.mensaje = 'Error al cargar usuarios.';
        this.esError = true;
      }
    });
  }

  filtrar(): void {
    this.cargarUsuarios();
  }

  getNombreRol(idRol: number): string {
    const rol = this.roles.find(r => r.idRol === idRol);
    return rol ? rol.nombre : '-';
  }

  desactivar(id: number): void {
    if (!confirm('¿Está seguro de desactivar este usuario?')) return;

    this.usuarioService.eliminar(id).subscribe({
      next: (res) => {
        this.mensaje = res.mensaje;
        this.esError = !res.exito;
        if (res.exito) this.cargarUsuarios();
      }
    });
  }
}
