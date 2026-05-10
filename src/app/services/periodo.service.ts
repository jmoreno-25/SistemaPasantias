import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RespuestaAPI } from '../models/auth.model';
import { PeriodoAcademico } from '../models/periodo.model';

@Injectable({ providedIn: 'root' })
export class PeriodoService {
  private apiUrl = `${environment.apiUrl}/periodos`;

  constructor(private http: HttpClient) {}

  listar(): Observable<RespuestaAPI<PeriodoAcademico[]>> {
    return this.http.get<RespuestaAPI<PeriodoAcademico[]>>(this.apiUrl);
  }

  obtenerActivo(): Observable<RespuestaAPI<PeriodoAcademico>> {
    return this.http.get<RespuestaAPI<PeriodoAcademico>>(`${this.apiUrl}/activo`);
  }

  crear(periodo: Partial<PeriodoAcademico>): Observable<RespuestaAPI<any>> {
    return this.http.post<RespuestaAPI<any>>(this.apiUrl, periodo);
  }

  actualizar(id: number, periodo: Partial<PeriodoAcademico>): Observable<RespuestaAPI<any>> {
    return this.http.put<RespuestaAPI<any>>(`${this.apiUrl}/${id}`, periodo);
  }

  eliminar(id: number): Observable<RespuestaAPI<any>> {
    return this.http.delete<RespuestaAPI<any>>(`${this.apiUrl}/${id}`);
  }
}
