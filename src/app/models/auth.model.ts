export interface LoginRequest {
  email: string;
  contrasena: string;
}

export interface LoginResponse {
  token: string;
  idUsuario: number;
  nombres: string;
  apellidos: string;
  email: string;
  rol: string;
  idRol: number;
  /** ESTU_ID / TUTOR_ID / RP_ID según el rol. 0 si es Administrador. */
  idPerfil: number;
}

export interface RegistroRequest {
  cedula: string;
  nombres: string;
  apellidos: string;
  email: string;
  contrasena: string;
  telefono: string;
  idRol: number;

  // Estudiante + Docente (comparten idFacultad)
  idFacultad?: number;
  idCarrera?: number;
  semestre?: string;

  // Docente
  tituloAcademico?: string;
  especialidad?: string;

  // Tutor Empresarial
  idEmpresa?: number;
  cargo?: string;
}

export interface RespuestaAPI<T = any> {
  exito: boolean;
  mensaje: string;
  data: T;
}
