import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RespuestaAPI } from '../models/auth.model';

export interface Actividad {
  idActividad: number;
  idPasantia: number;
  idEstudiante: number;
  titulo: string;
  descripcion: string | null;
  fecha: string;
  horas: number;
  creadoEn: string | null;
  nombreEstudiante: string | null;
  validada: boolean;
  validadoEn: string | null;
}

export interface NuevaActividad {
  idPasantia: number;
  idEstudiante: number;
  titulo: string;
  descripcion: string | null;
  fecha: string;
  horas: number;
}

@Injectable({ providedIn: 'root' })
export class ActividadService {
  private api = `${environment.apiUrl}/actividades`;

  constructor(private http: HttpClient) {}

  listarPorPasantia(idPasantia: number): Observable<RespuestaAPI<Actividad[]>> {
    return this.http.get<RespuestaAPI<Actividad[]>>(`${this.api}/por-pasantia/${idPasantia}`);
  }

  listarPorEstudiante(idEstudiante: number): Observable<RespuestaAPI<Actividad[]>> {
    return this.http.get<RespuestaAPI<Actividad[]>>(`${this.api}/por-estudiante/${idEstudiante}`);
  }

  crear(actividad: NuevaActividad): Observable<RespuestaAPI<any>> {
    return this.http.post<RespuestaAPI<any>>(this.api, actividad);
  }

  actualizar(id: number, actividad: NuevaActividad): Observable<RespuestaAPI<any>> {
    return this.http.put<RespuestaAPI<any>>(`${this.api}/${id}`, actividad);
  }

  eliminar(id: number): Observable<RespuestaAPI<any>> {
    return this.http.delete<RespuestaAPI<any>>(`${this.api}/${id}`);
  }

  validar(id: number): Observable<RespuestaAPI<any>> {
    return this.http.put<RespuestaAPI<any>>(`${this.api}/${id}/validar`, {});
  }
}
