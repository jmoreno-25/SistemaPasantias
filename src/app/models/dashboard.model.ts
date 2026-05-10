export interface DashboardKPI {
  totalInscritos: number;
  totalEnCurso: number;
  totalCompletaron: number;
  totalOfertasActivas: number;
  totalEmpresas: number;
}

export interface InscritosPorSemestre {
  semestre: string;
  total: number;
}

export interface EmpresaOfertas {
  idEmpresa: number;
  nombreEmpresa: string;
  totalOfertas: number;
  ofertasActivas: number;
}

export interface InscritosPorPeriodo {
  idPeriodo: number;
  nombrePeriodo: string;
  anio: number;
  totalInscritos: number;
}

export interface ActividadReciente {
  idActividad: number;
  idPasantia: number;
  fecha: string;
  nombreEstudiante: string;
  nombreEmpresa: string;
  horasRegistradas: number;
  descripcion: string;
}

export interface PasantiasPorEstado {
  estado: string;
  total: number;
}

export interface DashboardAdmin {
  kpi: DashboardKPI;
  inscritosPorSemestre: InscritosPorSemestre[];
  empresasConMasOfertas: EmpresaOfertas[];
  inscritosPorPeriodo: InscritosPorPeriodo[];
  actividadesRecientes: ActividadReciente[];
  pasantiasPorEstado: PasantiasPorEstado[];
}
