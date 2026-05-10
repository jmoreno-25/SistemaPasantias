import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RespuestaAPI } from '../models/auth.model';
import { Usuario } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  /** Lista usuarios activos, opcionalmente filtrados por rol */
  listar(idRol?: number): Observable<RespuestaAPI<Usuario[]>> {
    let params = new HttpParams();
    if (idRol) {
      params = params.set('idRol', idRol.toString());
    }
    return this.http.get<RespuestaAPI<Usuario[]>>(this.apiUrl, { params });
  }

  /** Obtiene un usuario por ID */
  obtenerPorId(id: number): Observable<RespuestaAPI<Usuario>> {
    return this.http.get<RespuestaAPI<Usuario>>(`${this.apiUrl}/${id}`);
  }

  /** Obtiene el perfil del usuario autenticado */
  obtenerPerfil(): Observable<RespuestaAPI<Usuario>> {
    return this.http.get<RespuestaAPI<Usuario>>(`${this.apiUrl}/perfil`);
  }

  /** Actualiza datos de un usuario */
  actualizar(id: number, usuario: Partial<Usuario>): Observable<RespuestaAPI<any>> {
    return this.http.put<RespuestaAPI<any>>(`${this.apiUrl}/${id}`, usuario);
  }

  /** Desactiva un usuario (borrado lógico) */
  eliminar(id: number): Observable<RespuestaAPI<any>> {
    return this.http.delete<RespuestaAPI<any>>(`${this.apiUrl}/${id}`);
  }

  /** Cambia la contraseña de un usuario */
  cambiarContrasena(id: number, contrasenaActual: string, nuevaContrasena: string): Observable<RespuestaAPI<any>> {
    return this.http.put<RespuestaAPI<any>>(`${this.apiUrl}/${id}/contrasena`, {
      contrasenaActual,
      nuevaContrasena
    });
  }
}
