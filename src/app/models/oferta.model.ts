export interface OfertaPasantia {
  idOferta: number;
  idResponsable: number | null;
  idEmpresa: number;
  titulo: string | null;
  descripcion: string | null;
  lugar: string | null;
  modalidad: string | null;
  remuneracion: boolean;
  fechaInicio: string;
  fechaFin: string;
  cupos: number;
  estado: string | null;
  nombreEmpresa: string | null;
  nombreResponsable: string | null;
  fechaCreacion?: string | null;
}
