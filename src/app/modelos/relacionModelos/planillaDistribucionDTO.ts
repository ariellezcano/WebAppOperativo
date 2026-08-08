import { DetalleDistribucionDTO } from './detalleDistribucionDTO';

export interface PlanillaDistribucionDTO {
  idDistribucion: number;

  fechaEntrega: Date;

  idPersona: number;

  dni: number | null;

  nombre: string | null;

  apellido: string | null;

  unidadRecibe: number;

  nombreUnidad: string | null;

  estadoEntrega: number;

  nombreEstado: string | null;

  usuarioEntrega: number;

  nombreUsuarioEntrega: string | null;

  usuarioRecibe: number | null;

  nombreUsuarioRecibe: string | null;

  fechaRecepcion: Date | null;

  baja: boolean;

  observacion: string | null;

  activo: boolean;

  detalles: DetalleDistribucionDTO[];
}
