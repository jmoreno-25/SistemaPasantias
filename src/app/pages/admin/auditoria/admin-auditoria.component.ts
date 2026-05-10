import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReporteService } from '../../../services/reporte.service';

@Component({
  selector: 'app-admin-auditoria',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-auditoria.component.html',
  styleUrls: ['./admin-auditoria.component.css']
})
export class AdminAuditoriaComponent implements OnInit {
  logs: any[] = [];
  cargando = false;
  error = '';
  pagina = 1;
  tamano = 50;
  tablaFiltro = '';

  constructor(private reporteService: ReporteService) {}

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.cargando = true;
    this.reporteService.listarLogs(this.pagina, this.tamano, this.tablaFiltro || undefined).subscribe({
      next: r => { this.logs = r.data || []; this.cargando = false; },
      error: () => { this.error = 'Error al cargar auditoría.'; this.cargando = false; }
    });
  }

  siguiente(): void { this.pagina++; this.cargar(); }
  anterior(): void { if (this.pagina > 1) { this.pagina--; this.cargar(); } }
}
