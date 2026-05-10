import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PasantiaService } from '../../../services/pasantia.service';
import { ActividadService, Actividad } from '../../../services/actividad.service';
import { PasantiaAdmin, PasantiaDetalle } from '../../../models/pasantia-admin.model';

@Component({
  selector: 'app-admin-pasantias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-pasantias.component.html',
  styleUrl: './admin-pasantias.component.css'
})
export class AdminPasantiasComponent implements OnInit {
  pasantias: PasantiaAdmin[] = [];
  busqueda = '';
  filtroEstado = '';
  cargando = false;
  mensaje = '';
  esError = false;

  // Modal ediciÃ³n
  mostrarModal = false;
  pasantiaEditando: any = {};
  esNuevo = false;
  guardando = false;

  // Panel detalle
  mostrarDetalle = false;
  detalleCargando = false;
  detalle: PasantiaDetalle | null = null;
  actividades: Actividad[] = [];
  actividadesCargando = false;

  constructor(private pasantiaService: PasantiaService, private actividadService: ActividadService) {}

  ngOnInit(): void { this.cargarPasantias(); }

  cargarPasantias(): void {
    this.cargando = true;
    this.pasantiaService.listar().subscribe({
      next: res => { this.cargando = false; if (res.exito) this.pasantias = res.data; },
      error: () => { this.cargando = false; }
    });
  }

  get pasantiasFiltradas(): PasantiaAdmin[] {
    let lista = this.pasantias;
    if (this.filtroEstado) lista = lista.filter(p => p.estadoPasantia === this.filtroEstado);
    if (this.busqueda.trim()) {
      const b = this.busqueda.toLowerCase();
      lista = lista.filter(p =>
        p.nombreEstudiante?.toLowerCase().includes(b) ||
        p.nombreEmpresa?.toLowerCase().includes(b) ||
        p.estadoPasantia?.toLowerCase().includes(b)
      );
    }
    return lista;
  }

  // â”€â”€ Detalle â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  verDetalle(p: PasantiaAdmin): void {
    this.mostrarDetalle = true;
    this.detalle = p as any;
    this.detalleCargando = false;
    this.actividades = [];
    this.actividadesCargando = true;
    this.actividadService.listarPorPasantia(p.idPasantia).subscribe({
      next: res => { this.actividadesCargando = false; if (res.exito) this.actividades = res.data ?? []; },
      error: () => { this.actividadesCargando = false; }
    });
  }

  cerrarDetalle(): void {
    this.mostrarDetalle = false;
    this.detalle = null;
    this.actividades = [];
  }

  get porcentajeAvance(): number {
    if (!this.detalle || this.detalle.horasRequeridas <= 0) return 0;
    return Math.min(100, Math.round((this.detalle.horasCompletadas / this.detalle.horasRequeridas) * 100));
  }

  /** SVG pie chart: retorna el dash array para el arco completado */
  get arcCompletado(): string {
    const r = 54;
    const circ = 2 * Math.PI * r;
    const pct = this.porcentajeAvance / 100;
    return `${circ * pct} ${circ * (1 - pct)}`;
  }

  get arcRestante(): string {
    const r = 54;
    const circ = 2 * Math.PI * r;
    const pct = this.porcentajeAvance / 100;
    return `${circ * (1 - pct)} ${circ * pct}`;
  }

  get strokeOffset(): number {
    const r = 54;
    const circ = 2 * Math.PI * r;
    return circ * 0.25; // empieza arriba
  }

  // â”€â”€ CRUD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  nuevaPasantia(): void {
    this.pasantiaEditando = { horasRequeridas: 240, estado: 'En curso' };
    this.esNuevo = true;
    this.mostrarModal = true;
    this.mensaje = '';
  }

  editarPasantia(p: PasantiaAdmin): void {
    this.pasantiaEditando = {
      idPasantia:       p.idPasantia,
      cargoPasantia:    p.cargoPasantia || '',
      estadoPasantia:   p.estadoPasantia || 'En curso',
      fechaInicio:      p.fechaInicio ? p.fechaInicio.substring(0, 10) : '',
      fechaFin:         p.fechaFin    ? p.fechaFin.substring(0, 10)    : '',
      horasRequeridas:  p.horasRequeridas  || 240,
      horasCompletadas: p.horasCompletadas || 0
    };
    this.esNuevo = false;
    this.mostrarModal = true;
    this.mensaje = '';
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.pasantiaEditando = {};
    this.mensaje = '';
  }

  guardarPasantia(): void {
    this.guardando = true;
    // Mapear propiedades del ViewModel al modelo que espera el backend
    const payload = {
      idPasantia:       this.pasantiaEditando.idPasantia,
      cargo:            this.pasantiaEditando.cargoPasantia    || null,
      estado:           this.pasantiaEditando.estadoPasantia   || 'En curso',
      fechaInicio:      this.pasantiaEditando.fechaInicio      || null,
      fechaFin:         this.pasantiaEditando.fechaFin         || null,
      horasRequeridas:  Number(this.pasantiaEditando.horasRequeridas)  || 240,
      horasCompletadas: Number(this.pasantiaEditando.horasCompletadas) || 0
    };
    const obs = this.esNuevo
      ? this.pasantiaService.crear(this.pasantiaEditando)
      : this.pasantiaService.actualizar(this.pasantiaEditando.idPasantia, payload);
    obs.subscribe({
      next: res => {
        this.guardando = false;
        if (res.exito) {
          this.cerrarModal();
          this.cargarPasantias();
          this.mostrarMensaje(this.esNuevo ? 'Pasantía creada correctamente.' : 'Pasantía actualizada correctamente.', false);
        } else { this.mensaje = res.mensaje; this.esError = true; }
      },
      error: () => { this.guardando = false; this.mensaje = 'Error de conexión.'; this.esError = true; }
    });
  }

  eliminarPasantia(p: PasantiaAdmin): void {
    if (!confirm(`¿Cancelar la pasantía de "${p.nombreEstudiante}"?`)) return;
    this.pasantiaService.eliminar(p.idPasantia).subscribe({
      next: res => { if (res.exito) { this.cargarPasantias(); this.mostrarMensaje('Pasantía cancelada.', false); } }
    });
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'En Curso': return 'badge-info';
      case 'Finalizada': return 'badge-success';
      case 'Cancelada': return 'badge-danger';
      default: return '';
    }
  }

  private mostrarMensaje(msg: string, error: boolean): void {
    this.mensaje = msg; this.esError = error;
    setTimeout(() => this.mensaje = '', 3000);
  }
}
