import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RespuestaAPI } from '../models/auth.model';
import { Carrera } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class CarreraService {
  private apiUrl = `${environment.apiUrl}/carreras`;

  constructor(private http: HttpClient) {}

  listar(): Observable<RespuestaAPI<Carrera[]>> {
    return this.http.get<RespuestaAPI<Carrera[]>>(this.apiUrl);
  }

  listarPorFacultad(idFacultad: number): Observable<RespuestaAPI<Carrera[]>> {
    return this.http.get<RespuestaAPI<Carrera[]>>(`${this.apiUrl}/por-facultad/${idFacultad}`);
  }

  crear(carrera: Partial<Carrera>): Observable<RespuestaAPI<any>> {
    return this.http.post<RespuestaAPI<any>>(this.apiUrl, carrera);
  }

  actualizar(id: number, carrera: Partial<Carrera>): Observable<RespuestaAPI<any>> {
    return this.http.put<RespuestaAPI<any>>(`${this.apiUrl}/${id}`, carrera);
  }

  eliminar(id: number): Observable<RespuestaAPI<any>> {
    return this.http.delete<RespuestaAPI<any>>(`${this.apiUrl}/${id}`);
  }
}
