import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostulacionService } from '../../../services/postulacion.service';
import { AuthService } from '../../../services/auth.service';
import { Postulacion } from '../../../models/postulacion.model';

@Component({
  selector: 'app-estudiante-postulaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estudiante-postulaciones.component.html',
  styleUrls: ['./estudiante-postulaciones.component.css']
})
export class EstudiantePostulacionesComponent implements OnInit {
  postulaciones: Postulacion[] = [];
  cargando = true;
  error = '';

  constructor(
    private postulacionService: PostulacionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const usuario = this.authService.getUsuario();
    if (usuario && usuario.idPerfil) {
      this.postulacionService.listarPorEstudiante(usuario.idPerfil).subscribe({
        next: res => {
          this.postulaciones = res.exito ? (res.data || []) : [];
          if (!res.exito) this.error = res.mensaje;
          this.cargando = false;
        },
        error: () => {
          this.error = 'No se pudieron cargar las postulaciones.';
          this.cargando = false;
        }
      });
    } else {
      this.cargando = false;
      this.error = 'No se pudo identificar el estudiante.';
    }
  }

  getEstadoClass(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'pendiente': return 'badge-pendiente';
      case 'aceptada': return 'badge-aceptada';
      case 'rechazada': return 'badge-rechazada';
      default: return 'badge-pendiente';
    }
  }

  getEstadoIcon(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'aceptada': return 'check_circle';
      case 'rechazada': return 'cancel';
      default: return 'hourglass_empty';
    }
  }
}
