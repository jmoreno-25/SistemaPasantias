import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmpresaService } from '../../../services/empresa.service';
import { Empresa } from '../../../models/usuario.model';

@Component({
  selector: 'app-docente-empresas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <h1>Empresas</h1>
      <p>Empresas con convenio registradas en el sistema</p>
    </div>
    <div class="toolbar">
      <input type="text" [(ngModel)]="busqueda" placeholder="Buscar por nombre, RUC o correo..." class="input-search">
    </div>
    <div class="table-container" *ngIf="!cargando">
      <table class="data-table">
        <thead>
          <tr>
            <th>RUC</th>
            <th>Razón Social</th>
            <th>Sector</th>
            <th>Teléfono</th>
            <th>Correo</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let e of empresasFiltradas">
            <td>{{ e.ruc }}</td>
            <td>{{ e.razonSocial }}</td>
            <td>{{ e.sectorEconomico || '—' }}</td>
            <td>{{ e.telefono || '—' }}</td>
            <td>{{ e.correo || '—' }}</td>
          </tr>
          <tr *ngIf="empresasFiltradas.length === 0">
            <td colspan="5" class="empty-row">No se encontraron empresas.</td>
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
    .toolbar { margin-bottom: 16px; }
    .input-search { padding: 8px 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 0.9rem; min-width: 300px; }
    .table-container { background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); overflow: hidden; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th { background: #f8f9fa; padding: 12px 16px; text-align: left; font-size: 0.8rem; text-transform: uppercase; color: #666; border-bottom: 1px solid #eee; }
    .data-table td { padding: 12px 16px; border-bottom: 1px solid #f0f0f0; font-size: 0.9rem; }
    .data-table tr:last-child td { border-bottom: none; }
    .data-table tr:hover td { background: #fafafa; }
    .empty-row { text-align: center; color: #aaa; padding: 32px; }
    .loading { display: flex; align-items: center; gap: 8px; padding: 32px; justify-content: center; color: #666; }
    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  `]
})
export class DocenteEmpresasComponent implements OnInit {
  empresas: Empresa[] = [];
  busqueda = '';
  cargando = false;

  constructor(private empresaService: EmpresaService) {}

  ngOnInit(): void {
    this.cargando = true;
    this.empresaService.listar().subscribe({
      next: res => { this.cargando = false; if (res.exito) this.empresas = res.data; },
      error: () => { this.cargando = false; }
    });
  }

  get empresasFiltradas(): Empresa[] {
    if (!this.busqueda.trim()) return this.empresas;
    const b = this.busqueda.toLowerCase();
    return this.empresas.filter(e =>
      (e.razonSocial || '').toLowerCase().includes(b) ||
      (e.ruc || '').includes(b) ||
      (e.correo || '').toLowerCase().includes(b)
    );
  }
}
