import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostulacionService } from '../../../services/postulacion.service';
import { Postulacion } from '../../../models/postulacion.model';

@Component({
  selector: 'app-admin-postulaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-postulaciones.component.html',
  styleUrl: './admin-postulaciones.component.css'
})
export class AdminPostulacionesComponent implements OnInit {
  postulaciones: Postulacion[] = [];
  filtradas: Postulacion[] = [];
  cargando = true;
  error = '';
  filtroEstado = '';
  filtroBusqueda = '';

  estados = ['Pendiente', 'Aceptada', 'Rechazada'];

  constructor(private postulacionService: PostulacionService) {}

  ngOnInit(): void {
    this.postulacionService.listar().subscribe({
      next: res => {
        this.cargando = false;
        if (res.exito) {
          this.postulaciones = res.data;
          this.aplicarFiltros();
        } else {
          this.error = res.mensaje;
        }
      },
      error: () => { this.cargando = false; this.error = 'Error al cargar las postulaciones.'; }
    });
  }

  aplicarFiltros(): void {
    this.filtradas = this.postulaciones.filter(p => {
      const matchEstado = !this.filtroEstado || p.estado === this.filtroEstado;
      const texto = this.filtroBusqueda.toLowerCase();
      const matchBusqueda = !texto ||
        (p.nombreEstudiante || '').toLowerCase().includes(texto) ||
        (p.tituloOferta || '').toLowerCase().includes(texto) ||
        (p.nombreEmpresa || '').toLowerCase().includes(texto);
      return matchEstado && matchBusqueda;
    });
  }

  cambiarEstado(p: Postulacion, nuevoEstado: string): void {
    if (p.estado === nuevoEstado) return;
    this.postulacionService.cambiarEstado(p.idPostulacion, nuevoEstado).subscribe({
      next: res => {
        if (res.exito) {
          p.estado = nuevoEstado;
          this.aplicarFiltros();
        }
      }
    });
  }

  getBadgeClass(estado: string): string {
    switch (estado) {
      case 'Aceptada': return 'badge-ok';
      case 'Rechazada': return 'badge-error';
      default: return 'badge-pending';
    }
  }
}
