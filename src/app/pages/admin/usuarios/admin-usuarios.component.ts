import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { RolService } from '../../../services/rol.service';
import { Usuario } from '../../../models/usuario.model';
import { Rol } from '../../../models/rol.model';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-usuarios.component.html',
  styleUrl: './admin-usuarios.component.css'
})
export class AdminUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  roles: Rol[] = [];
  filtroRol: number | null = null;
  busqueda = '';
  cargando = false;
  mensaje = '';
  esError = false;

  mostrarModal = false;
  usuarioEditando: Partial<Usuario> = {};
  guardando = false;

  constructor(private usuarioService: UsuarioService, private rolService: RolService) {}

  ngOnInit(): void {
    this.cargarRoles();
    this.cargarUsuarios();
  }

  cargarRoles(): void {
    this.rolService.listar().subscribe({
      next: res => { if (res.exito) this.roles = res.data; }
    });
  }

  cargarUsuarios(): void {
    this.cargando = true;
    this.usuarioService.listar(this.filtroRol ?? undefined).subscribe({
      next: res => {
        this.cargando = false;
        if (res.exito) this.usuarios = res.data;
      },
      error: () => { this.cargando = false; }
    });
  }

  get usuariosFiltrados(): Usuario[] {
    if (!this.busqueda.trim()) return this.usuarios;
    const b = this.busqueda.toLowerCase();
    return this.usuarios.filter(u =>
      u.nombres.toLowerCase().includes(b) ||
      u.apellidos.toLowerCase().includes(b) ||
      u.email.toLowerCase().includes(b) ||
      u.cedula.includes(b)
    );
  }

  getNombreRol(idRol: number): string {
    return this.roles.find(r => r.idRol === idRol)?.nombre || 'N/A';
  }

  filtrarPorRol(): void {
    this.cargarUsuarios();
  }

  editarUsuario(u: Usuario): void {
    this.usuarioEditando = { ...u };
    this.mostrarModal = true;
    this.mensaje = '';
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.usuarioEditando = {};
    this.mensaje = '';
  }

  guardarUsuario(): void {
    if (!this.usuarioEditando.idUsuario) return;
    this.guardando = true;
    this.usuarioService.actualizar(this.usuarioEditando.idUsuario, this.usuarioEditando).subscribe({
      next: res => {
        this.guardando = false;
        if (res.exito) {
          this.cerrarModal();
          this.cargarUsuarios();
          this.mostrarMensaje('Usuario actualizado correctamente.', false);
        } else {
          this.mensaje = res.mensaje;
          this.esError = true;
        }
      },
      error: () => { this.guardando = false; this.mensaje = 'Error de conexión.'; this.esError = true; }
    });
  }

  desactivarUsuario(u: Usuario): void {
    if (!confirm(`¿Desactivar a ${u.nombres} ${u.apellidos}?`)) return;
    this.usuarioService.eliminar(u.idUsuario).subscribe({
      next: res => {
        if (res.exito) { this.cargarUsuarios(); this.mostrarMensaje('Usuario desactivado.', false); }
      }
    });
  }

  private mostrarMensaje(msg: string, error: boolean): void {
    this.mensaje = msg;
    this.esError = error;
    setTimeout(() => this.mensaje = '', 3000);
  }
}
