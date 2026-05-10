import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmpresaService } from '../../../services/empresa.service';
import { Empresa } from '../../../models/usuario.model';

@Component({
  selector: 'app-admin-empresas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-empresas.component.html',
  styleUrl: './admin-empresas.component.css'
})
export class AdminEmpresasComponent implements OnInit {
  empresas: Empresa[] = [];
  busqueda = '';
  cargando = false;
  mensaje = '';
  esError = false;

  mostrarModal = false;
  empresaEditando: Partial<Empresa> = {};
  esNuevo = false;
  guardando = false;

  errores: { [key: string]: string } = {};

  sectoresEconomicos: string[] = [
    'Agricultura, ganadería y pesca',
    'Manufactura / Industria',
    'Construcción',
    'Comercio al por mayor y menor',
    'Transporte y logística',
    'Alojamiento y servicios de comida',
    'Información y comunicación',
    'Tecnología e Innovación',
    'Actividades financieras y de seguros',
    'Actividades inmobiliarias',
    'Actividades profesionales, científicas y técnicas',
    'Educación',
    'Salud y asistencia social',
    'Servicios públicos',
    'Otro'
  ];

  constructor(private empresaService: EmpresaService) {}

  ngOnInit(): void {
    this.cargarEmpresas();
  }

  cargarEmpresas(): void {
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

  nuevaEmpresa(): void {
    this.empresaEditando = { ruc: '', razonSocial: '', direccion: '', telefono: '', correo: '', sectorEconomico: '' };
    this.esNuevo = true;
    this.mostrarModal = true;
    this.mensaje = '';
    this.errores = {};
  }

  editarEmpresa(e: Empresa): void {
    this.empresaEditando = { ...e };
    this.esNuevo = false;
    this.mostrarModal = true;
    this.mensaje = '';
    this.errores = {};
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.empresaEditando = {};
    this.mensaje = '';
    this.errores = {};
  }

  // ── Validadores cliente ────────────────────────────────────────────────────

  private validarRUCEcuador(ruc: string): boolean {
    if (!ruc || ruc.length !== 13 || !/^\d{13}$/.test(ruc)) return false;
    const prov = parseInt(ruc.substring(0, 2), 10);
    if (prov < 1 || prov > 24) return false;
    const tercero = parseInt(ruc[2], 10);

    if (tercero >= 0 && tercero <= 5) {
      if (ruc.substring(10) !== '001') return false;
      return this.validarCedulaAlgoritmo(ruc.substring(0, 10));
    } else if (tercero === 6) {
      const coef = [3, 2, 7, 6, 5, 4, 3, 2];
      const suma = coef.reduce((s, c, i) => s + c * parseInt(ruc[i], 10), 0);
      const ver = suma % 11 === 0 ? 0 : 11 - (suma % 11);
      return ver === parseInt(ruc[8], 10);
    } else if (tercero === 9) {
      const coef = [4, 3, 2, 7, 6, 5, 4, 3, 2];
      const suma = coef.reduce((s, c, i) => s + c * parseInt(ruc[i], 10), 0);
      const ver = suma % 11 === 0 ? 0 : 11 - (suma % 11);
      return ver === parseInt(ruc[9], 10);
    }
    return false;
  }

  private validarCedulaAlgoritmo(cedula: string): boolean {
    if (!cedula || cedula.length !== 10 || !/^\d{10}$/.test(cedula)) return false;
    const prov = parseInt(cedula.substring(0, 2), 10);
    if (prov < 1 || prov > 24) return false;
    if (parseInt(cedula[2], 10) > 5) return false;
    const coef = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    let suma = 0;
    for (let i = 0; i < 9; i++) {
      let val = parseInt(cedula[i], 10) * coef[i];
      if (val >= 10) val -= 9;
      suma += val;
    }
    const verificador = (10 - (suma % 10)) % 10;
    return verificador === parseInt(cedula[9], 10);
  }

  private validarEmailFmt(email: string): boolean {
    return /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(email);
  }

  private validarTelefonoFmt(tel: string): boolean {
    const limpio = tel.replace(/[\s\-]/g, '');
    return /^\d{7,10}$/.test(limpio);
  }

  private validarFormulario(): boolean {
    this.errores = {};
    const e = this.empresaEditando;

    if (!e.ruc?.trim()) {
      this.errores['ruc'] = 'El RUC es obligatorio.';
    } else if (!this.validarRUCEcuador(e.ruc.trim())) {
      this.errores['ruc'] = 'El RUC no es válido. Debe tener 13 dígitos y cumplir el algoritmo del SRI.';
    }

    if (!e.razonSocial?.trim()) {
      this.errores['razonSocial'] = 'La Razón Social es obligatoria.';
    }

    if (e.correo?.trim() && !this.validarEmailFmt(e.correo.trim())) {
      this.errores['correo'] = 'El correo electrónico no es válido.';
    }

    if (e.telefono?.trim() && !this.validarTelefonoFmt(e.telefono.trim())) {
      this.errores['telefono'] = 'El número de teléfono no es válido. Debe tener entre 7 y 10 dígitos.';
    }

    return Object.keys(this.errores).length === 0;
  }

  guardarEmpresa(): void {
    if (!this.validarFormulario()) return;
    this.guardando = true;
    const obs = this.esNuevo
      ? this.empresaService.crear(this.empresaEditando)
      : this.empresaService.actualizar(this.empresaEditando.idEmpresa!, this.empresaEditando);
    obs.subscribe({
      next: res => {
        this.guardando = false;
        if (res.exito) {
          this.cerrarModal();
          this.cargarEmpresas();
          this.mostrarMensaje(this.esNuevo ? 'Empresa creada correctamente.' : 'Empresa actualizada correctamente.', false);
        } else {
          this.mensaje = res.mensaje;
          this.esError = true;
        }
      },
      error: () => { this.guardando = false; this.mensaje = 'Error de conexión.'; this.esError = true; }
    });
  }

  eliminarEmpresa(e: Empresa): void {
    if (!confirm(`¿Desactivar la empresa "${e.razonSocial}"?`)) return;
    this.empresaService.eliminar(e.idEmpresa).subscribe({
      next: res => {
        if (res.exito) { this.cargarEmpresas(); this.mostrarMensaje('Empresa desactivada.', false); }
      }
    });
  }

  private mostrarMensaje(msg: string, error: boolean): void {
    this.mensaje = msg;
    this.esError = error;
    setTimeout(() => this.mensaje = '', 3000);
  }
}

