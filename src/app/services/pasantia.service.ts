import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RespuestaAPI } from '../models/auth.model';
import { PasantiaAdmin, PasantiaDetalle } from '../models/pasantia-admin.model';

@Injectable({ providedIn: 'root' })
export class PasantiaService {
  private apiUrl = `${environment.apiUrl}/pasantias`;

  constructor(private http: HttpClient) {}

  listar(): Observable<RespuestaAPI<PasantiaAdmin[]>> {
    return this.http.get<RespuestaAPI<PasantiaAdmin[]>>(`${environment.apiUrl}/pasantias-asignaciones`);
  }

  listarPorEstudiante(idEstudiante: number): Observable<RespuestaAPI<PasantiaAdmin[]>> {
    return this.http.get<RespuestaAPI<PasantiaAdmin[]>>(`${environment.apiUrl}/pasantias-asignaciones/por-estudiante/${idEstudiante}`);
  }

  listarPorUsuario(idUsuario: number): Observable<RespuestaAPI<PasantiaAdmin[]>> {
    return this.http.get<RespuestaAPI<PasantiaAdmin[]>>(`${environment.apiUrl}/pasantias-asignaciones/por-usuario/${idUsuario}`);
  }

  listarPorUsuarioTutor(idUsuario: number): Observable<RespuestaAPI<PasantiaAdmin[]>> {
    return this.http.get<RespuestaAPI<PasantiaAdmin[]>>(`${environment.apiUrl}/pasantias-asignaciones/por-usuario-tutor/${idUsuario}`);
  }

  obtenerPorId(id: number): Observable<RespuestaAPI<PasantiaAdmin>> {
    return this.http.get<RespuestaAPI<PasantiaAdmin>>(`${this.apiUrl}/${id}`);
  }

  obtenerDetalle(id: number): Observable<RespuestaAPI<PasantiaDetalle>> {
    return this.http.get<RespuestaAPI<PasantiaDetalle>>(`${this.apiUrl}/${id}/detalle`);
  }

  crear(pasantia: any): Observable<RespuestaAPI<any>> {
    return this.http.post<RespuestaAPI<any>>(this.apiUrl, pasantia);
  }

  registrarEstudiante(req: any): Observable<RespuestaAPI<any>> {
    return this.http.post<RespuestaAPI<any>>(`${this.apiUrl}/registro-estudiante`, req);
  }

  actualizar(id: number, pasantia: any): Observable<RespuestaAPI<any>> {
    return this.http.put<RespuestaAPI<any>>(`${this.apiUrl}/${id}`, pasantia);
  }

  eliminar(id: number): Observable<RespuestaAPI<any>> {
    return this.http.delete<RespuestaAPI<any>>(`${this.apiUrl}/${id}`);
  }
}

