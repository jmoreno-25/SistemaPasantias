import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OfertaService } from '../../../services/oferta.service';
import { OfertaPasantia } from '../../../models/oferta.model';

@Component({
  selector: 'app-docente-ofertas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './docente-ofertas.component.html',
  styleUrl: './docente-ofertas.component.css'
})
export class DocenteOfertasComponent implements OnInit {
  ofertas: OfertaPasantia[] = [];
  busqueda = '';
  filtroEstado = '';
  cargando = false;

  constructor(private ofertaService: OfertaService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.ofertaService.listar().subscribe({
      next: res => { this.cargando = false; if (res.exito) this.ofertas = res.data; },
      error: () => { this.cargando = false; }
    });
  }

  get ofertasFiltradas(): OfertaPasantia[] {
    let lista = this.ofertas;
    if (this.filtroEstado) lista = lista.filter(o => o.estado === this.filtroEstado);
    if (this.busqueda.trim()) {
      const b = this.busqueda.toLowerCase();
      lista = lista.filter(o =>
        (o.titulo || '').toLowerCase().includes(b) ||
        (o.nombreEmpresa || '').toLowerCase().includes(b)
      );
    }
    return lista;
  }

  estadoClass(estado: string): string {
    const map: Record<string, string> = { Abierta: 'badge-success', Cerrada: 'badge-danger', Cancelada: 'badge-warning' };
    return map[estado] || 'badge-default';
  }
}
