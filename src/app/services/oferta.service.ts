import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RespuestaAPI } from '../models/auth.model';
import { OfertaPasantia } from '../models/oferta.model';

@Injectable({ providedIn: 'root' })
export class OfertaService {
  private apiUrl = `${environment.apiUrl}/ofertas`;

  constructor(private http: HttpClient) {}

  listar(): Observable<RespuestaAPI<OfertaPasantia[]>> {
    return this.http.get<RespuestaAPI<OfertaPasantia[]>>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<RespuestaAPI<OfertaPasantia>> {
    return this.http.get<RespuestaAPI<OfertaPasantia>>(`${this.apiUrl}/${id}`);
  }

  crear(oferta: Partial<OfertaPasantia>): Observable<RespuestaAPI<any>> {
    return this.http.post<RespuestaAPI<any>>(this.apiUrl, oferta);
  }

  actualizar(id: number, oferta: Partial<OfertaPasantia>): Observable<RespuestaAPI<any>> {
    return this.http.put<RespuestaAPI<any>>(`${this.apiUrl}/${id}`, oferta);
  }

  eliminar(id: number): Observable<RespuestaAPI<any>> {
    return this.http.delete<RespuestaAPI<any>>(`${this.apiUrl}/${id}`);
  }
}
