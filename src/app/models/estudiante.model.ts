export interface Estudiante {
  idEstudiante: number;
  idUsuario: number;
  idCarrera: number;
  semestre?: string;
  cvUrl?: string | null;
  creadoEn?: string;
  nombres?: string;
  apellidos?: string;
  correo?: string;
  cedula?: string;
  telefono?: string;
  activo?: boolean;
  nombreCarrera?: string;
  nombreFacultad?: string;
}
