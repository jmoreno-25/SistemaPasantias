export interface Usuario {
  idUsuario: number;
  cedula: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string | null;
  idRol: number;
  activo: boolean;
  fechaRegistro: string;
  idFacultad?: number;
  idCarrera?: number;
  semestre?: string;
  estado?: string;
}

export interface Facultad {
  idFacultad: number;
  nombre: string;
  activo: boolean;
}

export interface Carrera {
  idCarrera: number;
  nombre: string;
  idFacultad: number;
  activo: boolean;
}

export interface Empresa {
  idEmpresa: number;
  ruc: string | null;
  razonSocial: string | null;
  direccion: string | null;
  telefono: string | null;
  correo: string | null;
  sectorEconomico: string | null;
}
