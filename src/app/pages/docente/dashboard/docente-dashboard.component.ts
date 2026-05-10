import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteService } from '../../../services/reporte.service';
import { PasantiaService } from '../../../services/pasantia.service';
import { ActividadService, Actividad } from '../../../services/actividad.service';
import { DashboardAdmin, ActividadReciente } from '../../../models/dashboard.model';
import { PasantiaAdmin } from '../../../models/pasantia-admin.model';

@Component({
  selector: 'app-docente-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './docente-dashboard.component.html',
  styleUrls: ['./docente-dashboard.component.css']
})
export class DocenteDashboardComponent implements OnInit {
  datos: DashboardAdmin | null = null;
  cargando = true;
  error = '';

  mostrarDetalle = false;
  detalle: PasantiaAdmin | null = null;
  actividades: Actividad[] = [];
  detalleCargando = false;
  actividadesCargando = false;

  constructor(
    private reporteService: ReporteService,
    private pasantiaService: PasantiaService,
    private actividadService: ActividadService
  ) {}

  ngOnInit(): void {
    this.reporteService.obtenerDashboard().subscribe({
      next: r => { this.datos = r.data; this.cargando = false; },
      error: () => { this.error = 'Error al cargar métricas.'; this.cargando = false; }
    });
  }

  maxInscritos(): number {
    if (!this.datos?.inscritosPorSemestre?.length) return 1;
    return Math.max(...this.datos.inscritosPorSemestre.map(s => s.total));
  }

  porcentaje(valor: number): number {
    const max = this.maxInscritos();
    return max === 0 ? 0 : Math.round((valor / max) * 100);
  }

  maxPeriodo(): number {
    if (!this.datos?.inscritosPorPeriodo?.length) return 1;
    return Math.max(...this.datos.inscritosPorPeriodo.map(p => p.totalInscritos));
  }

  pctPeriodo(valor: number): number {
    const max = this.maxPeriodo();
    return max === 0 ? 0 : Math.round((valor / max) * 100);
  }

  maxEmpresa(): number {
    if (!this.datos?.empresasConMasOfertas?.length) return 1;
    return Math.max(...this.datos.empresasConMasOfertas.map(e => e.totalOfertas));
  }

  pctEmpresa(valor: number): number {
    const max = this.maxEmpresa();
    return max === 0 ? 0 : Math.round((valor / max) * 100);
  }

  verDetalle(a: ActividadReciente): void {
    if (!a.idPasantia) return;
    this.mostrarDetalle = true;
    this.detalle = null;
    this.actividades = [];
    this.detalleCargando = true;

    this.pasantiaService.listar().subscribe({
      next: res => {
        this.detalleCargando = false;
        if (res.exito) {
          this.detalle = res.data.find(p => p.idPasantia === a.idPasantia) ?? null;
          if (this.detalle) {
            this.actividadesCargando = true;
            this.actividadService.listarPorPasantia(a.idPasantia).subscribe({
              next: r => { this.actividadesCargando = false; if (r.exito) this.actividades = r.data ?? []; },
              error: () => { this.actividadesCargando = false; }
            });
          }
        }
      },
      error: () => { this.detalleCargando = false; }
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

  get arcCompletado(): string {
    const r = 54;
    const circ = 2 * Math.PI * r;
    const pct = this.porcentajeAvance / 100;
    return `${circ * pct} ${circ * (1 - pct)}`;
  }

  get strokeOffset(): number {
    return 2 * Math.PI * 54 * 0.25;
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
