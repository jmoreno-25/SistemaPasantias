import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { EmpresaService } from '../../../services/empresa.service';
import { PasantiaService } from '../../../services/pasantia.service';
import { Empresa } from '../../../models/usuario.model';

@Component({
  selector: 'app-registrar-pasantia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <h1>Registrar Pasantía</h1>
      <p>Completa los 3 pasos para registrar tu pasantía</p>
    </div>

    <!-- Indicador de pasos -->
    <div class="stepper">
      <div class="step" [class.active]="paso === 1" [class.done]="paso > 1">
        <div class="step-circle">
          <span class="material-icons" *ngIf="paso > 1">check</span>
          <span *ngIf="paso <= 1">1</span>
        </div>
        <span class="step-label">Empresa</span>
      </div>
      <div class="step-line" [class.done]="paso > 1"></div>
      <div class="step" [class.active]="paso === 2" [class.done]="paso > 2">
        <div class="step-circle">
          <span class="material-icons" *ngIf="paso > 2">check</span>
          <span *ngIf="paso <= 2">2</span>
        </div>
        <span class="step-label">Tutor</span>
      </div>
      <div class="step-line" [class.done]="paso > 2"></div>
      <div class="step" [class.active]="paso === 3">
        <div class="step-circle">3</div>
        <span class="step-label">Pasantía</span>
      </div>
    </div>

    <div *ngIf="error" class="alert alert-error">{{ error }}</div>

    <!-- ══ PASO 1: Empresa ══════════════════════════════════════════ -->
    <div class="card wizard-card" *ngIf="paso === 1">
      <h2 class="card-title"><span class="material-icons">business</span> Empresa donde realizarás la pasantía</h2>

      <div class="toggle-group">
        <button class="toggle-btn" [class.selected]="modoEmpresa === 'existente'" (click)="modoEmpresa='existente'">
          <span class="material-icons">search</span> Buscar empresa existente
        </button>
        <button class="toggle-btn" [class.selected]="modoEmpresa === 'nueva'" (click)="modoEmpresa='nueva'">
          <span class="material-icons">add_business</span> Registrar nueva empresa
        </button>
      </div>

      <!-- Empresa existente -->
      <div *ngIf="modoEmpresa === 'existente'" class="mt-16">
        <div class="form-group">
          <label>Buscar empresa</label>
          <input type="text" [(ngModel)]="busquedaEmpresa" placeholder="Escribe para filtrar..." class="input-search">
        </div>
        <div class="empresa-list">
          <div *ngFor="let e of empresasFiltradas()"
               class="empresa-item" [class.seleccionado]="empresaSelId === e.idEmpresa"
               (click)="seleccionarEmpresa(e)">
            <span class="material-icons">business</span>
            <div>
              <strong>{{ e.razonSocial }}</strong>
              <span *ngIf="e.sectorEconomico">· {{ e.sectorEconomico }}</span>
              <small *ngIf="e.ruc">RUC: {{ e.ruc }}</small>
            </div>
            <span class="material-icons check-ok" *ngIf="empresaSelId === e.idEmpresa">check_circle</span>
          </div>
          <div *ngIf="empresasFiltradas().length === 0" class="empty-list">No se encontraron empresas.</div>
        </div>
      </div>

      <!-- Empresa nueva -->
      <div *ngIf="modoEmpresa === 'nueva'" class="form-grid mt-16">
        <div class="form-group span2">
          <label>Razón Social <span class="req">*</span></label>
          <input type="text" [(ngModel)]="nEmp.razonSocial" maxlength="200" placeholder="Nombre legal de la empresa">
        </div>
        <div class="form-group">
          <label>RUC</label>
          <input type="text" [(ngModel)]="nEmp.ruc" maxlength="20">
        </div>
        <div class="form-group">
          <label>Sector económico</label>
          <input type="text" [(ngModel)]="nEmp.sectorEconomico" maxlength="100">
        </div>
        <div class="form-group span2">
          <label>Dirección</label>
          <input type="text" [(ngModel)]="nEmp.direccion" maxlength="200">
        </div>
        <div class="form-group">
          <label>Teléfono</label>
          <input type="text" [(ngModel)]="nEmp.telefono" maxlength="20">
        </div>
        <div class="form-group">
          <label>Correo</label>
          <input type="email" [(ngModel)]="nEmp.correo" maxlength="100">
        </div>
      </div>

      <div class="card-footer">
        <button class="btn btn-secondary" (click)="irDashboard()">Cancelar</button>
        <button class="btn btn-primary" (click)="siguiente1()">
          Siguiente <span class="material-icons">arrow_forward</span>
        </button>
      </div>
    </div>

    <!-- ══ PASO 2: Tutor ════════════════════════════════════════════ -->
    <div class="card wizard-card" *ngIf="paso === 2">
      <h2 class="card-title"><span class="material-icons">manage_accounts</span> Tutor empresarial</h2>
      <p class="card-hint">Si el tutor ya tiene cuenta, se reutilizará. Si no, se creará automáticamente con contraseña provisional <strong>Tutor2026$</strong>.</p>

      <div class="form-grid">
        <div class="form-group">
          <label>Cédula <span class="req">*</span></label>
          <input type="text" [(ngModel)]="tutor.cedula" maxlength="20" placeholder="Cédula del tutor">
        </div>
        <div class="form-group">
          <label>Cargo en la empresa</label>
          <input type="text" [(ngModel)]="tutor.cargo" maxlength="100" placeholder="Ej: Jefe de TI">
        </div>
        <div class="form-group">
          <label>Nombres <span class="req">*</span></label>
          <input type="text" [(ngModel)]="tutor.nombres" maxlength="100">
        </div>
        <div class="form-group">
          <label>Apellidos <span class="req">*</span></label>
          <input type="text" [(ngModel)]="tutor.apellidos" maxlength="100">
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" [(ngModel)]="tutor.email" maxlength="100">
        </div>
        <div class="form-group">
          <label>Teléfono</label>
          <input type="text" [(ngModel)]="tutor.telefono" maxlength="20">
        </div>
      </div>

      <div class="card-footer">
        <button class="btn btn-secondary" (click)="paso=1">
          <span class="material-icons">arrow_back</span> Anterior
        </button>
        <button class="btn btn-primary" (click)="siguiente2()">
          Siguiente <span class="material-icons">arrow_forward</span>
        </button>
      </div>
    </div>

    <!-- ══ PASO 3: Datos pasantía ═══════════════════════════════════ -->
    <div class="card wizard-card" *ngIf="paso === 3">
      <h2 class="card-title"><span class="material-icons">assignment</span> Datos de la pasantía</h2>

      <div class="form-grid">
        <div class="form-group span2">
          <label>Cargo / Puesto <span class="req">*</span></label>
          <input type="text" [(ngModel)]="pasantia.cargo" maxlength="100" placeholder="Ej: Desarrollador de software">
        </div>
        <div class="form-group">
          <label>Fecha de inicio <span class="req">*</span></label>
          <input type="date" [(ngModel)]="pasantia.fechaInicio">
        </div>
        <div class="form-group">
          <label>Fecha de fin (estimada)</label>
          <input type="date" [(ngModel)]="pasantia.fechaFin">
        </div>
        <div class="form-group">
          <label>Horas requeridas <span class="req">*</span></label>
          <input type="number" [(ngModel)]="pasantia.horasRequeridas" min="1" max="2000">
        </div>
      </div>

      <!-- Resumen -->
      <div class="resumen-box">
        <h3>Resumen</h3>
        <div class="resumen-row">
          <span class="material-icons">business</span>
          <span>{{ resumenEmpresa }}</span>
        </div>
        <div class="resumen-row">
          <span class="material-icons">manage_accounts</span>
          <span>{{ tutor.nombres }} {{ tutor.apellidos }} ({{ tutor.cedula }})</span>
        </div>
      </div>

      <div class="card-footer">
        <button class="btn btn-secondary" (click)="paso=2">
          <span class="material-icons">arrow_back</span> Anterior
        </button>
        <button class="btn btn-primary" (click)="registrar()" [disabled]="guardando">
          <span class="material-icons">save</span>
          {{ guardando ? 'Registrando...' : 'Registrar pasantía' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 1.6rem; color: #1a3050; margin: 0; }
    .page-header p { color: #666; margin: 4px 0 0; }

    /* Stepper */
    .stepper { display: flex; align-items: center; margin-bottom: 28px; }
    .step { display: flex; flex-direction: column; align-items: center; gap: 6px; }
    .step-circle { width: 36px; height: 36px; border-radius: 50%; border: 2px solid #ccc; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: .9rem; background: #fff; color: #999; transition: all .3s; }
    .step-circle .material-icons { font-size: 18px; }
    .step.active .step-circle { border-color: #1976d2; background: #1976d2; color: #fff; }
    .step.done .step-circle { border-color: #2e7d32; background: #2e7d32; color: #fff; }
    .step-label { font-size: .78rem; color: #999; font-weight: 600; text-transform: uppercase; letter-spacing: .4px; }
    .step.active .step-label { color: #1976d2; }
    .step.done .step-label { color: #2e7d32; }
    .step-line { flex: 1; height: 2px; background: #e0e0e0; margin: 0 8px; margin-bottom: 18px; }
    .step-line.done { background: #2e7d32; }

    .alert { padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; font-size: .9rem; }
    .alert-error { background: #ffebee; color: #c62828; }

    .card { background: #fff; border-radius: 14px; box-shadow: 0 2px 12px rgba(0,0,0,.07); padding: 28px; }
    .card-title { display: flex; align-items: center; gap: 10px; font-size: 1.1rem; color: #1a3050; margin: 0 0 20px; }
    .card-hint { color: #666; font-size: .88rem; margin: -12px 0 20px; }
    .card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 24px; padding-top: 20px; border-top: 1px solid #f0f0f0; }

    .toggle-group { display: flex; gap: 12px; flex-wrap: wrap; }
    .toggle-btn { display: flex; align-items: center; gap: 8px; padding: 12px 20px; border: 2px solid #e0e0e0; border-radius: 10px; background: #fafafa; cursor: pointer; font-size: .9rem; color: #555; transition: all .2s; }
    .toggle-btn.selected { border-color: #1976d2; background: #e3f2fd; color: #1976d2; font-weight: 600; }
    .toggle-btn .material-icons { font-size: 20px; }

    .mt-16 { margin-top: 16px; }
    .empresa-list { display: flex; flex-direction: column; gap: 8px; max-height: 280px; overflow-y: auto; }
    .empresa-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border: 1px solid #eee; border-radius: 10px; cursor: pointer; transition: all .2s; }
    .empresa-item:hover { background: #f5f8ff; border-color: #bbdefb; }
    .empresa-item.seleccionado { background: #e3f2fd; border-color: #1976d2; }
    .empresa-item .material-icons:first-child { color: #1976d2; }
    .empresa-item div { flex: 1; display: flex; flex-direction: column; }
    .empresa-item small { color: #888; font-size: .8rem; }
    .check-ok { color: #2e7d32; }
    .empty-list { text-align: center; color: #aaa; padding: 24px; }

    .input-search { width: 100%; max-width: 400px; padding: 10px 14px; border: 1px solid #ddd; border-radius: 8px; font-size: .9rem; }

    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .span2 { grid-column: span 2; }
    .form-group label { font-size: .85rem; font-weight: 600; color: #333; }
    .req { color: #e53935; }
    .form-group input { padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px; font-size: .9rem; }

    .resumen-box { background: #f8fbff; border: 1px solid #e3f2fd; border-radius: 10px; padding: 16px; margin-top: 16px; }
    .resumen-box h3 { font-size: .85rem; color: #1a3050; margin: 0 0 10px; text-transform: uppercase; letter-spacing: .4px; }
    .resumen-row { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; font-size: .9rem; color: #444; }
    .resumen-row .material-icons { font-size: 18px; color: #1976d2; }

    .btn { padding: 10px 20px; border-radius: 8px; font-size: .9rem; font-weight: 600; cursor: pointer; border: none; display: inline-flex; align-items: center; gap: 6px; }
    .btn-primary { background: #1976d2; color: #fff; }
    .btn-primary:disabled { opacity: .6; cursor: not-allowed; }
    .btn-secondary { background: #f0f0f0; color: #333; }
  `]
})
export class RegistrarPasantiaComponent implements OnInit {
  paso = 1;
  modoEmpresa: 'existente' | 'nueva' = 'existente';
  busquedaEmpresa = '';
  empresas: Empresa[] = [];
  empresaSelId = 0;
  error = '';
  guardando = false;

  nEmp = { razonSocial: '', ruc: '', direccion: '', telefono: '', correo: '', sectorEconomico: '' };
  tutor = { cedula: '', nombres: '', apellidos: '', email: '', telefono: '', cargo: '' };
  pasantia = { cargo: '', fechaInicio: new Date().toISOString().substring(0, 10), fechaFin: '', horasRequeridas: 320 };

  private idEstudiante = 0;
  private idUsuario = 0;

  constructor(
    private auth: AuthService,
    private empresaService: EmpresaService,
    private pasantiaService: PasantiaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const u = this.auth.getUsuario();
    if (u) {
      this.idEstudiante = u.idPerfil ?? 0;
      this.idUsuario = u.idUsuario;
    }
    this.empresaService.listar().subscribe({
      next: res => { if (res.exito) this.empresas = res.data ?? []; }
    });
  }

  empresasFiltradas(): Empresa[] {
    if (!this.busquedaEmpresa.trim()) return this.empresas;
    const q = this.busquedaEmpresa.toLowerCase();
    return this.empresas.filter(e =>
      (e.razonSocial ?? '').toLowerCase().includes(q) ||
      (e.ruc ?? '').toLowerCase().includes(q)
    );
  }

  seleccionarEmpresa(e: Empresa): void {
    this.empresaSelId = e.idEmpresa;
  }

  get resumenEmpresa(): string {
    if (this.modoEmpresa === 'nueva') return this.nEmp.razonSocial || '(sin nombre)';
    const e = this.empresas.find(x => x.idEmpresa === this.empresaSelId);
    return e?.razonSocial ?? '—';
  }

  siguiente1(): void {
    this.error = '';
    if (this.modoEmpresa === 'existente' && this.empresaSelId <= 0) {
      this.error = 'Selecciona una empresa de la lista.'; return;
    }
    if (this.modoEmpresa === 'nueva' && !this.nEmp.razonSocial.trim()) {
      this.error = 'La razón social de la empresa es obligatoria.'; return;
    }
    this.paso = 2;
  }

  siguiente2(): void {
    this.error = '';
    if (!this.tutor.cedula.trim()) { this.error = 'La cédula del tutor es obligatoria.'; return; }
    if (!this.tutor.nombres.trim() || !this.tutor.apellidos.trim()) {
      this.error = 'El nombre completo del tutor es obligatorio.'; return;
    }
    this.paso = 3;
  }

  registrar(): void {
    this.error = '';
    if (!this.pasantia.cargo.trim()) { this.error = 'El cargo de la pasantía es obligatorio.'; return; }
    if (!this.pasantia.fechaInicio) { this.error = 'La fecha de inicio es obligatoria.'; return; }
    if (this.pasantia.horasRequeridas < 1) { this.error = 'Las horas requeridas deben ser al menos 1.'; return; }

    const req: any = {
      idEstudiante: this.idEstudiante,
      idUsuario: this.idUsuario,
      // Empresa
      idEmpresa: this.modoEmpresa === 'existente' ? this.empresaSelId : 0,
      empresaRazonSocial:  this.nEmp.razonSocial,
      empresaRuc:          this.nEmp.ruc || null,
      empresaDireccion:    this.nEmp.direccion || null,
      empresaTelefono:     this.nEmp.telefono || null,
      empresaCorreo:       this.nEmp.correo || null,
      empresaSector:       this.nEmp.sectorEconomico || null,
      // Tutor
      tutorCedula:    this.tutor.cedula.trim(),
      tutorNombres:   this.tutor.nombres.trim(),
      tutorApellidos: this.tutor.apellidos.trim(),
      tutorEmail:     this.tutor.email || null,
      tutorTelefono:  this.tutor.telefono || null,
      tutorCargo:     this.tutor.cargo || null,
      // Pasantía
      cargo:           this.pasantia.cargo.trim(),
      fechaInicio:     this.pasantia.fechaInicio,
      fechaFin:        this.pasantia.fechaFin || null,
      horasRequeridas: this.pasantia.horasRequeridas
    };

    this.guardando = true;
    this.pasantiaService.registrarEstudiante(req).subscribe({
      next: res => {
        this.guardando = false;
        if (res.exito) {
          this.router.navigate(['/estudiante/pasantia']);
        } else {
          this.error = res.mensaje;
        }
      },
      error: () => { this.guardando = false; this.error = 'Error de conexión. Intente nuevamente.'; }
    });
  }

  irDashboard(): void {
    this.router.navigate(['/estudiante/pasantia']);
  }
}
