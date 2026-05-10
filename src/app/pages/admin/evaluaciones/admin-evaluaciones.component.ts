import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EvaluacionService } from '../../../services/evaluacion.service';
import { EvaluacionAdmin } from '../../../models/evaluacion.model';

@Component({
  selector: 'app-admin-evaluaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-evaluaciones.component.html',
  styleUrl: './admin-evaluaciones.component.css'
})
export class AdminEvaluacionesComponent implements OnInit {
  evaluaciones: EvaluacionAdmin[] = [];
  busqueda = '';
  cargando = false;
  mensaje = '';
  esError = false;

  mostrarModal = false;
  evaluacionEditando: Partial<EvaluacionAdmin> = {};
  esNuevo = false;
  guardando = false;

  constructor(private evaluacionService: EvaluacionService) {}

  ngOnInit(): void {
    this.cargarEvaluaciones();
  }

  cargarEvaluaciones(): void {
    this.cargando = true;
    this.evaluacionService.listar().subscribe({
      next: res => { this.cargando = false; if (res.exito) this.evaluaciones = res.data; },
      error: () => { this.cargando = false; }
    });
  }

  get evaluacionesFiltradas(): EvaluacionAdmin[] {
    if (!this.busqueda.trim()) return this.evaluaciones;
    const b = this.busqueda.toLowerCase();
    return this.evaluaciones.filter(e =>
      e.idEvaluacion.toString().includes(b) ||
      e.idPasantia.toString().includes(b) ||
      (e.observacionGeneral && e.observacionGeneral.toLowerCase().includes(b))
    );
  }

  nuevaEvaluacion(): void {
    this.evaluacionEditando = { idPasantia: 0, idRubrica: 0, idTutorEmpresarial: 0, puntajeTotal: null, observacionGeneral: '' };
    this.esNuevo = true;
    this.mostrarModal = true;
    this.mensaje = '';
  }

  editarEvaluacion(e: EvaluacionAdmin): void {
    this.evaluacionEditando = { ...e };
    this.esNuevo = false;
    this.mostrarModal = true;
    this.mensaje = '';
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.evaluacionEditando = {};
    this.mensaje = '';
  }

  guardarEvaluacion(): void {
    if (!this.evaluacionEditando.idPasantia || !this.evaluacionEditando.idRubrica) return;
    this.guardando = true;
    const obs = this.esNuevo
      ? this.evaluacionService.crear(this.evaluacionEditando)
      : this.evaluacionService.actualizar(this.evaluacionEditando.idEvaluacion!, this.evaluacionEditando);
    obs.subscribe({
      next: res => {
        this.guardando = false;
        if (res.exito) {
          this.cerrarModal();
          this.cargarEvaluaciones();
          this.mostrarMensaje(this.esNuevo ? 'Evaluación creada correctamente.' : 'Evaluación actualizada.', false);
        } else { this.mensaje = res.mensaje; this.esError = true; }
      },
      error: () => { this.guardando = false; this.mensaje = 'Error de conexión.'; this.esError = true; }
    });
  }

  eliminarEvaluacion(e: EvaluacionAdmin): void {
    if (!confirm(`¿Eliminar la evaluación #${e.idEvaluacion}?`)) return;
    this.evaluacionService.eliminar(e.idEvaluacion).subscribe({
      next: res => { if (res.exito) { this.cargarEvaluaciones(); this.mostrarMensaje('Evaluación eliminada.', false); } }
    });
  }

  private mostrarMensaje(msg: string, error: boolean): void {
    this.mensaje = msg; this.esError = error;
    setTimeout(() => this.mensaje = '', 3000);
  }
}
