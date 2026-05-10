import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PeriodoService } from '../../../services/periodo.service';
import { PeriodoAcademico } from '../../../models/periodo.model';

@Component({
  selector: 'app-admin-periodos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-periodos.component.html',
  styleUrls: ['./admin-periodos.component.css']
})
export class AdminPeriodosComponent implements OnInit {
  periodos: PeriodoAcademico[] = [];
  cargando = false;
  error = '';
  exito = '';

  mostrarModal = false;
  editando = false;
  guardando = false;

  form: Partial<PeriodoAcademico> = {};

  constructor(private periodoService: PeriodoService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.periodoService.listar().subscribe({
      next: r => { this.periodos = r.data || []; this.cargando = false; },
      error: () => { this.error = 'Error al cargar períodos.'; this.cargando = false; }
    });
  }

  abrirNuevo(): void {
    const anioActual = new Date().getFullYear();
    this.form = { anio: anioActual, numeroPeriodo: 1, estado: 'Activo' };
    this.actualizarNombre();
    this.editando = false;
    this.mostrarModal = true;
    this.error = '';
    this.exito = '';
  }

  abrirEditar(p: PeriodoAcademico): void {
    this.form = { ...p };
    this.editando = true;
    this.mostrarModal = true;
    this.error = '';
    this.exito = '';
  }

  actualizarNombre(): void {
    if (this.form.anio && this.form.numeroPeriodo) {
      const romano = this.form.numeroPeriodo === 1 ? 'I' : 'II';
      this.form.nombre = `${this.form.anio}-${romano}`;
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.form = {};
  }

  guardar(): void {
    this.guardando = true;
    this.error = '';
    const accion = this.editando
      ? this.periodoService.actualizar(this.form.idPeriodo!, this.form)
      : this.periodoService.crear(this.form);

    accion.subscribe({
      next: r => {
        this.guardando = false;
        if (r.exito) {
          this.exito = this.editando ? 'Período actualizado.' : 'Período creado.';
          this.cerrarModal();
          this.cargar();
        } else {
          this.error = r.mensaje || 'Error al guardar.';
        }
      },
      error: () => { this.error = 'Error de conexión.'; this.guardando = false; }
    });
  }

  cerrar(p: PeriodoAcademico): void {
    if (!confirm(`¿Cerrar el período "${p.nombre}"?`)) return;
    this.periodoService.eliminar(p.idPeriodo).subscribe({
      next: r => {
        if (r.exito) { this.exito = 'Período cerrado.'; this.cargar(); }
        else this.error = r.mensaje || 'Error al cerrar.';
      },
      error: () => { this.error = 'Error de conexión.'; }
    });
  }
}
