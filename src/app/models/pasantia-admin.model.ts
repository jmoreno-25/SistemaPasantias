export interface PasantiaAdmin {
  idPte: number;
  idPasantia: number;
  idTutor: number;
  idEstudiante: number;
  nombreEstudiante: string | null;
  nombreTutor: string | null;
  nombreEmpresa: string | null;
  cargoPasantia: string | null;
  estadoPasantia: string | null;
  fechaInicio: string | null;
  fechaFin: string | null;
  horasRequeridas: number;
  horasCompletadas: number;
}

export interface PasantiaDetalle {
  idPasantia: number;
  idPte: number;
  nombreEstudiante: string | null;
  nombreTutor: string | null;
  nombreEmpresa: string | null;
  cargoPasantia: string | null;
  estadoPasantia: string | null;
  fechaInicio: string | null;
  horasRequeridas: number;
  horasCompletadas: number;
}

export interface ActividadDiariaAdmin {
  idActividad: number;
  idPasantia: number;
  fecha: string;
  descripcion: string;
  horasRegistradas: number;
}
