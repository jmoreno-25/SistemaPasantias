import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RespuestaAPI } from '../models/auth.model';
import { Postulacion } from '../models/postulacion.model';

@Injectable({ providedIn: 'root' })
export class PostulacionService {
  private apiUrl = `${environment.apiUrl}/postulaciones`;

  constructor(private http: HttpClient) {}

  crear(postulacion: Partial<Postulacion>): Observable<RespuestaAPI<any>> {
    return this.http.post<RespuestaAPI<any>>(this.apiUrl, postulacion);
  }

  listarPorEstudiante(idEstudiante: number): Observable<RespuestaAPI<Postulacion[]>> {
    return this.http.get<RespuestaAPI<Postulacion[]>>(`${this.apiUrl}/por-estudiante/${idEstudiante}`);
  }

  listar(): Observable<RespuestaAPI<Postulacion[]>> {
    return this.http.get<RespuestaAPI<Postulacion[]>>(this.apiUrl);
  }

  listarPorOferta(idOferta: number): Observable<RespuestaAPI<Postulacion[]>> {
    return this.http.get<RespuestaAPI<Postulacion[]>>(`${this.apiUrl}/por-oferta/${idOferta}`);
  }

  cambiarEstado(id: number, estado: string): Observable<RespuestaAPI<any>> {
    return this.http.put<RespuestaAPI<any>>(`${this.apiUrl}/${id}/estado`, JSON.stringify(estado));
  }
}
