export interface EvaluacionAdmin {
  idEvaluacion: number;
  idPasantia: number;
  idRubrica: number;
  idTutorEmpresarial: number;
  fechaEvaluacion: string;
  puntajeTotal: number | null;
  observacionGeneral: string;
}
