import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FacultadService } from '../../../services/facultad.service';
import { CarreraService } from '../../../services/carrera.service';
import { Facultad, Carrera } from '../../../models/usuario.model';

@Component({
  selector: 'app-admin-facultades',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-facultades.component.html',
  styleUrl: './admin-facultades.component.css'
})
export class AdminFacultadesComponent implements OnInit {
  facultades: Facultad[] = [];
  carreras: Carrera[] = [];
  facultadSeleccionada: number | null = null;
  cargando = false;
  mensaje = '';
  esError = false;

  // Modal Facultad
  mostrarModalFac = false;
  facEditando: Partial<Facultad> = {};
  esNuevoFac = false;
  guardandoFac = false;

  // Modal Carrera
  mostrarModalCar = false;
  carEditando: Partial<Carrera> = {};
  esNuevoCar = false;
  guardandoCar = false;

  constructor(private facService: FacultadService, private carService: CarreraService) {}

  ngOnInit(): void {
    this.cargarFacultades();
    this.cargarCarreras();
  }

  cargarFacultades(): void {
    this.facService.listar().subscribe({ next: res => { if (res.exito) this.facultades = res.data; } });
  }

  cargarCarreras(): void {
    this.cargando = true;
    const obs = this.facultadSeleccionada
      ? this.carService.listarPorFacultad(this.facultadSeleccionada)
      : this.carService.listar();
    obs.subscribe({
      next: res => { this.cargando = false; if (res.exito) this.carreras = res.data; },
      error: () => { this.cargando = false; }
    });
  }

  getNombreFacultad(id: number): string {
    return this.facultades.find(f => f.idFacultad === id)?.nombre || 'N/A';
  }

  // Facultad CRUD
  nuevaFacultad(): void { this.facEditando = { nombre: '' }; this.esNuevoFac = true; this.mostrarModalFac = true; }
  editarFacultad(f: Facultad): void { this.facEditando = { ...f }; this.esNuevoFac = false; this.mostrarModalFac = true; }
  cerrarModalFac(): void { this.mostrarModalFac = false; this.facEditando = {}; }

  guardarFacultad(): void {
    if (!this.facEditando.nombre?.trim()) return;
    this.guardandoFac = true;
    const obs = this.esNuevoFac
      ? this.facService.crear(this.facEditando)
      : this.facService.actualizar(this.facEditando.idFacultad!, this.facEditando);
    obs.subscribe({
      next: res => {
        this.guardandoFac = false;
        if (res.exito) { this.cerrarModalFac(); this.cargarFacultades(); this.aviso(this.esNuevoFac ? 'Facultad creada.' : 'Facultad actualizada.', false); }
        else { this.mensaje = res.mensaje; this.esError = true; }
      },
      error: () => { this.guardandoFac = false; }
    });
  }

  eliminarFacultad(f: Facultad): void {
    if (!confirm(`¿Desactivar la facultad "${f.nombre}"?`)) return;
    this.facService.eliminar(f.idFacultad).subscribe({ next: res => { if (res.exito) { this.cargarFacultades(); this.aviso('Facultad desactivada.', false); } } });
  }

  // Carrera CRUD
  nuevaCarrera(): void { this.carEditando = { nombre: '', idFacultad: this.facultadSeleccionada || 0 }; this.esNuevoCar = true; this.mostrarModalCar = true; }
  editarCarrera(c: Carrera): void { this.carEditando = { ...c }; this.esNuevoCar = false; this.mostrarModalCar = true; }
  cerrarModalCar(): void { this.mostrarModalCar = false; this.carEditando = {}; }

  guardarCarrera(): void {
    if (!this.carEditando.nombre?.trim() || !this.carEditando.idFacultad) return;
    this.guardandoCar = true;
    const obs = this.esNuevoCar
      ? this.carService.crear(this.carEditando)
      : this.carService.actualizar(this.carEditando.idCarrera!, this.carEditando);
    obs.subscribe({
      next: res => {
        this.guardandoCar = false;
        if (res.exito) { this.cerrarModalCar(); this.cargarCarreras(); this.aviso(this.esNuevoCar ? 'Carrera creada.' : 'Carrera actualizada.', false); }
        else { this.mensaje = res.mensaje; this.esError = true; }
      },
      error: () => { this.guardandoCar = false; }
    });
  }

  eliminarCarrera(c: Carrera): void {
    if (!confirm(`¿Desactivar la carrera "${c.nombre}"?`)) return;
    this.carService.eliminar(c.idCarrera).subscribe({ next: res => { if (res.exito) { this.cargarCarreras(); this.aviso('Carrera desactivada.', false); } } });
  }

  private aviso(msg: string, error: boolean): void {
    this.mensaje = msg; this.esError = error;
    setTimeout(() => this.mensaje = '', 3000);
  }
}
