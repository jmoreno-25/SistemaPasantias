import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RespuestaAPI } from '../models/auth.model';
import { Estudiante } from '../models/estudiante.model';

@Injectable({ providedIn: 'root' })
export class EstudianteService {
  private apiUrl = `${environment.apiUrl}/estudiantes`;

  constructor(private http: HttpClient) {}

  listar(): Observable<RespuestaAPI<Estudiante[]>> {
    return this.http.get<RespuestaAPI<Estudiante[]>>(this.apiUrl);
  }

  obtenerPorUsuario(idUsuario: number): Observable<RespuestaAPI<Estudiante>> {
    return this.http.get<RespuestaAPI<Estudiante>>(`${this.apiUrl}/por-usuario/${idUsuario}`);
  }

  obtenerPorId(id: number): Observable<RespuestaAPI<Estudiante>> {
    return this.http.get<RespuestaAPI<Estudiante>>(`${this.apiUrl}/${id}`);
  }

  subirCv(idEstudiante: number, file: File): Observable<RespuestaAPI<{ cvUrl: string }>> {
    const formData = new FormData();
    formData.append('cv', file, file.name);
    return this.http.post<RespuestaAPI<{ cvUrl: string }>>(
      `${this.apiUrl}/${idEstudiante}/upload-cv`,
      formData
    );
  }
}
