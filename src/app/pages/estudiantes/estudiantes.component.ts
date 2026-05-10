import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { FacultadService } from '../../services/facultad.service';
import { CarreraService } from '../../services/carrera.service';
import { PasantiaService } from '../../services/pasantia.service';
import { ActividadService, Actividad } from '../../services/actividad.service';
import { Usuario, Facultad } from '../../models/usuario.model';
import { PasantiaAdmin } from '../../models/pasantia-admin.model';

@Component({
  selector: 'app-estudiantes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estudiantes.component.html',
  styleUrl: './estudiantes.component.css'
})
export class EstudiantesComponent implements OnInit {
  estudiantes: Usuario[] = [];
  facultadMap: Record<number, string> = {};
  carreraMap: Record<number, string> = {};
  cargando = false;

  // Panel detalle
  mostrarDetalle = false;
  detalleCargando = false;
  detalle: PasantiaAdmin | null = null;
  actividades: Actividad[] = [];
  actividadesCargando = false;
  sinPasantia = false;

  constructor(
    private usuarioService: UsuarioService,
    private facultadService: FacultadService,
    private carreraService: CarreraService,
    private pasantiaService: PasantiaService,
    private actividadService: ActividadService
  ) {}

  ngOnInit(): void {
    this.cargarEstudiantes();
    this.facultadService.listar().subscribe({
      next: (res) => {
        if (res.exito) {
          for (const f of res.data) {
            this.facultadMap[f.idFacultad] = f.nombre;
          }
        }
      }
    });
    this.carreraService.listar().subscribe({
      next: (res) => {
        if (res.exito) {
          for (const c of res.data) {
            this.carreraMap[c.idCarrera] = c.nombre;
          }
        }
      }
    });
  }

  cargarEstudiantes(): void {
    this.cargando = true;
    this.usuarioService.listar(1).subscribe({
      next: (res) => {
        this.cargando = false;
        if (res.exito) {
          this.estudiantes = res.data;
        }
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  getNombreFacultad(id?: number): string {
    return id ? (this.facultadMap[id] || 'N/A') : 'N/A';
  }

  getNombreCarrera(id?: number): string {
    return id ? (this.carreraMap[id] || 'N/A') : 'N/A';
  }

  verDetalle(est: Usuario): void {
    this.mostrarDetalle = true;
    this.detalle = null;
    this.actividades = [];
    this.detalleCargando = true;
    this.sinPasantia = false;

    this.pasantiaService.listarPorUsuario(est.idUsuario).subscribe({
      next: (res) => {
        this.detalleCargando = false;
        if (res.exito && res.data?.length) {
          this.detalle = res.data[0];
          this.actividadesCargando = true;
          this.actividadService.listarPorPasantia(this.detalle!.idPasantia).subscribe({
            next: (r) => {
              this.actividadesCargando = false;
              if (r.exito) this.actividades = r.data ?? [];
            },
            error: () => { this.actividadesCargando = false; }
          });
        } else {
          this.sinPasantia = true;
        }
      },
      error: () => {
        this.detalleCargando = false;
        this.sinPasantia = true;
      }
    });
  }

  cerrarDetalle(): void {
    this.mostrarDetalle = false;
    this.detalle = null;
    this.actividades = [];
    this.sinPasantia = false;
  }

  get porcentajeAvance(): number {
    if (!this.detalle || this.detalle.horasRequeridas <= 0) return 0;
    return Math.min(100, Math.round((this.detalle.horasCompletadas / this.detalle.horasRequeridas) * 100));
  }

  get arcCompletado(): string {
    const r = 54;
    const circ = 2 * Math.PI * r;
    const pct = this.porcentajeAvance / 100;
    return `${circ * pct} ${circ * (1 - pct)}`;
  }

  get strokeOffset(): number {
    const r = 54;
    const circ = 2 * Math.PI * r;
    return circ * 0.25;
  }

  getEstadoClass(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'en pasantia': return 'estado-activo';
      case 'completado': return 'estado-completado';
      case 'sin iniciar': return 'estado-pendiente';
      default: return 'estado-pendiente';
    }
  }

  getBadgeClass(estado: string): string {
    switch (estado) {
      case 'En Curso': return 'badge-info';
      case 'Finalizada': return 'badge-success';
      case 'Cancelada': return 'badge-danger';
      default: return '';
    }
  }
}
