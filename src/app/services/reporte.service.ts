import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RespuestaAPI } from '../models/auth.model';
import { DashboardAdmin } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class ReporteService {
  private apiUrl = `${environment.apiUrl}/reportes`;

  constructor(private http: HttpClient) {}

  obtenerDashboard(): Observable<RespuestaAPI<DashboardAdmin>> {
    return this.http.get<RespuestaAPI<DashboardAdmin>>(`${this.apiUrl}/dashboard`);
  }

  listarLogs(pagina: number = 1, tamano: number = 50, tabla?: string): Observable<RespuestaAPI<any[]>> {
    let url = `${environment.apiUrl}/auditoria?pagina=${pagina}&tamano=${tamano}`;
    if (tabla) url += `&tabla=${tabla}`;
    return this.http.get<RespuestaAPI<any[]>>(url);
  }
}
