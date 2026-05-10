import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RespuestaAPI } from '../models/auth.model';
import { Empresa } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class EmpresaService {
  private apiUrl = `${environment.apiUrl}/empresas`;

  constructor(private http: HttpClient) {}

  listar(): Observable<RespuestaAPI<Empresa[]>> {
    return this.http.get<RespuestaAPI<Empresa[]>>(this.apiUrl);
  }

  crear(empresa: Partial<Empresa>): Observable<RespuestaAPI<any>> {
    return this.http.post<RespuestaAPI<any>>(this.apiUrl, empresa);
  }

  actualizar(id: number, empresa: Partial<Empresa>): Observable<RespuestaAPI<any>> {
    return this.http.put<RespuestaAPI<any>>(`${this.apiUrl}/${id}`, empresa);
  }

  eliminar(id: number): Observable<RespuestaAPI<any>> {
    return this.http.delete<RespuestaAPI<any>>(`${this.apiUrl}/${id}`);
  }
}
