import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { PasantiaService } from '../../../services/pasantia.service';
import { ActividadService, Actividad } from '../../../services/actividad.service';
import { PasantiaAdmin } from '../../../models/pasantia-admin.model';

@Component({
  selector: 'app-tutor-actividades',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <h1>Actividades de Tutorados</h1>
      <p>Revisa y valida las actividades registradas por tus estudiantes</p>
    </div>

    <!-- Selector tutorado -->
    <div class="selector-card">
      <div class="selector-row">
        <label class="selector-label">Estudiante:</label>
        <select class="selector-select" (change)="seleccionar($event)" [disabled]="cargandoTutorados">
          <option value="">— Selecciona un tutorado —</option>
          <option *ngFor="let t of tutorados" [value]="t.idPte">
            {{ t.nombreEstudiante }} · {{ t.nombreEmpresa }}
          </option>
        </select>
      </div>
      <div class="horas-info" *ngIf="tutoradoActual">
        <span class="material-icons">schedule</span>
        <strong>{{ tutoradoActual.horasCompletadas }}</strong>&nbsp;/ {{ tutoradoActual.horasRequeridas }} h validadas
        <div class="progress-bar">
          <div class="progress-fill" [style.width.%]="porcentaje(tutoradoActual)"></div>
        </div>
        <span class="pct">{{ porcentaje(tutoradoActual) }}%</span>
      </div>
    </div>

    <!-- Sin tutorado seleccionado -->
    <div class="empty-card" *ngIf="!tutoradoActual && !cargandoTutorados">
      <span class="material-icons">how_to_reg</span>
      <p>Selecciona un tutorado para ver sus actividades.</p>
    </div>

    <!-- Loading actividades -->
    <div class="loading-card" *ngIf="cargandoActividades">
      <span class="material-icons spin">sync</span> Cargando actividades...
    </div>

    <!-- Tabla actividades -->
    <div class="table-card" *ngIf="tutoradoActual && !cargandoActividades">
      <div class="table-header">
        <h3>Actividades registradas</h3>
        <div class="resumen">
          <span class="badge-resumen pendiente">{{ pendientes }} pendientes</span>
          <span class="badge-resumen validadas">{{ validadas }} validadas</span>
        </div>
      </div>

      <div class="empty-act" *ngIf="actividades.length === 0">
        <span class="material-icons">inbox</span>
        <p>Este estudiante no ha registrado actividades aún.</p>
      </div>

      <table class="tabla" *ngIf="actividades.length > 0">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Título</th>
            <th>Descripción</th>
            <th>Horas</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let a of actividades" [class.row-validada]="a.validada">
            <td class="td-fecha">{{ a.fecha | date:'dd/MM/yyyy' }}</td>
            <td class="td-titulo">{{ a.titulo }}</td>
            <td class="td-desc">{{ a.descripcion || '—' }}</td>
            <td><span class="badge-horas">{{ a.horas }}h</span></td>
            <td>
              <span class="badge" [class]="a.validada ? 'badge-ok' : 'badge-pend'">
                {{ a.validada ? 'Validada' : 'Pendiente' }}
              </span>
            </td>
            <td>
              <button
                class="btn-validar"
                *ngIf="!a.validada"
                [disabled]="validando === a.idActividad"
                (click)="validar(a)">
                <span class="material-icons">check_circle</span>
                {{ validando === a.idActividad ? 'Validando...' : 'Validar' }}
              </button>
              <span class="validado-en" *ngIf="a.validada && a.validadoEn">
                {{ a.validadoEn | date:'dd/MM/yy' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 1.6rem; color: #1a3050; margin: 0; }
    .page-header p { color: #666; margin: 4px 0 0; }

    .selector-card {
      background: #fff; border-radius: 12px; padding: 20px 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06); margin-bottom: 20px;
      display: flex; align-items: center; gap: 24px; flex-wrap: wrap;
    }
    .selector-row { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 280px; }
    .selector-label { font-weight: 600; color: #1a3050; white-space: nowrap; }
    .selector-select {
      flex: 1; padding: 8px 12px; border: 1px solid #d0d7e8; border-radius: 8px;
      font-size: 0.9rem; color: #333; background: #f8f9ff; cursor: pointer;
    }
    .selector-select:focus { outline: none; border-color: #1976d2; }

    .horas-info {
      display: flex; align-items: center; gap: 8px; font-size: 0.9rem; color: #444;
      flex-wrap: wrap;
    }
    .horas-info .material-icons { font-size: 18px; color: #1976d2; }
    .progress-bar {
      width: 120px; height: 8px; background: #e0e0e0; border-radius: 4px; overflow: hidden;
    }
    .progress-fill { height: 100%; background: #1976d2; border-radius: 4px; transition: width 0.3s; }
    .pct { font-weight: 600; color: #1976d2; }

    .empty-card, .loading-card {
      background: #fff; border-radius: 12px; padding: 48px; text-align: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06); margin-bottom: 20px;
      color: #888;
    }
    .empty-card .material-icons { font-size: 48px; color: #ccc; display: block; margin-bottom: 12px; }
    .loading-card { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 32px; }
    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .table-card {
      background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      overflow: hidden;
    }
    .table-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 20px; border-bottom: 1px solid #f0f0f0;
    }
    .table-header h3 { margin: 0; font-size: 1rem; color: #1a3050; }
    .resumen { display: flex; gap: 8px; }
    .badge-resumen {
      padding: 3px 10px; border-radius: 20px; font-size: 0.78rem; font-weight: 600;
    }
    .badge-resumen.pendiente { background: #fef3c7; color: #92400e; }
    .badge-resumen.validadas { background: #d1fae5; color: #065f46; }

    .empty-act { padding: 40px; text-align: center; color: #888; }
    .empty-act .material-icons { font-size: 36px; color: #ccc; display: block; margin-bottom: 8px; }

    .tabla { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
    .tabla thead { background: #f0f4ff; }
    .tabla th { padding: 11px 14px; text-align: left; font-weight: 600; color: #1a3050; }
    .tabla td { padding: 10px 14px; border-top: 1px solid #f0f0f0; color: #333; vertical-align: middle; }
    .tabla tbody tr:hover { background: #fafbff; }
    .row-validada { opacity: 0.75; background: #f9fff9 !important; }

    .td-fecha { white-space: nowrap; color: #555; }
    .td-titulo { font-weight: 500; }
    .td-desc { max-width: 200px; color: #666; }

    .badge-horas {
      background: #e8f0fe; color: #1565c0; padding: 2px 8px;
      border-radius: 12px; font-weight: 600; font-size: 0.82rem;
    }
    .badge { padding: 3px 10px; border-radius: 20px; font-size: 0.78rem; font-weight: 600; }
    .badge-ok { background: #d1fae5; color: #065f46; }
    .badge-pend { background: #fef3c7; color: #92400e; }

    .btn-validar {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 5px 12px; background: #1976d2; color: #fff;
      border: none; border-radius: 6px; font-size: 0.82rem; cursor: pointer;
      transition: background 0.2s;
    }
    .btn-validar:hover:not(:disabled) { background: #1565c0; }
    .btn-validar:disabled { background: #90caf9; cursor: default; }
    .btn-validar .material-icons { font-size: 16px; }

    .validado-en { font-size: 0.78rem; color: #4caf50; }
  `]
})
export class TutorActividadesComponent implements OnInit {
  tutorados: PasantiaAdmin[] = [];
  tutoradoActual: PasantiaAdmin | null = null;
  actividades: Actividad[] = [];
  cargandoTutorados = false;
  cargandoActividades = false;
  validando: number | null = null;

  get pendientes(): number { return this.actividades.filter(a => !a.validada).length; }
  get validadas(): number  { return this.actividades.filter(a =>  a.validada).length; }

  constructor(
    private auth: AuthService,
    private pasantiaService: PasantiaService,
    private actividadService: ActividadService
  ) {}

  ngOnInit(): void {
    const usuario = this.auth.getUsuario();
    if (!usuario) return;
    this.cargandoTutorados = true;
    this.pasantiaService.listarPorUsuarioTutor(usuario.idUsuario).subscribe({
      next: res => {
        this.tutorados = res.exito && res.data ? res.data : [];
        this.cargandoTutorados = false;
      },
      error: () => { this.cargandoTutorados = false; }
    });
  }

  seleccionar(event: Event): void {
    const idPte = parseInt((event.target as HTMLSelectElement).value, 10);
    if (!idPte) { this.tutoradoActual = null; this.actividades = []; return; }
    this.tutoradoActual = this.tutorados.find(t => t.idPte === idPte) ?? null;
    if (!this.tutoradoActual) return;
    this.cargarActividades();
  }

  cargarActividades(): void {
    if (!this.tutoradoActual) return;
    this.cargandoActividades = true;
    this.actividadService.listarPorPasantia(this.tutoradoActual.idPasantia).subscribe({
      next: res => {
        this.actividades = res.exito && res.data ? res.data : [];
        this.cargandoActividades = false;
      },
      error: () => { this.cargandoActividades = false; }
    });
  }

  validar(act: Actividad): void {
    this.validando = act.idActividad;
    this.actividadService.validar(act.idActividad).subscribe({
      next: res => {
        this.validando = null;
        if (res.exito) {
          // Actualiza la actividad localmente
          act.validada = true;
          act.validadoEn = new Date().toISOString();
          // Recalcula horas en tutorado actual
          if (this.tutoradoActual) {
            const horasValidadas = this.actividades
              .filter(a => a.validada)
              .reduce((sum, a) => sum + a.horas, 0);
            this.tutoradoActual = { ...this.tutoradoActual, horasCompletadas: Math.round(horasValidadas) };
          }
        }
      },
      error: () => { this.validando = null; }
    });
  }

  porcentaje(t: PasantiaAdmin): number {
    if (!t.horasRequeridas) return 0;
    return Math.min(100, Math.round((t.horasCompletadas / t.horasRequeridas) * 100));
  }
}

