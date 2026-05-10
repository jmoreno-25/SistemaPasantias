import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { PasantiaService } from '../../../services/pasantia.service';
import { PasantiaAdmin } from '../../../models/pasantia-admin.model';

@Component({
  selector: 'app-tutor-tutorados',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <h1>Mis Tutorados</h1>
      <p>Estudiantes asignados bajo tu tutoría</p>
    </div>

    <div class="card" *ngIf="cargando">
      <p class="loading-msg"><span class="material-icons spin">sync</span> Cargando tutorados...</p>
    </div>

    <div class="empty-card" *ngIf="!cargando && tutorados.length === 0">
      <span class="material-icons">people_outline</span>
      <p>No tienes estudiantes asignados por el momento.</p>
    </div>

    <div class="table-card" *ngIf="!cargando && tutorados.length > 0">
      <table class="tabla">
        <thead>
          <tr>
            <th>Estudiante</th>
            <th>Empresa</th>
            <th>Cargo</th>
            <th>Fecha Inicio</th>
            <th>Horas</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let t of tutorados">
            <td>{{ t.nombreEstudiante ?? '—' }}</td>
            <td>{{ t.nombreEmpresa ?? '—' }}</td>
            <td>{{ t.cargoPasantia ?? '—' }}</td>
            <td>{{ t.fechaInicio ? (t.fechaInicio | date:'dd/MM/yyyy') : '—' }}</td>
            <td>
              <span class="horas">{{ t.horasCompletadas }} / {{ t.horasRequeridas }}</span>
            </td>
            <td><span class="badge" [class]="'badge-' + estadoClass(t.estadoPasantia)">{{ t.estadoPasantia ?? '—' }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 1.6rem; color: #1a3050; margin: 0; }
    .page-header p { color: #666; margin: 4px 0 0; }

    .card, .empty-card, .table-card {
      background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    .card { padding: 32px; }
    .empty-card { padding: 48px; text-align: center; }
    .empty-card .material-icons { font-size: 48px; color: #ccc; display: block; }
    .empty-card p { color: #888; margin-top: 12px; }

    .loading-msg { display: flex; align-items: center; gap: 8px; color: #555; justify-content: center; }
    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .table-card { overflow: hidden; }
    .tabla { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
    .tabla thead { background: #f0f4ff; }
    .tabla th { padding: 12px 14px; text-align: left; font-weight: 600; color: #1a3050; }
    .tabla td { padding: 11px 14px; border-top: 1px solid #f0f0f0; color: #333; }
    .tabla tbody tr:hover { background: #fafbff; }

    .horas { font-weight: 600; color: #1a3050; }

    .badge { padding: 3px 10px; border-radius: 20px; font-size: 0.78rem; font-weight: 600; }
    .badge-curso { background: #d1fae5; color: #065f46; }
    .badge-finalizada { background: #dbeafe; color: #1e40af; }
    .badge-pendiente { background: #fef3c7; color: #92400e; }
    .badge-otro { background: #f3f4f6; color: #374151; }
  `]
})
export class TutorTutoradosComponent implements OnInit {
  tutorados: PasantiaAdmin[] = [];
  cargando = false;

  constructor(
    private auth: AuthService,
    private pasantiaService: PasantiaService
  ) {}

  ngOnInit(): void {
    const usuario = this.auth.getUsuario();
    if (!usuario) return;
    this.cargando = true;
    this.pasantiaService.listarPorUsuarioTutor(usuario.idUsuario).subscribe({
      next: res => {
        this.tutorados = res.exito && res.data ? res.data : [];
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  estadoClass(estado: string | null): string {
    if (!estado) return 'otro';
    const e = estado.toLowerCase();
    if (e.includes('curso')) return 'curso';
    if (e.includes('finaliz')) return 'finalizada';
    if (e.includes('pendiente')) return 'pendiente';
    return 'otro';
  }
}
