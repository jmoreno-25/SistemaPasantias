import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OfertaService } from '../../../services/oferta.service';
import { EmpresaService } from '../../../services/empresa.service';
import { OfertaPasantia } from '../../../models/oferta.model';
import { Empresa } from '../../../models/usuario.model';

@Component({
  selector: 'app-admin-ofertas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-ofertas.component.html',
  styleUrl: './admin-ofertas.component.css'
})
export class AdminOfertasComponent implements OnInit {
  ofertas: OfertaPasantia[] = [];
  empresas: Empresa[] = [];
  busqueda = '';
  filtroEstado = '';
  cargando = false;
  mensaje = '';
  esError = false;

  mostrarModal = false;
  ofertaEditando: Partial<OfertaPasantia> = {};
  esNuevo = false;
  guardando = false;
  errores: { [key: string]: string } = {};

  // Modal "nueva empresa rÃ¡pida"
  mostrarModalEmpresa = false;
  empresaNueva: Partial<Empresa> = {};
  guardandoEmpresa = false;
  erroresEmpresa: { [key: string]: string } = {};

  modalidades = ['Presencial', 'Remoto', 'Hibrido'];

  constructor(private ofertaService: OfertaService, private empresaService: EmpresaService) {}

  ngOnInit(): void {
    this.cargarEmpresas();
    this.cargarOfertas();
  }

  cargarEmpresas(): void {
    this.empresaService.listar().subscribe({ next: res => { if (res.exito) this.empresas = res.data; } });
  }

  cargarOfertas(): void {
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

  nuevaOferta(): void {
    this.ofertaEditando = {
      titulo: '', descripcion: '', idEmpresa: undefined, lugar: '',
      modalidad: 'Presencial', remuneracion: false,
      cupos: 1, estado: 'Activa'
    };
    this.esNuevo = true;
    this.mostrarModal = true;
    this.mensaje = '';
    this.errores = {};
  }

  editarOferta(o: OfertaPasantia): void {
    this.ofertaEditando = { ...o };
    this.esNuevo = false;
    this.mostrarModal = true;
    this.mensaje = '';
    this.errores = {};
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.ofertaEditando = {};
    this.mensaje = '';
    this.errores = {};
  }

  // â”€â”€ Modal empresa rÃ¡pida â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  abrirModalEmpresa(): void {
    this.empresaNueva = { ruc: '', razonSocial: '', direccion: '', telefono: '', correo: '', sectorEconomico: '' };
    this.erroresEmpresa = {};
    this.mostrarModalEmpresa = true;
  }

  cerrarModalEmpresa(): void {
    this.mostrarModalEmpresa = false;
    this.empresaNueva = {};
    this.erroresEmpresa = {};
  }

  guardarEmpresaRapida(): void {
    this.erroresEmpresa = {};
    if (!this.empresaNueva.ruc?.trim()) { this.erroresEmpresa['ruc'] = 'El RUC es obligatorio.'; return; }
    if (!this.empresaNueva.razonSocial?.trim()) { this.erroresEmpresa['razonSocial'] = 'La RazÃ³n Social es obligatoria.'; return; }
    this.guardandoEmpresa = true;
    this.empresaService.crear({ ...this.empresaNueva }).subscribe({
      next: res => {
        this.guardandoEmpresa = false;
        if (res.exito) {
          this.cerrarModalEmpresa();
          this.cargarEmpresas();
          // Si res.data tiene idEmpresa, pre-seleccionar
          if (res.data?.idEmpresa) this.ofertaEditando.idEmpresa = res.data.idEmpresa;
        } else {
          this.erroresEmpresa['general'] = res.mensaje;
        }
      },
      error: () => { this.guardandoEmpresa = false; this.erroresEmpresa['general'] = 'Error de conexiÃ³n.'; }
    });
  }

  // â”€â”€ ValidaciÃ³n y guardado oferta â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  private validarFormulario(): boolean {
    this.errores = {};
    const o = this.ofertaEditando;
    if (!o.titulo?.trim()) this.errores['titulo'] = 'El tÃ­tulo es obligatorio.';
    if (!o.idEmpresa) this.errores['idEmpresa'] = 'Debe seleccionar una empresa.';
    if (!o.fechaInicio) this.errores['fechaInicio'] = 'La fecha de inicio es obligatoria.';
    if (!o.fechaFin) this.errores['fechaFin'] = 'La fecha de fin es obligatoria.';
    if (o.fechaInicio && o.fechaFin && o.fechaFin <= o.fechaInicio)
      this.errores['fechaFin'] = 'La fecha de fin debe ser posterior a la fecha de inicio.';
    if (!o.cupos || o.cupos < 1)
      this.errores['cupos'] = 'Los cupos deben ser al menos 1.';
    return Object.keys(this.errores).length === 0;
  }

  guardarOferta(): void {
    if (!this.validarFormulario()) return;
    this.guardando = true;
    const obs = this.esNuevo
      ? this.ofertaService.crear(this.ofertaEditando)
      : this.ofertaService.actualizar(this.ofertaEditando.idOferta!, this.ofertaEditando);
    obs.subscribe({
      next: res => {
        this.guardando = false;
        if (res.exito) {
          this.cerrarModal();
          this.cargarOfertas();
          this.mostrarMensaje(this.esNuevo ? 'Oferta creada correctamente.' : 'Oferta actualizada correctamente.', false);
        } else { this.mensaje = res.mensaje; this.esError = true; }
      },
      error: () => { this.guardando = false; this.mensaje = 'Error de conexiÃ³n.'; this.esError = true; }
    });
  }

  eliminarOferta(o: OfertaPasantia): void {
    if (!confirm(`Â¿Cancelar la oferta "${o.titulo}"?`)) return;
    this.ofertaService.eliminar(o.idOferta).subscribe({
      next: res => { if (res.exito) { this.cargarOfertas(); this.mostrarMensaje('Oferta cancelada.', false); } }
    });
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'Abierta': return 'badge-success';
      case 'Cerrada': return 'badge-warning';
      case 'Cancelada': return 'badge-danger';
      default: return '';
    }
  }

  private mostrarMensaje(msg: string, error: boolean): void {
    this.mensaje = msg; this.esError = error;
    setTimeout(() => this.mensaje = '', 3000);
  }
}

