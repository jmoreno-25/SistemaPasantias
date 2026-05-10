import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { PasantiaService } from '../../../services/pasantia.service';
import { PasantiaAdmin } from '../../../models/pasantia-admin.model';

@Component({
  selector: 'app-estudiante-pasantia',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-header">
      <h1>Mi Pasantía</h1>
      <p>Información y seguimiento de tu pasantía activa</p>
    </div>

    <div *ngIf="cargando" class="loading-box">
      <span class="material-icons spin">sync</span> Cargando...
    </div>

    <div *ngIf="!cargando && !pasantia" class="empty-box">
      <span class="material-icons">assignment_late</span>
      <p>No tienes ninguna pasantía asignada aún.</p>
      <div class="empty-actions">
        <a routerLink="/estudiante/ofertas" class="btn btn-secondary">Ver ofertas disponibles</a>
        <a routerLink="/estudiante/registrar-pasantia" class="btn btn-primary">
          <span class="material-icons">add_task</span> Registrar mi pasantía
        </a>
      </div>
    </div>

    <ng-container *ngIf="!cargando && pasantia">

      <!-- Cabecera de la pasantia -->
      <div class="card info-card">
        <div class="info-top">
          <div class="info-empresa">
            <span class="material-icons">business</span>
            <div>
              <h2>{{ pasantia.nombreEmpresa || '—' }}</h2>
              <p class="cargo">{{ pasantia.cargoPasantia || '—' }}</p>
            </div>
          </div>
          <span class="badge" [ngClass]="estadoClass">{{ pasantia.estadoPasantia }}</span>
        </div>
        <div class="info-grid">
          <div><span class="label">Tutor empresarial</span><span>{{ pasantia.nombreTutor || '—' }}</span></div>
          <div><span class="label">Fecha de inicio</span><span>{{ pasantia.fechaInicio | date:'dd/MM/yyyy' }}</span></div>
          <div><span class="label">Fecha de fin</span><span>{{ pasantia.fechaFin ? (pasantia.fechaFin | date:'dd/MM/yyyy') : '—' }}</span></div>
        </div>
      </div>

      <!-- Progreso de horas -->
      <div class="card progress-card">
        <h3><span class="material-icons">timer</span> Progreso de horas</h3>
        <div class="progress-numbers">
          <span class="horas-completadas">{{ pasantia.horasCompletadas }}</span>
          <span class="horas-sep"> / </span>
          <span class="horas-requeridas">{{ pasantia.horasRequeridas }} horas</span>
        </div>
        <div class="progress-bar-wrap">
          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="porcentaje" [class.completo]="porcentaje >= 100"></div>
          </div>
          <span class="pct-label">{{ porcentaje }}%</span>
        </div>
        <p class="hint-link">
          <a routerLink="/estudiante/actividades">Registrar actividades diarias →</a>
        </p>
      </div>

    </ng-container>
  `,
  styles: [`
    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 1.6rem; color: #1a3050; margin: 0; }
    .page-header p { color: #666; margin: 4px 0 0; }

    .loading-box, .empty-box {
      background:#fff; border-radius:12px; padding:48px; text-align:center;
      box-shadow:0 2px 8px rgba(0,0,0,.06);
    }
    .loading-box .material-icons, .empty-box .material-icons { font-size:48px; color:#ccc; display:block; margin-bottom:12px; }
    .empty-box p { color:#888; margin-bottom:16px; }
    .empty-actions { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
    .btn { padding:10px 20px; border-radius:8px; font-size:.9rem; font-weight:600; cursor:pointer; border:none; display:inline-flex; align-items:center; gap:6px; text-decoration:none; }
    .btn-primary { background:#1976d2; color:#fff; }
    .btn-secondary { background:#f0f0f0; color:#333; }
    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }

    .card { background:#fff; border-radius:12px; padding:24px; box-shadow:0 2px 8px rgba(0,0,0,.06); margin-bottom:20px; }

    .info-top { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:20px; }
    .info-empresa { display:flex; gap:12px; align-items:center; }
    .info-empresa .material-icons { font-size:40px; color:#1976d2; }
    .info-empresa h2 { margin:0; font-size:1.3rem; color:#1a3050; }
    .info-empresa .cargo { color:#666; margin:2px 0 0; }

    .badge { padding:4px 12px; border-radius:20px; font-size:.75rem; font-weight:600; }
    .badge-info { background:#e3f2fd; color:#1565c0; }
    .badge-success { background:#e8f5e9; color:#2e7d32; }
    .badge-danger { background:#ffebee; color:#c62828; }

    .info-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
    .info-grid > div { display:flex; flex-direction:column; gap:4px; }
    .label { font-size:.75rem; color:#999; text-transform:uppercase; letter-spacing:.5px; }

    .progress-card h3 { margin:0 0 16px; display:flex; align-items:center; gap:8px; color:#1a3050; }
    .progress-numbers { display:flex; align-items:baseline; gap:4px; margin-bottom:12px; }
    .horas-completadas { font-size:2rem; font-weight:700; color:#1976d2; }
    .horas-sep { color:#999; }
    .horas-requeridas { color:#666; }
    .progress-bar-wrap { display:flex; align-items:center; gap:12px; }
    .progress-bar { flex:1; height:12px; background:#e0e0e0; border-radius:6px; overflow:hidden; }
    .progress-fill { height:100%; background:#1976d2; border-radius:6px; transition:width .4s; }
    .progress-fill.completo { background:#2e7d32; }
    .pct-label { font-weight:600; color:#555; min-width:40px; text-align:right; }
    .hint-link { margin-top:12px; text-align:right; }
    .hint-link a { color:#1976d2; text-decoration:none; font-size:.9rem; }
    .btn { padding:10px 20px; border-radius:8px; font-size:.9rem; font-weight:600; cursor:pointer; border:none; text-decoration:none; display:inline-block; }
    .btn-primary { background:#1976d2; color:#fff; }
  `]
})
export class EstudiantePasantiaComponent implements OnInit {
  pasantia: PasantiaAdmin | null = null;
  cargando = false;

  constructor(private auth: AuthService, private pasantiaService: PasantiaService) {}

  ngOnInit(): void {
    const usuario = this.auth.getUsuario();
    if (!usuario) return;
    this.cargando = true;
    // Usar siempre idUsuario (disponible en tokens nuevos y viejos)
    this.pasantiaService.listarPorUsuario(usuario.idUsuario).subscribe({
      next: res => {
        this.cargando = false;
        if (res.exito && res.data && res.data.length > 0) {
          // Tomar la pasantia más reciente en estado activo, o la primera
          this.pasantia = res.data.find(p => p.estadoPasantia === 'En Curso') ?? res.data[0];
        }
      },
      error: () => { this.cargando = false; }
    });
  }

  get porcentaje(): number {
    if (!this.pasantia || this.pasantia.horasRequeridas <= 0) return 0;
    return Math.min(100, Math.round(this.pasantia.horasCompletadas / this.pasantia.horasRequeridas * 100));
  }

  get estadoClass(): string {
    switch (this.pasantia?.estadoPasantia) {
      case 'En Curso': return 'badge-info';
      case 'Finalizada': return 'badge-success';
      case 'Cancelada': return 'badge-danger';
      default: return '';
    }
  }
}

