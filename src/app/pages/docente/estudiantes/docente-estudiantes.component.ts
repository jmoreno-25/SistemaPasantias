import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { EstudianteService } from '../../../services/estudiante.service';
import { PasantiaService } from '../../../services/pasantia.service';
import { Estudiante } from '../../../models/estudiante.model';

@Component({
  selector: 'app-docente-estudiantes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <h1>Estudiantes</h1>
      <p>Estudiantes registrados en el programa</p>
    </div>
    <div class="toolbar">
      <input type="text" [(ngModel)]="busqueda" placeholder="Buscar por nombre, cédula o email..." class="input-search">
      <select [(ngModel)]="filtroPasantia" class="select-filtro">
        <option value="">Todos</option>
        <option value="en-pasantia">En pasantía</option>
        <option value="sin-pasantia">Sin pasantía</option>
      </select>
    </div>
    <div class="table-container" *ngIf="!cargando">
      <table class="data-table">
        <thead>
          <tr>
            <th>Cédula</th>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>Email</th>
            <th>Carrera</th>
            <th>Semestre</th>
            <th>Pasantía</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let e of estudiantesFiltrados">
            <td>{{ e.cedula }}</td>
            <td>{{ e.nombres }}</td>
            <td>{{ e.apellidos }}</td>
            <td>{{ e.correo || '—' }}</td>
            <td>{{ e.nombreCarrera || '—' }}</td>
            <td>{{ e.semestre || '—' }}</td>
            <td>
              <span class="badge" [class.badge-success]="enPasantia(e.idEstudiante)" [class.badge-neutral]="!enPasantia(e.idEstudiante)">
                <span class="material-icons icon-sm">{{ enPasantia(e.idEstudiante) ? 'work' : 'work_off' }}</span>
                {{ enPasantia(e.idEstudiante) ? 'En pasantía' : 'Sin pasantía' }}
              </span>
            </td>
          </tr>
          <tr *ngIf="estudiantesFiltrados.length === 0">
            <td colspan="7" class="empty-row">No se encontraron estudiantes.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div *ngIf="cargando" class="loading"><span class="material-icons spin">sync</span> Cargando...</div>
  `,
  styles: [`
    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 1.6rem; color: #1a3050; margin: 0; }
    .page-header p { color: #666; margin: 4px 0 0; }
    .toolbar { display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
    .input-search { padding: 8px 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 0.9rem; min-width: 280px; }
    .select-filtro { padding: 8px 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 0.9rem; background: #fff; }
    .table-container { background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); overflow: hidden; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th { background: #f8f9fa; padding: 12px 16px; text-align: left; font-size: 0.8rem; text-transform: uppercase; color: #666; border-bottom: 1px solid #eee; }
    .data-table td { padding: 12px 16px; border-bottom: 1px solid #f0f0f0; font-size: 0.9rem; }
    .data-table tr:last-child td { border-bottom: none; }
    .data-table tr:hover td { background: #fafafa; }
    .empty-row { text-align: center; color: #aaa; padding: 32px; }
    .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 12px; font-size: 0.78rem; font-weight: 600; }
    .badge-success { background: #e8f5e9; color: #2e7d32; }
    .badge-neutral  { background: #f0f0f0; color: #666; }
    .icon-sm { font-size: 14px; }
    .loading { display: flex; align-items: center; gap: 8px; padding: 32px; justify-content: center; color: #666; }
    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  `]
})
export class DocenteEstudiantesComponent implements OnInit {
  estudiantes: Estudiante[] = [];
  busqueda = '';
  filtroPasantia = '';
  cargando = false;
  private idEstudiantesEnPasantia = new Set<number>();

  constructor(
    private estudianteService: EstudianteService,
    private pasantiaService: PasantiaService
  ) {}

  ngOnInit(): void {
    this.cargando = true;
    forkJoin({
      estudiantes: this.estudianteService.listar(),
      pasantias: this.pasantiaService.listar()
    }).subscribe({
      next: ({ estudiantes, pasantias }) => {
        this.cargando = false;
        if (estudiantes.exito) this.estudiantes = estudiantes.data;
        if (pasantias.exito) {
          this.idEstudiantesEnPasantia = new Set(
            pasantias.data
              .filter(p => p.estadoPasantia === 'En curso')
              .map(p => p.idEstudiante)
          );
        }
      },
      error: () => { this.cargando = false; }
    });
  }

  enPasantia(idEstudiante: number): boolean {
    return this.idEstudiantesEnPasantia.has(idEstudiante);
  }

  get estudiantesFiltrados(): Estudiante[] {
    let lista = this.estudiantes;
    if (this.filtroPasantia === 'en-pasantia')  lista = lista.filter(e => this.enPasantia(e.idEstudiante));
    if (this.filtroPasantia === 'sin-pasantia') lista = lista.filter(e => !this.enPasantia(e.idEstudiante));
    if (!this.busqueda.trim()) return lista;
    const b = this.busqueda.toLowerCase();
    return lista.filter(e =>
      (e.nombres   || '').toLowerCase().includes(b) ||
      (e.apellidos || '').toLowerCase().includes(b) ||
      (e.cedula    || '').includes(b) ||
      (e.correo    || '').toLowerCase().includes(b)
    );
  }
}
