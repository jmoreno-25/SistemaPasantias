import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { PasantiaService } from '../../../services/pasantia.service';
import { ActividadService, Actividad, NuevaActividad } from '../../../services/actividad.service';
import { PasantiaAdmin } from '../../../models/pasantia-admin.model';

@Component({
  selector: 'app-estudiante-actividades',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <h1>Actividades Diarias</h1>
      <p>Registra tus horas y actividades durante la pasantía</p>
    </div>

    <!-- Sin pasantia asignada -->
    <div *ngIf="!cargando && !pasantia" class="empty-box">
      <span class="material-icons">assignment_late</span>
      <p>No tienes ninguna pasantía activa. Solicita una asignación primero.</p>
    </div>

    <ng-container *ngIf="pasantia">

      <!-- Resumen de horas -->
      <div class="card resumen-card">
        <div class="resumen-item">
          <span class="r-num">{{ totalHoras }}</span>
          <span class="r-label">Horas registradas</span>
        </div>
        <div class="resumen-sep"></div>
        <div class="resumen-item">
          <span class="r-num">{{ pasantia.horasRequeridas }}</span>
          <span class="r-label">Horas requeridas</span>
        </div>
        <div class="resumen-sep"></div>
        <div class="resumen-item">
          <span class="r-num" [class.completo]="porcentaje >= 100">{{ porcentaje }}%</span>
          <span class="r-label">Avance</span>
        </div>
        <div class="progress-wrap">
          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="porcentaje" [class.completo]="porcentaje >= 100"></div>
          </div>
        </div>
      </div>

      <!-- Botón + mensaje -->
      <div class="toolbar">
        <span class="empresa-tag"><span class="material-icons">business</span> {{ pasantia.nombreEmpresa }}</span>
        <button class="btn btn-primary" (click)="abrirModal()">
          <span class="material-icons">add</span> Registrar actividad
        </button>
      </div>

      <div *ngIf="mensaje" class="alert" [class.alert-error]="esError" [class.alert-success]="!esError">{{ mensaje }}</div>

      <!-- Lista de actividades -->
      <div *ngIf="cargandoActividades" class="loading-row">
        <span class="material-icons spin">sync</span> Cargando...
      </div>

      <div *ngIf="!cargandoActividades" class="card tabla-card">
        <table class="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Título</th>
              <th>Descripción</th>
              <th>Horas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let a of actividades">
              <td>{{ a.fecha | date:'dd/MM/yyyy' }}</td>
              <td><strong>{{ a.titulo }}</strong></td>
              <td class="td-desc">{{ a.descripcion || '—' }}</td>
              <td><span class="badge-horas">{{ a.horas }}h</span></td>
              <td class="acciones">
                <button class="btn-icon btn-edit" (click)="editarActividad(a)" title="Editar">
                  <span class="material-icons">edit</span>
                </button>
                <button class="btn-icon btn-delete" (click)="eliminarActividad(a)" title="Eliminar">
                  <span class="material-icons">delete</span>
                </button>
              </td>
            </tr>
            <tr *ngIf="actividades.length === 0">
              <td colspan="5" class="empty-row">No hay actividades registradas aún.</td>
            </tr>
          </tbody>
        </table>
      </div>

    </ng-container>

    <!-- Modal nueva/editar actividad -->
    <div class="modal-overlay" *ngIf="mostrarModal" (click)="cerrarModal()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ esNueva ? 'Nueva actividad' : 'Editar actividad' }}</h2>
          <button class="btn-icon" (click)="cerrarModal()"><span class="material-icons">close</span></button>
        </div>
        <div class="modal-body">
          <div *ngIf="modalMensaje" class="alert alert-error">{{ modalMensaje }}</div>
          <div class="form-group">
            <label>Título <span class="req">*</span></label>
            <input type="text" [(ngModel)]="form.titulo" maxlength="100" placeholder="Ej: Desarrollo de módulo de reportes">
          </div>
          <div class="form-group">
            <label>Descripción</label>
            <textarea [(ngModel)]="form.descripcion" rows="3" placeholder="Detalle de las actividades realizadas..."></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Fecha <span class="req">*</span></label>
              <input type="date" [(ngModel)]="form.fecha">
            </div>
            <div class="form-group">
              <label>Horas <span class="req">*</span></label>
              <input type="number" [(ngModel)]="form.horas" min="0.5" max="12" step="0.5">
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="cerrarModal()">Cancelar</button>
          <button class="btn btn-primary" (click)="guardarActividad()" [disabled]="guardando">
            {{ guardando ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 1.6rem; color: #1a3050; margin: 0; }
    .page-header p { color: #666; margin: 4px 0 0; }

    .empty-box { background:#fff; border-radius:12px; padding:48px; text-align:center; box-shadow:0 2px 8px rgba(0,0,0,.06); }
    .empty-box .material-icons { font-size:48px; color:#ccc; display:block; margin-bottom:12px; }
    .empty-box p { color:#888; }

    .card { background:#fff; border-radius:12px; padding:24px; box-shadow:0 2px 8px rgba(0,0,0,.06); margin-bottom:16px; }
    .resumen-card { display:flex; align-items:center; gap:24px; flex-wrap:wrap; }
    .resumen-item { text-align:center; }
    .r-num { display:block; font-size:2rem; font-weight:700; color:#1976d2; line-height:1; }
    .r-num.completo { color:#2e7d32; }
    .r-label { font-size:.75rem; color:#999; text-transform:uppercase; letter-spacing:.4px; }
    .resumen-sep { width:1px; height:40px; background:#eee; }
    .progress-wrap { flex:1; min-width:120px; }
    .progress-bar { height:8px; background:#e0e0e0; border-radius:4px; overflow:hidden; }
    .progress-fill { height:100%; background:#1976d2; border-radius:4px; transition:width .4s; }
    .progress-fill.completo { background:#2e7d32; }

    .toolbar { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
    .empresa-tag { display:flex; align-items:center; gap:6px; color:#555; font-weight:500; }
    .empresa-tag .material-icons { color:#1976d2; font-size:18px; }

    .alert { padding:10px 16px; border-radius:8px; margin-bottom:12px; font-size:.9rem; }
    .alert-error { background:#ffebee; color:#c62828; }
    .alert-success { background:#e8f5e9; color:#2e7d32; }

    .loading-row { text-align:center; padding:24px; color:#666; display:flex; align-items:center; justify-content:center; gap:8px; }
    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }

    .tabla-card { padding:0; overflow:hidden; }
    .data-table { width:100%; border-collapse:collapse; }
    .data-table th { background:#f5f7fa; color:#555; font-size:.75rem; text-transform:uppercase; letter-spacing:.5px; padding:10px 14px; text-align:left; }
    .data-table td { padding:10px 14px; border-top:1px solid #f0f0f0; vertical-align:middle; }
    .data-table tr:hover td { background:#fafbfc; }
    .td-desc { max-width:260px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:#666; font-size:.875rem; }
    .badge-horas { background:#e3f2fd; color:#1565c0; padding:3px 10px; border-radius:20px; font-weight:600; font-size:.8rem; }
    .acciones { display:flex; gap:6px; }
    .btn-icon { background:none; border:none; cursor:pointer; padding:6px; border-radius:8px; display:flex; align-items:center; }
    .btn-edit:hover { background:#e3f2fd; color:#1976d2; }
    .btn-delete:hover { background:#ffebee; color:#c62828; }
    .empty-row { text-align:center; color:#aaa; padding:32px; font-size:.9rem; }

    .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.45); display:flex; align-items:center; justify-content:center; z-index:1000; }
    .modal { background:#fff; border-radius:16px; width:100%; max-width:480px; box-shadow:0 8px 32px rgba(0,0,0,.2); }
    .modal-header { display:flex; justify-content:space-between; align-items:center; padding:20px 24px; border-bottom:1px solid #f0f0f0; }
    .modal-header h2 { margin:0; font-size:1.1rem; color:#1a3050; }
    .modal-body { padding:24px; display:flex; flex-direction:column; gap:16px; }
    .modal-footer { padding:16px 24px; border-top:1px solid #f0f0f0; display:flex; justify-content:flex-end; gap:10px; }
    .form-group { display:flex; flex-direction:column; gap:6px; }
    .form-group label { font-size:.85rem; font-weight:600; color:#333; }
    .req { color:#e53935; }
    .form-group input, .form-group textarea, .form-group select { padding:10px 12px; border:1px solid #ddd; border-radius:8px; font-size:.9rem; }
    .form-group textarea { resize:vertical; font-family:inherit; }
    .form-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
    .btn { padding:10px 20px; border-radius:8px; font-size:.9rem; font-weight:600; cursor:pointer; border:none; }
    .btn-primary { background:#1976d2; color:#fff; }
    .btn-primary:disabled { opacity:.6; cursor:not-allowed; }
    .btn-secondary { background:#f0f0f0; color:#333; }
  `]
})
export class EstudianteActividadesComponent implements OnInit {
  pasantia: PasantiaAdmin | null = null;
  actividades: Actividad[] = [];
  cargando = false;
  cargandoActividades = false;
  mensaje = '';
  esError = false;

  // Modal
  mostrarModal = false;
  esNueva = true;
  editandoId = 0;
  guardando = false;
  modalMensaje = '';
  form: { titulo: string; descripcion: string; fecha: string; horas: number } = {
    titulo: '', descripcion: '', fecha: new Date().toISOString().substring(0, 10), horas: 4
  };

  private idEstudiante = 0;
  private idUsuario = 0;

  constructor(
    private auth: AuthService,
    private pasantiaService: PasantiaService,
    private actividadService: ActividadService
  ) {}

  ngOnInit(): void {
    const usuario = this.auth.getUsuario();
    if (!usuario) return;
    this.idEstudiante = usuario.idPerfil ?? 0;
    this.idUsuario = usuario.idUsuario;
    this.cargando = true;
    // Usar siempre idUsuario para que funcione con tokens viejos y nuevos
    this.pasantiaService.listarPorUsuario(this.idUsuario).subscribe({
      next: res => {
        this.cargando = false;
        if (res.exito && res.data && res.data.length > 0) {
          this.pasantia = res.data.find(p => p.estadoPasantia === 'En Curso') ?? res.data[0];
          // Actualizar idEstudiante desde los datos de la pasantía si era 0
          if (this.idEstudiante <= 0 && this.pasantia) {
            this.idEstudiante = this.pasantia.idEstudiante;
          }
          this.cargarActividades();
        }
      },
      error: () => { this.cargando = false; }
    });
  }

  cargarActividades(): void {
    if (!this.pasantia) return;
    this.cargandoActividades = true;
    this.actividadService.listarPorPasantia(this.pasantia.idPasantia).subscribe({
      next: res => {
        this.cargandoActividades = false;
        if (res.exito) this.actividades = res.data ?? [];
      },
      error: () => { this.cargandoActividades = false; }
    });
  }

  get totalHoras(): number {
    return this.actividades.reduce((s, a) => s + Number(a.horas), 0);
  }

  get porcentaje(): number {
    if (!this.pasantia || this.pasantia.horasRequeridas <= 0) return 0;
    return Math.min(100, Math.round(this.totalHoras / this.pasantia.horasRequeridas * 100));
  }

  abrirModal(): void {
    this.esNueva = true;
    this.editandoId = 0;
    this.form = { titulo: '', descripcion: '', fecha: new Date().toISOString().substring(0, 10), horas: 4 };
    this.modalMensaje = '';
    this.mostrarModal = true;
  }

  editarActividad(a: Actividad): void {
    this.esNueva = false;
    this.editandoId = a.idActividad;
    this.form = {
      titulo: a.titulo,
      descripcion: a.descripcion ?? '',
      fecha: a.fecha.substring(0, 10),
      horas: Number(a.horas)
    };
    this.modalMensaje = '';
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.modalMensaje = '';
  }

  guardarActividad(): void {
    if (!this.form.titulo.trim()) { this.modalMensaje = 'El título es obligatorio.'; return; }
    if (!this.form.fecha) { this.modalMensaje = 'La fecha es obligatoria.'; return; }
    if (this.form.horas <= 0) { this.modalMensaje = 'Las horas deben ser mayores a 0.'; return; }
    if (!this.pasantia) return;

    const payload: NuevaActividad = {
      idPasantia: this.pasantia.idPasantia,
      idEstudiante: this.idEstudiante,
      titulo: this.form.titulo.trim(),
      descripcion: this.form.descripcion || null,
      fecha: this.form.fecha,
      horas: this.form.horas
    };

    this.guardando = true;
    const obs = this.esNueva
      ? this.actividadService.crear(payload)
      : this.actividadService.actualizar(this.editandoId, payload);

    obs.subscribe({
      next: res => {
        this.guardando = false;
        if (res.exito) {
          this.cerrarModal();
          this.cargarActividades();
          this.mostrarMensaje(this.esNueva ? 'Actividad registrada.' : 'Actividad actualizada.', false);
        } else {
          this.modalMensaje = res.mensaje;
        }
      },
      error: () => { this.guardando = false; this.modalMensaje = 'Error de conexión.'; }
    });
  }

  eliminarActividad(a: Actividad): void {
    if (!confirm(`¿Eliminar la actividad "${a.titulo}"?`)) return;
    this.actividadService.eliminar(a.idActividad).subscribe({
      next: res => {
        if (res.exito) { this.cargarActividades(); this.mostrarMensaje('Actividad eliminada.', false); }
      }
    });
  }

  private mostrarMensaje(msg: string, error: boolean): void {
    this.mensaje = msg; this.esError = error;
    setTimeout(() => this.mensaje = '', 3000);
  }
}

