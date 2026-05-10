export interface Postulacion {
  idPostulacion: number;
  idOferta: number;
  idEstudiante: number;
  estado: string;
  fecha?: string;
  nombreEstudiante?: string;
  tituloOferta?: string;
  nombreEmpresa?: string;
  cvUrl?: string | null;
}
