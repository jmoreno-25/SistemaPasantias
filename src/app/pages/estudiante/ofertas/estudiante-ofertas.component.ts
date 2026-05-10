import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OfertaService } from '../../../services/oferta.service';
import { PostulacionService } from '../../../services/postulacion.service';
import { AuthService } from '../../../services/auth.service';
import { OfertaPasantia } from '../../../models/oferta.model';

const ITEMS_POR_PAGINA = 8;

@Component({
  selector: 'app-estudiante-ofertas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estudiante-ofertas.component.html',
  styleUrl: './estudiante-ofertas.component.css'
})
export class EstudianteOfertasComponent implements OnInit {
  ofertas: OfertaPasantia[] = [];
  cargando = false;
  busqueda = '';
  paginaActual = 1;

  // Panel detalle
  mostrarDetalle = false;
  ofertaSeleccionada: OfertaPasantia | null = null;

  // Postulaciones
  yaPostulado = new Set<number>();
  postulando = false;
  mensajePostulacion = '';

  constructor(
    private ofertaService: OfertaService,
    private postulacionService: PostulacionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarOfertas();
    this.cargarMisPostulaciones();
  }

  cargarOfertas(): void {
    this.cargando = true;
    this.ofertaService.listar().subscribe({
      next: (res) => {
        this.cargando = false;
        if (res.exito) {
          this.ofertas = res.data.filter(o => o.estado === 'Abierta');
        }
      },
      error: () => { this.cargando = false; }
    });
  }

  cargarMisPostulaciones(): void {
    const idEstudiante = this.authService.getUsuario()?.idPerfil;
    if (!idEstudiante) return;
    this.postulacionService.listarPorEstudiante(idEstudiante).subscribe({
      next: (res) => {
        if (res.exito && res.data) {
          this.yaPostulado = new Set(res.data.map(p => p.idOferta));
        }
      },
      error: () => {}
    });
  }

  postular(oferta: OfertaPasantia, event: Event): void {
    event.stopPropagation();
    if (this.yaPostulado.has(oferta.idOferta)) return;
    const idEstudiante = this.authService.getUsuario()?.idPerfil;
    if (!idEstudiante) return;

    this.postulando = true;
    this.mensajePostulacion = '';
    this.postulacionService.crear({ idOferta: oferta.idOferta, idEstudiante }).subscribe({
      next: (res) => {
        this.postulando = false;
        if (res.exito) {
          this.yaPostulado = new Set([...this.yaPostulado, oferta.idOferta]);
          if (this.ofertaSeleccionada?.idOferta === oferta.idOferta) {
            this.mensajePostulacion = 'Postulación enviada exitosamente.';
          }
        } else {
          this.mensajePostulacion = res.mensaje || 'No se pudo enviar la postulación.';
        }
      },
      error: () => {
        this.postulando = false;
        this.mensajePostulacion = 'Error al enviar la postulación.';
      }
    });
  }

  get ofertasFiltradas(): OfertaPasantia[] {
    const b = this.busqueda.toLowerCase().trim();
    if (!b) return this.ofertas;
    return this.ofertas.filter(o =>
      o.titulo?.toLowerCase().includes(b) ||
      o.nombreEmpresa?.toLowerCase().includes(b) ||
      o.lugar?.toLowerCase().includes(b) ||
      o.modalidad?.toLowerCase().includes(b)
    );
  }

  get totalPaginas(): number {
    return Math.ceil(this.ofertasFiltradas.length / ITEMS_POR_PAGINA) || 1;
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  get ofertasPaginadas(): OfertaPasantia[] {
    const inicio = (this.paginaActual - 1) * ITEMS_POR_PAGINA;
    return this.ofertasFiltradas.slice(inicio, inicio + ITEMS_POR_PAGINA);
  }

  irPagina(p: number): void {
    if (p >= 1 && p <= this.totalPaginas) this.paginaActual = p;
  }

  onBusquedaChange(): void {
    this.paginaActual = 1;
  }

  verDetalle(oferta: OfertaPasantia): void {
    this.ofertaSeleccionada = oferta;
    this.mostrarDetalle = true;
    this.mensajePostulacion = '';
  }

  cerrarDetalle(): void {
    this.mostrarDetalle = false;
    this.ofertaSeleccionada = null;
    this.mensajePostulacion = '';
  }

  calcularDuracion(inicio: string, fin: string): string {
    const d1 = new Date(inicio);
    const d2 = new Date(fin);
    const meses = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
    if (meses <= 0) return 'Menos de 1 mes';
    return meses === 1 ? '1 mes' : `${meses} meses`;
  }

  tiempoRelativo(fecha: string | null | undefined): string {
    if (!fecha) return '';
    const diff = Date.now() - new Date(fecha).getTime();
    const dias = Math.floor(diff / 86400000);
    if (dias === 0) return 'Hoy';
    if (dias === 1) return 'Hace 1 día';
    if (dias < 30) return `Hace ${dias} días`;
    const meses = Math.floor(dias / 30);
    return meses === 1 ? 'Hace 1 mes' : `Hace ${meses} meses`;
  }

  getColorEmpresa(nombre: string | null): string {
    const colores = ['#1a56db','#0e9f6e','#e74694','#ff5a1f','#6875f5','#31c48d','#f59e0b','#8b5cf6'];
    if (!nombre) return colores[0];
    let sum = 0;
    for (let i = 0; i < nombre.length; i++) sum += nombre.charCodeAt(i);
    return colores[sum % colores.length];
  }

  getInitiales(nombre: string | null): string {
    if (!nombre) return 'E';
    const partes = nombre.trim().split(/\s+/);
    if (partes.length >= 2) return (partes[0][0] + partes[1][0]).toUpperCase();
    return nombre.substring(0, 2).toUpperCase();
  }
}

