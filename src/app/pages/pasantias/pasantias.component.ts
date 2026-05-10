import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface PasantiaCard {
  id: number;
  empresa: string;
  puesto: string;
  carrera: string;
  duracion: string;
  estado: 'Abierta' | 'Cerrada';
  tiempoPublicacion: string;
  colorLogo: string;
  iconoEmpresa: string;
}

@Component({
  selector: 'app-pasantias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pasantias.component.html',
  styleUrl: './pasantias.component.css'
})
export class PasantiasComponent implements OnInit {
  pasantias: PasantiaCard[] = [];
  pasantiasPaginadas: PasantiaCard[] = [];
  paginaActual = 1;
  porPagina = 4;
  totalPaginas = 1;
  paginas: number[] = [];

  ngOnInit(): void {
    // Datos de ejemplo (se reemplazaran con la API real)
    this.pasantias = [
      { id: 1, empresa: 'Empresa Electrica Quito S.A.', puesto: 'Pasante Backend .NET', carrera: 'Ingenieria en Sistemas de la Informacion', duracion: '6 meses', estado: 'Abierta', tiempoPublicacion: 'Hace 2 dias', colorLogo: '#0277bd', iconoEmpresa: 'bolt' },
      { id: 2, empresa: 'Tipti', puesto: 'Pasante QA', carrera: 'Ingenieria en Sistemas de la Informacion', duracion: '6 meses', estado: 'Cerrada', tiempoPublicacion: 'Hace 2 dias', colorLogo: '#e65100', iconoEmpresa: 'shopping_cart' },
      { id: 3, empresa: 'Tipti', puesto: 'Pasante QA', carrera: 'Ingenieria en Sistemas de la Informacion', duracion: '6 meses', estado: 'Cerrada', tiempoPublicacion: 'Hace 2 dias', colorLogo: '#e65100', iconoEmpresa: 'shopping_cart' },
      { id: 4, empresa: 'Empresa Electrica Quito S.A.', puesto: 'Pasante Backend .NET', carrera: 'Ingenieria en Sistemas de la Informacion', duracion: '6 meses', estado: 'Abierta', tiempoPublicacion: 'Hace 2 dias', colorLogo: '#0277bd', iconoEmpresa: 'bolt' },
      { id: 5, empresa: 'Banco Pichincha', puesto: 'Pasante Frontend Angular', carrera: 'Ingenieria en Sistemas de la Informacion', duracion: '4 meses', estado: 'Abierta', tiempoPublicacion: 'Hace 5 dias', colorLogo: '#1b5e20', iconoEmpresa: 'account_balance' },
      { id: 6, empresa: 'CNT EP', puesto: 'Pasante Soporte TI', carrera: 'Ingenieria en Sistemas de la Informacion', duracion: '6 meses', estado: 'Cerrada', tiempoPublicacion: 'Hace 1 semana', colorLogo: '#4a148c', iconoEmpresa: 'cell_tower' },
    ];

    this.totalPaginas = Math.ceil(this.pasantias.length / this.porPagina);
    this.paginas = Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
    this.actualizarPagina();
  }

  actualizarPagina(): void {
    const inicio = (this.paginaActual - 1) * this.porPagina;
    this.pasantiasPaginadas = this.pasantias.slice(inicio, inicio + this.porPagina);
  }

  irAPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.actualizarPagina();
    }
  }

  aplicar(pasantia: PasantiaCard): void {
    alert('Postulacion enviada a: ' + pasantia.empresa + ' - ' + pasantia.puesto);
  }
}
