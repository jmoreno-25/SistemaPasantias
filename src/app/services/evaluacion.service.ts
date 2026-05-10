import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RespuestaAPI } from '../models/auth.model';
import { EvaluacionAdmin } from '../models/evaluacion.model';

@Injectable({ providedIn: 'root' })
export class EvaluacionService {
  private apiUrl = `${environment.apiUrl}/evaluaciones`;

  constructor(private http: HttpClient) {}

  listar(): Observable<RespuestaAPI<EvaluacionAdmin[]>> {
    return this.http.get<RespuestaAPI<EvaluacionAdmin[]>>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<RespuestaAPI<EvaluacionAdmin>> {
    return this.http.get<RespuestaAPI<EvaluacionAdmin>>(`${this.apiUrl}/${id}`);
  }

  crear(evaluacion: Partial<EvaluacionAdmin>): Observable<RespuestaAPI<any>> {
    return this.http.post<RespuestaAPI<any>>(this.apiUrl, evaluacion);
  }

  actualizar(id: number, evaluacion: Partial<EvaluacionAdmin>): Observable<RespuestaAPI<any>> {
    return this.http.put<RespuestaAPI<any>>(`${this.apiUrl}/${id}`, evaluacion);
  }

  eliminar(id: number): Observable<RespuestaAPI<any>> {
    return this.http.delete<RespuestaAPI<any>>(`${this.apiUrl}/${id}`);
  }
}
