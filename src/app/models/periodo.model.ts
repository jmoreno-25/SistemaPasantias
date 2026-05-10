export interface PeriodoAcademico {
  idPeriodo: number;
  nombre: string;
  anio: number;
  numeroPeriodo: number;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  fechaRegistro?: string;
  totalPasantias?: number;
}
