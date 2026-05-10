import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, RegistroRequest, RespuestaAPI } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;
  private usuarioActual = new BehaviorSubject<LoginResponse | null>(this.getUsuarioStorage());

  /** Observable del usuario autenticado (para suscribirse desde componentes) */
  usuarioActual$ = this.usuarioActual.asObservable();

  constructor(private http: HttpClient) {}

  /** Inicia sesión y almacena token + datos en localStorage */
  login(request: LoginRequest): Observable<RespuestaAPI<LoginResponse>> {
    return this.http.post<RespuestaAPI<LoginResponse>>(`${this.apiUrl}/auth/login`, request).pipe(
      tap(res => {
        if (res.exito && res.data) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('usuario', JSON.stringify(res.data));
          this.usuarioActual.next(res.data);
        }
      })
    );
  }

  /** Registra un nuevo usuario */
  registro(request: RegistroRequest): Observable<RespuestaAPI<any>> {
    return this.http.post<RespuestaAPI<any>>(`${this.apiUrl}/auth/registro`, request);
  }

  /** Cierra sesión eliminando datos del localStorage */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.usuarioActual.next(null);
  }

  /** Retorna el token JWT almacenado */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /** Verifica si el usuario está autenticado */
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  /** Obtiene el rol del usuario autenticado */
  getRol(): string | null {
    const usuario = this.getUsuarioStorage();
    return usuario ? usuario.rol : null;
  }

  /** Obtiene los datos del usuario desde localStorage */
  getUsuario(): LoginResponse | null {
    return this.getUsuarioStorage();
  }

  private getUsuarioStorage(): LoginResponse | null {
    const data = localStorage.getItem('usuario');
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        return null;
      }
    }
    return null;
  }
}
