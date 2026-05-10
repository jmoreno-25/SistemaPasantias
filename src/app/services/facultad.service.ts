import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RespuestaAPI } from '../models/auth.model';
import { Facultad } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class FacultadService {
  private apiUrl = `${environment.apiUrl}/facultades`;

  constructor(private http: HttpClient) {}

  listar(): Observable<RespuestaAPI<Facultad[]>> {
    return this.http.get<RespuestaAPI<Facultad[]>>(this.apiUrl);
  }

  crear(facultad: Partial<Facultad>): Observable<RespuestaAPI<any>> {
    return this.http.post<RespuestaAPI<any>>(this.apiUrl, facultad);
  }

  actualizar(id: number, facultad: Partial<Facultad>): Observable<RespuestaAPI<any>> {
    return this.http.put<RespuestaAPI<any>>(`${this.apiUrl}/${id}`, facultad);
  }

  eliminar(id: number): Observable<RespuestaAPI<any>> {
    return this.http.delete<RespuestaAPI<any>>(`${this.apiUrl}/${id}`);
  }
}
