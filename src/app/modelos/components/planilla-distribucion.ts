import { DetalleDistribucion } from './detalleDistribucion';

export class PlanillaDistribucion {
  idDistribucion!: number;

  fechaEntrega: any;

  idPersona!: number;

  dni?: number | null;

  nombre?: string | null;

  apellido?: string | null;

  unidadRecibe!: number;

  estadoEntrega!: number;

  usuarioEntrega!: number;

  usuarioRecibe?: number | null;

  fechaRecepcion?: Date | null;

  baja?: boolean;

  observacion?: string | null;

  activo: boolean;

  // Lista de radios entregadas
  detalles: DetalleDistribucion[];

  nombreUnidad?: string;

  constructor() {
    this.activo = true;
    this.detalles = [];
  }
}
