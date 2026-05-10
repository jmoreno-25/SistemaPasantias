import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PasantiaService } from '../../../services/pasantia.service';
import { PasantiaAdmin, PasantiaDetalle } from '../../../models/pasantia-admin.model';
import { ActividadService, Actividad } from '../../../services/actividad.service';

@Component({
  selector: 'app-docente-pasantias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <h1>Pasantías</h1>
      <p>Seguimiento de pasantías en el sistema</p>
    </div>
    <div class="toolbar">
      <input type="text" [(ngModel)]="busqueda" placeholder="Buscar por estudiante, empresa o tutor..." class="input-search">
      <select [(ngModel)]="filtroEstado" class="select-filtro">
        <option value="">Todos los estados</option>
        <option value="En curso">En curso</option>
        <option value="Completada">Completada</option>
        <option value="Cancelada">Cancelada</option>
      </select>
    </div>
    <div class="table-container" *ngIf="!cargando">
      <table class="data-table">
        <thead>
          <tr>
            <th>Estudiante</th>
            <th>Empresa</th>
            <th>Tutor</th>
            <th>Cargo</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Horas</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let p of pasantiasFiltradas">
            <td>{{ p.nombreEstudiante || '—' }}</td>
            <td>{{ p.nombreEmpresa || '—' }}</td>
            <td>{{ p.nombreTutor || '—' }}</td>
            <td>{{ p.cargoPasantia || '—' }}</td>
            <td>{{ p.fechaInicio ? (p.fechaInicio | date:'dd/MM/yyyy') : '—' }}</td>
            <td>{{ p.fechaFin   ? (p.fechaFin   | date:'dd/MM/yyyy') : '—' }}</td>
            <td>{{ p.horasCompletadas }} / {{ p.horasRequeridas }}</td>
            <td><span class="badge" [ngClass]="estadoClass(p.estadoPasantia || '')">{{ p.estadoPasantia }}</span></td>
            <td class="acciones">
              <button class="btn-icon btn-view" (click)="verDetalle(p)" title="Ver detalle">
                <span class="material-icons">visibility</span>
              </button>
            </td>
          </tr>
          <tr *ngIf="pasantiasFiltradas.length === 0">
            <td colspan="9" class="empty-row">No se encontraron pasantías.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div *ngIf="cargando" class="loading"><span class="material-icons spin">sync</span> Cargando...</div>

    <!-- Panel Detalle -->
    <div class="detalle-overlay" *ngIf="mostrarDetalle" (click)="cerrarDetalle()">
      <div class="detalle-panel" (click)="$event.stopPropagation()">
        <div class="detalle-header">
          <h2><span class="material-icons">school</span> Detalle de Pasantía</h2>
          <button class="btn-icon" (click)="cerrarDetalle()"><span class="material-icons">close</span></button>
        </div>
        <div *ngIf="detalleCargando" class="loading"><span class="material-icons spin">sync</span> Cargando...</div>
        <div *ngIf="detalle && !detalleCargando" class="detalle-body">
          <div class="avance-section">
            <svg viewBox="0 0 120 120" class="pie-chart">
              <circle cx="60" cy="60" r="54" fill="none" stroke="#e0e0e0" stroke-width="12"/>
              <circle cx="60" cy="60" r="54" fill="none"
                      [attr.stroke]="porcentajeAvance >= 100 ? '#2e7d32' : '#1976d2'"
                      stroke-width="12" stroke-linecap="round"
                      [attr.stroke-dasharray]="arcCompletado"
                      [attr.stroke-dashoffset]="strokeOffset"
                      style="transform-origin:center;transform:rotate(-90deg)"/>
              <text x="60" y="56" text-anchor="middle" class="pie-pct">{{ porcentajeAvance }}%</text>
              <text x="60" y="72" text-anchor="middle" class="pie-label">Avance</text>
            </svg>
            <div class="avance-meta">
              <p><strong>{{ detalle.horasCompletadas }}</strong> / {{ detalle.horasRequeridas }} horas completadas</p>
              <span class="badge" [ngClass]="estadoClass(detalle.estadoPasantia || '')">{{ detalle.estadoPasantia }}</span>
            </div>
          </div>
          <div class="detalle-grid">
            <div class="detalle-card">
              <h3><span class="material-icons">person</span> Estudiante</h3>
              <p><b>Nombre:</b> {{ detalle.nombreEstudiante }}</p>
            </div>
            <div class="detalle-card">
              <h3><span class="material-icons">business</span> Empresa</h3>
              <p><b>Razón Social:</b> {{ detalle.nombreEmpresa || '—' }}</p>
              <h3 style="margin-top:12px"><span class="material-icons">badge</span> Tutor</h3>
              <p><b>Nombre:</b> {{ detalle.nombreTutor || '—' }}</p>
            </div>
            <div class="detalle-card">
              <h3><span class="material-icons">calendar_today</span> Cronograma</h3>
              <p><b>Cargo:</b> {{ detalle.cargoPasantia || '—' }}</p>
              <p><b>Fecha inicio:</b> {{ detalle.fechaInicio | date:'dd/MM/yyyy' }}</p>
            </div>
          </div>
          <div class="actividades-section">
            <h3><span class="material-icons">edit_note</span> Actividades registradas</h3>
            <div *ngIf="actividadesCargando" class="loading-small"><span class="material-icons spin">sync</span> Cargando...</div>
            <table *ngIf="!actividadesCargando" class="act-table">
              <thead><tr><th>Fecha</th><th>Título</th><th>Descripción</th><th>Horas</th></tr></thead>
              <tbody>
                <tr *ngFor="let a of actividades">
                  <td>{{ a.fecha | date:'dd/MM/yyyy' }}</td>
                  <td><strong>{{ a.titulo }}</strong></td>
                  <td class="td-desc">{{ a.descripcion || '—' }}</td>
                  <td><span class="badge-horas">{{ a.horas }}h</span></td>
                </tr>
                <tr *ngIf="actividades.length === 0">
                  <td colspan="4" class="empty-act">Sin actividades registradas.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 1.6rem; color: #1a3050; margin: 0; }
    .page-header p { color: #666; margin: 4px 0 0; }
    .toolbar { display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
    .input-search { padding: 8px 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 0.9rem; min-width: 300px; }
    .select-filtro { padding: 8px 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 0.9rem; background: #fff; }
    .table-container { background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); overflow: hidden; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th { background: #f8f9fa; padding: 12px 16px; text-align: left; font-size: 0.8rem; text-transform: uppercase; color: #666; border-bottom: 1px solid #eee; }
    .data-table td { padding: 12px 16px; border-bottom: 1px solid #f0f0f0; font-size: 0.9rem; }
    .data-table tr:last-child td { border-bottom: none; }
    .data-table tr:hover td { background: #fafafa; }
    .empty-row { text-align: center; color: #aaa; padding: 32px; }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 0.78rem; font-weight: 600; }
    .badge-success { background: #e8f5e9; color: #2e7d32; }
    .badge-danger  { background: #fce4ec; color: #c62828; }
    .badge-warning { background: #fff8e1; color: #f57f17; }
    .badge-default { background: #f0f0f0; color: #555; }
    .acciones { display: flex; gap: 6px; }
    .btn-icon { background: none; border: none; cursor: pointer; padding: 6px; border-radius: 6px; display: flex; align-items: center; transition: all 0.2s; }
    .btn-icon .material-icons { font-size: 20px; }
    .btn-view { color: #2e7d32; } .btn-view:hover { background: #e8f5e9; }
    .loading { display: flex; align-items: center; gap: 8px; padding: 32px; justify-content: center; color: #666; }
    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    /* Panel Detalle */
    .detalle-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.55); z-index: 1000; display: flex; align-items: flex-start; justify-content: flex-end; }
    .detalle-panel { background: #fff; width: 90%; max-width: 780px; height: 100%; overflow-y: auto; box-shadow: -4px 0 24px rgba(0,0,0,0.18); display: flex; flex-direction: column; }
    .detalle-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 28px; border-bottom: 1px solid #eee; position: sticky; top: 0; background: #fff; z-index: 1; }
    .detalle-header h2 { margin: 0; font-size: 1.2rem; color: #1a3050; display: flex; align-items: center; gap: 8px; }
    .detalle-body { padding: 24px 28px; flex: 1; }
    .avance-section { display: flex; align-items: center; gap: 24px; margin-bottom: 24px; background: #f8fbff; border-radius: 12px; padding: 20px; }
    .pie-chart { width: 120px; height: 120px; flex-shrink: 0; }
    .pie-pct { font-size: 18px; font-weight: 700; fill: #1a3050; }
    .pie-label { font-size: 10px; fill: #888; }
    .avance-meta { display: flex; flex-direction: column; gap: 8px; }
    .avance-meta p { margin: 0; font-size: 0.95rem; color: #333; }
    .avance-meta strong { font-size: 1.4rem; color: #1976d2; }
    .detalle-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 24px; }
    .detalle-card { background: #f8f9fa; border-radius: 10px; padding: 16px; }
    .detalle-card h3 { margin: 0 0 10px; font-size: 0.85rem; color: #1a3050; display: flex; align-items: center; gap: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
    .detalle-card h3 .material-icons { font-size: 18px; }
    .detalle-card p { margin: 4px 0; font-size: 0.88rem; color: #444; }
    .actividades-section { margin-top: 24px; }
    .actividades-section h3 { font-size: 0.9rem; color: #1a3050; margin-bottom: 12px; display: flex; align-items: center; gap: 6px; }
    .act-table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
    .act-table th { background: #f0f4f8; padding: 10px 12px; text-align: left; font-size: 0.8rem; color: #666; font-weight: 600; border-bottom: 2px solid #e0e0e0; }
    .act-table td { padding: 10px 12px; border-bottom: 1px solid #f0f0f0; color: #333; vertical-align: top; }
    .td-desc { color: #777; font-size: 0.85rem; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .badge-horas { background: #e3f2fd; color: #1565c0; padding: 3px 10px; border-radius: 20px; font-weight: 600; font-size: .8rem; }
    .empty-act { text-align: center; color: #aaa; padding: 20px; font-size: 0.9rem; }
    .loading-small { display: flex; align-items: center; gap: 8px; color: #888; padding: 12px 0; font-size: .9rem; }
  `]
})
export class DocentePasantiasComponent implements OnInit {
  pasantias: PasantiaAdmin[] = [];
  busqueda = '';
  filtroEstado = '';
  cargando = false;

  // Panel detalle
  mostrarDetalle = false;
  detalleCargando = false;
  detalle: PasantiaDetalle | null = null;
  actividades: Actividad[] = [];
  actividadesCargando = false;

  constructor(
    private pasantiaService: PasantiaService,
    private actividadService: ActividadService
  ) {}

  ngOnInit(): void {
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
        (p.nombreEstudiante || '').toLowerCase().includes(b) ||
        (p.nombreEmpresa    || '').toLowerCase().includes(b) ||
        (p.nombreTutor      || '').toLowerCase().includes(b)
      );
    }
    return lista;
  }

  estadoClass(estado: string): string {
    const map: Record<string, string> = {
      'En curso':   'badge-success',
      'Completada': 'badge-default',
      'Cancelada':  'badge-danger'
    };
    return map[estado] || 'badge-default';
  }

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
    if (!this.detalle || !this.detalle.horasRequeridas) return 0;
    return Math.min(100, Math.round(this.detalle.horasCompletadas / this.detalle.horasRequeridas * 100));
  }

  get arcCompletado(): string {
    const circ = 2 * Math.PI * 54;
    const pct = this.porcentajeAvance / 100;
    return `${pct * circ} ${circ}`;
  }

  get strokeOffset(): number {
    const circ = 2 * Math.PI * 54;
    return circ * 0.25;
  }
}
