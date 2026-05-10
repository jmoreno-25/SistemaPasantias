import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RespuestaAPI } from '../models/auth.model';
import { Rol } from '../models/rol.model';

@Injectable({ providedIn: 'root' })
export class RolService {
  private apiUrl = `${environment.apiUrl}/roles`;

  constructor(private http: HttpClient) {}

  /** Lista todos los roles activos */
  listar(): Observable<RespuestaAPI<Rol[]>> {
    return this.http.get<RespuestaAPI<Rol[]>>(this.apiUrl);
  }
}
